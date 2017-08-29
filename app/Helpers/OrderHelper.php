<?php

namespace App\Helpers;

use Carbon\Carbon;
use App\Models\Order;
use App\Models\OrderCart;
use App\Models\OrderSchedule;
use App\Models\Diet;
use Illuminate\Support\Facades\Mail;
use DB;

class OrderHelper
{
	public function urlToDomain($url)
	{
		$host = @parse_url($url, PHP_URL_HOST);

		if (!$host)
			$host = $url;

		if (substr($host, 0, 4) == "www.")
			$host = substr($host, 4);

		return $host;
	}

	public function getLocation($code, $order)
	{
		if ($code != 'pickup1' && $code != 'pickup2' && $code != 'wanderlust') {
			return nl2br($order->{$code});
		} else {
			return
				$code == 'pickup1'      ? 'Motion Cafe' :
				( $code == 'wanderlust' ? 'Wanderlust Gym'
				                        : 'Motion Studio' );
		}
	}

	public function isExtraDelivery($code, $order)
	{
		if ($code != 'pickup1' && $code != 'pickup2') {
			$name = $code .'_outside';
			if ($order->{$name}) {
				return '<br><span style="color: #aaa; font-size: 11px; font-style: italic;">extra delivery</span>';
			}
		}

		return false;
	}

	public function calculateExtraDelivery($order)
	{
		$found = 0;

		foreach ($order->ordercart as $val) {
			foreach ($val['schedule'] as $sc) {
				if ($sc->breakfast_location != '' || $sc->lunch_location != '' || $sc->dinner_location != '') {
					if ($order->address1_outside) {
						if ($sc->breakfast_location == 'address1' ||
							$sc->lunch_location == 'address1' ||
							$sc->dinner_location == 'address1') {
							$found += 1;
						}
					}
					if ($order->address2_outside) {
						if ($sc->breakfast_location == 'address2' ||
							$sc->lunch_location == 'address2' ||
							$sc->dinner_location == 'address2') {
							$found += 1;
						}
					}
				}
			}
		}

		return $found;
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

	public function createOrder($request)
	{
		// check referral
        $url = $this->urlToDomain($request->url());
		$referral = '';
		
        if ($url === 'balimma.avocadocafebali.com') {
            $referral = 'balimma';
        }
		if ($url === 'wanderlust.motionfitnessbali.com') {
			$referral = 'wanderlust';
		}

        $order = new Order;

    	$form     = $request->form;
    	$schedule = $request->schedule;
		$address  = $request->address;
		
		$order->order_number = time();
    	$order->fname = $form['fname'];
    	$order->lname = $form['lname'];
    	$order->email = $form['email'];
    	$order->phone = $form['phone'];
    	$order->intolerance = $form['intolerancesText'];
    	$order->allergies = $form['allergiesText'];
    	$order->dislikefood = $form['dislikefood'];
    	$order->extraprice = $form['deliveryprice'];
		$order->discount = $form['discount'];
		$order->coupon = $form['coupon'];
		$order->coupon_value = $form['couponValue'];
		$order->coupon_item = $form['couponItem'];
    	$order->confirmed = 0;
    	$order->comments = $form['comments'];
    	$order->ip_address = $request->ip();
        $order->address1 = $address['address1'];
        $order->address1_outside = 0;
        $order->address2 = $address['address2'];
        $order->address2_outside = 0;
		$order->referral = $referral;
		$order->payment = $request->methods;
		$order->paypal_response = null;
		$order->paid = 0;
    	$order->save();

        // save cart content
    	foreach ($request->cart as $cart) {

    		$oc = new OrderCart;

    		$oc->order_id = $order->id;
    		$oc->item_id = $cart['id'];
    		$oc->name = $cart['name'];
    		$oc->subname = $cart['subname'];
    		$oc->price = $cart['price'];
    		$oc->type = $cart['type'];
    		$oc->typeraw = $cart['typeraw'];
    		$oc->qty = $cart['qty'];
    		$oc->easysunday = $cart['easysunday'];
    		$oc->totaldays = intVal($cart['totaldays']);

    		$oc->save();

    		foreach ($schedule[$cart['id']] as $sch) {
    			// save schedule
    			$sc = new OrderSchedule;

    			$sc->order_id = $order->id;
    			$sc->item_id = $cart['id'];
    			$sc->order_carts_id = $oc->id;
    			$sc->date = $sch['date'];
    			$sc->breakfast_time = $sch['breakfast'];
                $sc->breakfast_location = $sch['breakfastLocation'];
    			$sc->lunch_time = $sch['lunch'];
                $sc->lunch_location = $sch['lunchLocation'];
                $sc->dinner_time = $sch['dinner'];
                $sc->dinner_location = $sch['dinnerLocation'];

    			$sc->save();
    		}
    	}

		// send order
		return $order->order_number;
	}

	public function sendOrder($order_number, $resend=false)
	{
		$that = $this;
		$order = Order::where('order_number', $order_number)->with('ordercart.schedule')->first();
		
		$orderid = $order->id;
		// extra delivery ?
		$extra = $this->calculateExtraDelivery($order);
		// get order
		$oc = OrderCart::where('order_id', $orderid)->get();
		// include protein ?
		$hp = $oc->where('item_id', 10)->count();
		// veggie detox
		$dtv = $oc->where('item_id', 7)->count();
		// soup detox
		$dts = $oc->where('item_id', 19)->count();
		// juice detox
		$dtj = $oc->where('item_id', 20)->count();
		// slim booster diet
		$sbd = $oc->where('item_id', 15)->count();
		// customized menu ?
		$cd = $oc->where('item_id', 6)->count();
		// include ayurveda diet?
		$ay = $oc->where('item_id', 2)->count();
		// parse cart
		//return view('emails.order', compact('order', 'that', 'extra'));
		
		// pdfs
		$pdf = rtrim(app()->basePath('public/pdf/payment-details.pdf'), '/');
		$pdf_hp = rtrim(app()->basePath('public/pdf/high-protein-diet.pdf'), '/');
		$pdf_dt = rtrim(app()->basePath('public/pdf/detox-questionnaire.pdf'), '/');
		$pdf_ayu1 = rtrim(app()->basePath('public/pdf/ayurveda-information.pdf'), '/');
		$pdf_ayu2 = rtrim(app()->basePath('public/pdf/ayurveda-test.pdf'), '/');

		$email_layout = $resend ? 'emails.resend' : 'emails.order';
		$email_subject = $resend ? 'Payment Reminder' : 'Motion Cafe - Food order';
		
		try {
			Mail::send($email_layout, compact('order', 'items', 'that', 'extra'),
				function ($m) use (
					$order, $pdf, $pdf_hp, $hp, $pdf_dt, $ay, $pdf_ayu1, $pdf_ayu2,
					$dtv, $dts, $dtj, $sbd, $cd, $email_subject, $resend
				) {
					$m
						->from('no-reply@motionfitnessbali.com', 'Motion Cafe Bali')
						->to($order->email, $order->fname .' '. $order->lname)
						->replyTo('foodorder@motionfitnessbali.com', 'Motion Cafe Bali');
						//->cc('foodorder@avocadocafebali.com', 'Motion Cafe Bali');

					if ($order->referral == 'balimma') {
						// bali mma order - cc to roland and bali mma
						$m
							->bcc('roland@motionfitnessbali.com', 'Roland')
							->bcc('balitrainingcamp@gmail.com', 'Bali MMA');
					}

					if ($order->referral == 'wanderlust') {
						// wanderlust order - cc to ?
						$m
							->bcc('jake.j.richards@gmail.com', 'Jake')
							->bcc('contact@crossfitwanderlust.com', 'Wanderlust Gym')
							->bcc('roland@motionfitnessbali.com', 'Roland');
					}

					$m->subject($email_subject);

					if ($hp > 0) {
						if (!$resend) {
							$m->attach($pdf_hp, ['as' => 'High Protein Diet I or II.pdf']);
						}
					}
					// if contain detox category ... and / or customized diet
					if ($dtv > 0 || $dts > 0 || $dtj > 0 || $sbd > 0 || $cd > 0) {
						if (!$resend) {
							$m->attach($pdf_dt, ['as' => 'Detox Questionnaire.pdf']);
						}
					}
					// if contain detox veggie
					if ($dtv != '') {
						if (!$resend) {
							$m->attach(
								rtrim(app()->basePath('public/pdf/veggy-and-fruit-detox-info.pdf'), '/'),
								['as' => 'Veggy and Fruit Detox Info.pdf']
							);
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
					// ayurveda pdf
					if ($ay != '') {
						if (!$resend) {
							$m->attach($pdf_ayu1, ['as' => 'Ayurveda Information.pdf']);
							$m->attach($pdf_ayu2, ['as' => 'Ayurveda Test.pdf']);
						}
					}
				}
			);
		}
		catch (\Exception $e) {
			// delete order only if not resend!!!!
			if (!$resend) {
				$this->deleteOrder($order_number);
			}
			// log in
			return response()->json('CANNOT_SEND_MAIL', 422);
		}

		return 'OK';
	}

	public function parseCart($order)
	{
		$data = json_decode($order->cart, true);
		$total = 0;
		foreach ($data as $item) {
			$food = Diet::find($item['id']);
			$price = 0;
			$mealOpt = '';
			$easySunday = false;
			$subname = '';
			if ($item['meal'] == 'singlemeal') {
				// different price calculation
				$mealOpt = 'Single meal';
				foreach ($item['singleMeal'] as $type => $value) {
					if ($value) {
						$price += $food->priceByType($type, 'price');
						$subname .= $type .', ';
					}
				}
				$price = $price * intVal($item['totalDays']);
				if ($subname != '') {
					$subname = substr($subname, 0, -2);
				}
			} else {
				$pricedata = $food->prices->where('type', $item['meal'])->first();
				$mealOpt = $pricedata->name;
				$price = $pricedata->price;
				$subname = $pricedata->description;

				if ($item['meal'] == 'weekly') {
					if ($item['easySunday']) {
						$sundayprice = $food->prices->where('type', 'sunday')->first();
						$sp = $sundayprice->price;

						$subname = " and Easy Sunday";
						$price += $sp;
					}
				}

				if ($item['meal'] == 'fullday') {
					// calculate by total days
					$price = $price * intVal($item['totalDays']);
				}
			}

			// if detox
			if ($food->id == 7) {
				// detox
				$food->name = $item['detox'];
			}

			// if total days > 1
			if ($item['totalDays'] != '' && $item['totalDays'] > 0) {
				$item['deliverydates']['date'] = $this->generateDays($item['deliverydates']['date'], $item['totalDays']);
			}

			$arr[] = [
				'id'            => $food->id,
				'name'          => $food->name,
				'subname'       => $subname,
				'price'         => $price,
				'type'          => $mealOpt,
				'typeraw'       => $item['meal'],
				'easysunday'    => $item['easySunday'],
				'totaldays'     => $item['totalDays'],
				'qty'           => $item['qty'],
				'deliverydate'  => $item['deliverydates']['date'],
				'deliverydates' => $item['deliverydates'],
				'subtotal'      => $price * $item['qty']
			];
			$total += $price * $item['qty'];
		}

		$arr['total'] = $total;
		return $arr;
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
