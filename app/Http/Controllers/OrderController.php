<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Mail;

use App\Models\Order;
use App\Models\OrderCart;
use App\Models\OrderSchedule;
use App\Models\Partner;
use App\Models\ErrorLog;
use App\Helpers\OrderHelper;

class OrderController extends Controller
{
  protected $oh;

  public function __construct(\App\Helpers\OrderHelper $oh)
  {
    $this->oh = $oh;
	}

	public function createOrder(Request $request)
	{
		$order_number = $this->oh->createOrder($request);

		return $order_number;
	}

  public function sendOrder($order_number)
  {
	  return $this->oh->sendOrder($order_number);
  }

  public function resendOrder($order_number)
  {
    // call send order with param resend = true
    return $this->oh->sendOrder($order_number, true);
  }

  public function edit($id)
  {
    $order = Order::with('ordercart.schedule')->find($id);
    return view('admin.edit-order', compact('order'));
  }

  public function index(Request $request)
  {
		$orders = Order::orderBy('created_at', 'desc')->with('partner')->paginate(30);
		return view('admin.orders', compact('orders'));
  }

  public function show($ordernumber, $id)
  {
    $order = Order::where('id', $id)->with('partner')->with('ordercart.schedule')->first();
    return view('admin.order', compact('order'));
  }

  public function create()
  {
    return view('admin.new-order');
  }

  public function createMPOrder(Request $request)
  {
    $order = new Order;

    $form = $request->data;

    $order->order_number = time();
    $order->fname = $form['fname'];
    $order->lname = $form['lname'];
    $order->email = $form['email'];
    $order->phone = $form['phone'];
    $order->backend_order = 1;
    $order->delivery_price = intVal($form['delivery_price']);
    $order->coupon_code = intVal($form['coupon_value']) > 0 ? "Custom Coupon (Backend Order)" : "";
    $order->coupon_value = intVal($form['coupon_value']);
    $order->confirmed = 1;
    $order->email_sent = 1;
    $order->ip_address = $request->ip();
    $order->partner_id = 1;
    $order->payment = 'cash';
    $order->paypal_response = null;
    $order->subtotal = intVal($form['subtotal']);
    $order->total = intVal($form['total']);
    $order->paid = 1;
    $order->backend_order = 1;
    $order->menu_email_sent = 0;

    $order->save();

    // create new cart
    $oc = new OrderCart;

    $oc->order_id = $order->id;
    $oc->meal_id = intVal($form['category']['id']);
    $oc->meals = $form['category']['name'];
    $oc->package = 2;
    $oc->qty = 1;
    $oc->slimsunday = 0;
    $oc->subtotal = intVal($form['subtotal']);
    $oc->snacks_price = 0;
    $oc->slimsunday_price = 0;
    $oc->delivery_price = intVal($form['delivery_price']);
    $oc->total_price = intVal($form['total']);
    $oc->start_date = $form['dates'][0];
    $oc->duration = $form['duration'];
    $oc->end_date = $form['dates'][count($form['dates']) - 1];
    $oc->schedules_data = null;

    $oc->save();

    // loop items
    foreach ($form['items'] as $index => $sch) {
      // save schedule
      $sc = new OrderSchedule;

      $sc->order_id = $order->id;
      $sc->order_carts_id = $oc->id;
      $sc->name = $form['fname'] .' '. $form['lname'];
      $sc->date = $form['dates'][$index];
      $sc->meals = "B: {$sch['menu']['b']}<hr />S: {$sch['menu']['bs']}<hr />L: {$sch['menu']['l']}<hr />S: {$sch['menu']['ls']}<hr />D: {$sch['menu']['d']}";
      $sc->snacks = null;
      $sc->station = $sch['delivery'];

      $sc->save();
    }

    $return = [
      'id' => $order->id,
      'order_number' => $order->order_number
    ];

    if ($form['sendEmail']) {
      $this->oh->sendOrder($order->order_number);
    }

    return response($return);
  }

  public function schedule()
  {
    $today = Carbon::create();
    $schedules = OrderSchedule::where('date', $today->format('Y-m-d'))->whereHas('order', function ($query) {
      $query->where('paid', 1);
    })->get();

    return view('admin.schedule', compact('schedules', 'today'));
  }

  public function delete($id)
  {
    // delete order
    if ($this->oh->deleteOrder($id) === 'OK') {
      return redirect('/admin/orders?time='. time());
    };
  }

  public function sendLongPeriodOrder(Request $request)
  {
    $email = $request->email;
    $food = $request->food;

    try {
      Mail::send('emails.long-period', compact('email', 'food'), function ($m) use ($food) {
        $m
          ->from('no-reply@motionfitnessbali.com', 'Motion - Meal Plans')
          ->subject('New '. $food .' long-period order request')
          ->to('foodorder@motionfitnessbali.com', 'Motion - Meal Plans');
      });
    } catch (\Exception $e) {
      abort(500, 'CANNOT_SEND_MAIL');
    }

    return response('OK');
  }

  public function errorLog(Request $request)
  {
    $msg = $request->errorMessage;
    $data = json_encode($request->data);
    $ip = $request->ip();

    $err = new ErrorLog;
    $err->message = $msg;
    $err->request = $data;
    $err->ip_address = $ip;
    $err->save();

    try {
      Mail::send('emails.error', compact('err'), function ($m) {
        $m
          ->from('no-reply@motionfitnessbali.com', 'Motion - Meal Plans')
          ->subject('New error log')
          ->to('angga@me.com', 'Angga Negara');
      });
    } catch (\Exception $e) {
      // ...
    }

    return response('OK');
  }
}
