<?php

namespace App\Helpers;

use Carbon\Carbon;
use App\Models\Order;
use App\Models\OrderCart;
use App\Models\OrderSchedule;
use App\Models\Diet;
use App\Models\Partner;
use App\Models\Item;
use App\Models\Cart;
use Illuminate\Support\Facades\Mail;

class OrderHelper
{
  public function urlToDomain($url)
  {
    $host = @parse_url($url, PHP_URL_HOST);

    if (!$host) {
      $host = $url;
    }

    if (substr($host, 0, 4) == 'www.') {
      $host = substr($host, 4);
    }

    return $host;
  }

  public function getLocation($code, $order)
  {
    if ($code != 'pickup1' && $code != 'f45' && $code != 'pickup2' && $code != 'wanderlust' && $code != 'nirvana') {
      return nl2br($order->{$code});
    } else {
      switch ($code) {
        case 'pickup1':
          return 'Motion Cafe';
          break;
        case 'pickup2':
          return 'Motion Studio';
          break;
        case 'wanderlust':
          return 'Wanderlust Gym';
          break;
        case 'nirvana':
          return 'Nirvana Strength';
          break;
        case 'f45':
          return 'F45 Bali';
          break;
      }
    }
  }

  public function isExtraDelivery($code, $order)
  {
    if ($code != 'pickup1' && $code != 'pickup2' && $code != 'f45' && $code != 'wanderlust' && $code != 'nirvana') {
      $name = $code . '_outside';
      if ($order->{$name}) {
        return '<br><span style="color: #aaa; font-size: 11px; font-style: italic;">extra delivery</span>';
      }
    }

    return false;
  }

  public function updatePaypalStatus($order_number, $status)
  {
    $order = Order::where('order_number', $order_number)->first();
    $order->paypal_response = $status;

    if (!strcasecmp($status, 'Completed') || !strcasecmp($status, 'Processed')) {
      $order->paid = 1;
    } else {
      $order->paid = 0;
    }

    $order->save();

    return $order->paid;
  }

  public function listSnacks($sch, $snacks)
  {
    $array = $sch['snacks'];

    if (count($array) > 0) {
      $map = array_map(function($snack) use ($sch, $snacks) {
        $options = [];
        if (array_key_exists('snackOptions', $sch) && array_key_exists($snack, $sch['snackOptions'])) {
          $snacks[$snack]->protein !== null ? array_push($options, $sch['snackOptions'][$snack]['protein']) : '';
          $snacks[$snack]->flavour !== null ? array_push($options, $sch['snackOptions'][$snack]['flavour']) : '';
        }
        $qty = array_key_exists('snacksQty', $sch) ? ' ('. $sch['snacksQty'][$snack] .'x)' : '';
        $options = count($options) > 0 ? ' ('. implode(', ', $options) .')' : '';
        return $snacks[$snack]->name . $options . $qty;
      }, $array);
      return implode(', ', $map);
    }

    return null;
  }

  public function createOrder($request)
  {
    // check referral
    $url = $this->urlToDomain($request->url());
    $referral = '';

    $partner = Partner::where('domain', $url);
    $snacks = Item::all(['id', 'name', 'price', 'flavour', 'protein'])->keyBy('id');
    $stations = Partner::all(['id', 'station'])->keyBy('id');
    $cartDB = Cart::where('cart_key', $request->cartKey)->first();
    $cartData = json_decode($cartDB->cart, true);

    $order = new Order;
    $total = 0;
    $slimSundayPrice = 300000;

    $form = $request->form;

    $order->order_number = time();
    $order->fname = $form['fname'];
    $order->lname = $form['lname'];
    $order->email = $form['email'];
    $order->phone = $form['phone'];
    $order->delivery_price = $request->has('deliveryPrice') ? $request->deliveryPrice : 0;
    $order->delivery_discount = $form['discount'];
    $order->coupon_code = $form['coupon'];
    $order->coupon_value = $form['couponValue'];
    $order->coupon_message = isset($form['couponItem']) ? $form['couponItem'] : null;
    $order->confirmed = 0;
    $order->email_sent = 0;
    $order->comments = $form['comments'];
    $order->ip_address = $request->ip();
    $order->partner_id = $partner->count() > 0 ? $partner->first()->id : 1;
    $order->payment = $request->methods;
    $order->paypal_response = null;
    $order->subtotal = $request->subTotal;
    $order->total = 0;
    $order->paid = $request->methods == 'cash' ? 1 : 0;
    $order->user_agent = $request->userAgent;

    $order->save();

    // save cart content
    foreach ($cartData as $cart) {
      $oc = new OrderCart;

      $oc->order_id = $order->id;
      $oc->meal_id = intVal($cart['id']);
      $oc->meals = $cart['title'];
      $oc->package = $cart['packageId'];
      $oc->qty = $cart['qty'];
      $oc->slimsunday = $cart['slimSunday'];
      $oc->subtotal = intVal($cart['foodPrice']) * intVal($cart['qty']);
      $oc->snacks_price = $cart['snacksPrice'];
      $oc->slimsunday_price = intVal($cart['slimSunday']) == 1 ? $slimSundayPrice : 0;
      $oc->delivery_price = intVal($cart['deliveryPrice']);
      $oc->total_price = $oc->subtotal + $oc->slimsunday_price + $oc->snacks_price + $oc->delivery_price;
      $oc->start_date = $cart['dateStart'];
      $oc->end_date = $cart['dateEnd'];
      $oc->schedules_data = json_encode($cart['schedules']);

      if ($cart['schedules'] == '' || is_null($cart['schedules']) || count($cart['schedules']) <= 0) {
        return response()->json('EMPTY-SCHEDULES', 500);
        exit;
      }

      $total += $oc->total_price;

      $oc->save();

      foreach ($cart['schedules'] as $sch) {
        // save schedule
        $sc = new OrderSchedule;

        $sc->order_id = $order->id;
        $sc->order_carts_id = $oc->id;
        $sc->name = $form['fname'] .' '. $form['lname'];
        $sc->date = $sch['date'];
        $sc->meals = $cart['title'];
        $sc->snacks = $this->listSnacks($sch, $snacks);
        $sc->station = $sch['pickup'] != 'address' ? $stations[$sch['pickup']]->station : $sch['address'];
        $sc->area = $sch['pickup'] == 'address' ? $sch['area'] : null;
        $sc->station_id = $sch['pickup'] != 'address' ? $sch['pickup'] : null;

        $sc->save();
      }
    }

    $order->update([
      'subtotal' => $total,
      'total' => ($total - $order->coupon_value)
    ]);

    // send order
    return $order->order_number;
  }

  public function sendOrder($order_number, $resend = false)
  {
    $that = $this;
    $order = Order::where('order_number', $order_number)->with('ordercart.schedule')->first();

    $orderid = $order->id;
    // extra delivery ?
    $extra = 0;
    // get order
    $oc = OrderCart::where('order_id', $orderid)->get();
    // include protein ?
    $hp = $oc->where('item_id', 7)->count();
    // soup detox
    $dts = $oc->where('item_id', 10)->count();
    // juice detox
    $dtj = $oc->where('item_id', 11)->count();
    // slim booster diet
    $sbd = $oc->where('item_id', 12)->count();
    // parse cart
    //return view('emails.order', compact('order', 'that', 'extra'));
    //exit();

    // pdfs
    $pdf = rtrim(app()->basePath('public/pdf/payment-details.pdf'), '/');
    $pdf_hp = rtrim(app()->basePath('public/pdf/high-protein-diet.pdf'), '/');
    $pdf_dt = rtrim(app()->basePath('public/pdf/detox-questionnaire.pdf'), '/');
    $pdf_ayu1 = rtrim(app()->basePath('public/pdf/ayurveda-information.pdf'), '/');
    $pdf_ayu2 = rtrim(app()->basePath('public/pdf/ayurveda-test.pdf'), '/');

    $email_layout = $resend ? 'emails.resend' : 'emails.order';
    $email_subject = $resend ? 'Payment Reminder' : 'Motion - meal plan order confirmation';

    try {
      Mail::send(
        $email_layout,
        compact('order', 'items', 'that', 'extra'),
        function ($m) use (
          $order, $pdf, $pdf_hp, $hp, $pdf_dt, $pdf_ayu1, $pdf_ayu2,
          $dts, $dtj, $sbd, $email_subject, $resend
        ) {
          $m
            ->from('no-reply@motionfitnessbali.com', 'Motion - Meal Plans')
            ->to($order->email, $order->fname . ' ' . $order->lname)
            ->cc('foodorder@motionfitnessbali.com', 'Motion Cafe Bali')
            ->replyTo('foodorder@motionfitnessbali.com', 'Motion - Meal Plans');

          // get bcc we need
          $bcc = [];
          $partner = Partner::find($order->partner_id);
          if ($order->partner_id != 1 && $order->partner_id != 2) {
            if ($partner && $partner->bcc != '') {
              $bcc = explode(',', $partner->bcc);
            }
          }

          if (count($bcc) > 0) {
            foreach ($bcc as $recipient) {
              $m->bcc(trim($recipient), $partner->name);
            }
          }

          $m->subject($email_subject);

          if ($hp > 0) {
            if (!$resend) {
              $m->attach($pdf_hp, ['as' => 'High Protein Diet I or II.pdf']);
            }
          }
          // if contain detox category ... and / or customized diet
          if ($dts > 0 || $dtj > 0 || $sbd > 0) {
            if (!$resend) {
              $m->attach($pdf_dt, ['as' => 'Detox Questionnaire.pdf']);
            }
          }
          // if contain juice veggie
          if ($dtj != '') {
            if (!$resend) {
              $m->attach(
                  rtrim(app()->basePath('public/pdf/juice-detox-info.pdf'), '/'),
                  ['as' => 'Juice Detox Info.pdf']
                );
            }
          }
          // if contain soup veggie
          if ($dts != '') {
            if (!$resend) {
              $m->attach(
                  rtrim(app()->basePath('public/pdf/soup-detox-info.pdf'), '/'),
                  ['as' => 'Soup Detox Info.pdf']
                );
            }
          }
          // if contain slim booster
          if ($sbd != '') {
            if (!$resend) {
              $m->attach(
                  rtrim(app()->basePath('public/pdf/slim-booster-detox-info.pdf'), '/'),
                  ['as' => 'Slim Booster Detox Info.pdf']
                );
            }
          }

        }
      );
    } catch (\Exception $e) {
      // delete order only if not resend!!!!
      if (!$resend) {
        //$this->deleteOrder($order->id);
      }
      // log in
      abort(500, 'CANNOT_SEND_MAIL');
    }

    // set email flag
    $order->email_sent = 1;
    $order->save();

    return 'OK';
  }

  public function deleteOrder($order_number)
  {
    $order = Order::where('order_number', $order_number)->first();
    // delete order cart
    OrderCart::where('order_id', $order->id)->delete();
    // delete order schedule
    OrderSchedule::where('order_id', $order->id)->delete();
    // delete order
    $order->delete();

    return 'OK';
  }

  public function generateDays($start, $total)
  {
    $carbon = new Carbon();
    $format = 'l, d M Y';
    $carbon = Carbon::createFromFormat($format, $start);
    if ($total == 1) {
      return $carbon->format('l, d M Y');
    } else {
      $startdate = $carbon;
      $dates = [];
      $k = 0;
      $dateCheck = '';
      $dates[0] = $startdate->format('l, d M Y');
      for ($i = 1; $i < $total; $i++) {
        $k = $startdate->format('D') == 'Sat' ? 2 : 1;
        $dateCheck = $startdate->addDays($k);
        $dates[$i] = $dateCheck->format('l, d M Y');
      }

      return join('. ', $dates);
    }

    return $carbon;
  }
}
