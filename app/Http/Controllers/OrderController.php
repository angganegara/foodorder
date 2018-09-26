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

  public function schedule()
  {
    $today = Carbon::create();
    $schedules = OrderSchedule::where('date', $today->format('Y-m-d'))->whereHas('order', function ($query) {
      $query->where('paid', 1);
    })->get();

    return view('admin.schedule', compact('schedules', 'today'));
  }

  public function update($id, Request $request)
  {
    $form = $request->form;
		$cart = $request->cart;
		$order = Order::find($id);

		$order->fname = $form['fname'];
		$order->lname = $form['lname'];
		$order->email = $form['email'];
		$order->phone = $form['phone'];
		$order->intolerance = $form['intolerance'];
		$order->allergies = $form['allergies'];
		$order->dislikefood = $form['dislikefood'];
		$order->extraprice = $form['extraprice'];
		$order->comments = $form['comments'];
		$order->save();

		// save carts ?
		foreach ($cart as $item) {
			$c = OrderCart::find($item['id']);
			$c->price = $item['price'];
			$c->save();
		}

		return 'OK';
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
          ->to('angga@me.com', 'Motion - Meal Plans');
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
