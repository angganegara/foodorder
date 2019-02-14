<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Mail;
use Excel;

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

  public function edit($id)
  {
    $order = Order::with('ordercart.schedule')->find($id);
    return view('admin.edit-order', compact('order'));
  }

  public function sendMPEmail(Request $request, $id)
  {
    $order = Order::find($id);
    $this->oh->sendMPEmail($order->order_number);
    $order->update(['menu_email_sent' => 1]);

    return response('OK');
  }

  public function update(Request $request)
  {
    $form = $request->data;

    $order = Order::find($form['orderID']);

    $order->fname = $form['fname'];
    $order->lname = $form['lname'];
    $order->email = $form['email'];
    $order->phone = $form['phone'];
    $order->comments = $form['comments'];
    $order->backend_order = 1;
    $order->delivery_price = intVal($form['delivery_price']);
    $order->coupon_value = intVal($form['coupon_value']);
    $order->confirmed = 1;
    $order->subtotal = intVal($form['subtotal']);
    $order->total = intVal($form['total']);
    $order->backend_order = 1;

    $order->save();

    $oc = OrderCart::find($form['cartID']);

    $oc->start_date = $form['dates'][0];
    $oc->duration = $form['duration'];
    $oc->end_date = $form['dates'][count($form['dates']) - 1];
    $oc->schedules_data = null;

    $oc->save();

    // delete schedule
    OrderSchedule::where('order_carts_id', $form['cartID'])->delete();

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

    return response($return);
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
    $order->gender = $form['gender'];
    $order->phone = $form['phone'];
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
    $oc->eco_price = 0;
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

  public function schedule(Request $request)
  {
    $today = $request->has('date') ? new Carbon($request->date) : Carbon::today();

    $schedules = OrderSchedule::where('date', $today->format('Y-m-d'))->whereHas('order', function ($query) {
      $query->where('paid', 1);
    })->get();
    $tomorrow = $today->addDay()->format('Y-m-d');
    $yesterday = $today->subDays(2)->format('Y-m-d');
    $today->addDay();

    $result = collect([]);
    if ($schedules) {
      foreach ($schedules as $sc) {
        $result->push([
          'name' => $sc->name,
          'address' => $sc->station,
          'menu' => $sc->ordercart->meals,
          'gender' => $sc->order->gender,
          'eco' => $sc->ordercart->eco_price > 0,
          'snacks' => $sc->snacks,
          'md5' => md5(trim($sc->station)),
          'payment' => $sc->order->payment,
          'total' => $sc->order->total,
          'open' => $sc->order->openAmount()
        ]);
      }
    }

    $result = $result->groupBy('md5')->toArray();

    return view('admin.schedule', compact('result', 'today', 'yesterday', 'tomorrow'));
  }

  public function kitchen(Request $request)
  {
    $today = $request->has('date') ? new Carbon($request->date) : Carbon::today();
    if (!$request->has('date')) { $today->addDay(); }

    $schedules = OrderSchedule::with(['order', 'ordercart'])->where('date', $today->format('Y-m-d'))->whereHas('order', function ($query) {
      $query->where('paid', 1);
    })->get();
    $tomorrow = $today->addDay()->format('Y-m-d');
    $yesterday = $today->subDays(2)->format('Y-m-d');
    $today->addDay();

    $result = collect([]);
    if ($schedules) {
      foreach ($schedules as $sc) {
        $result->push([
          'name' => $sc->name,
          'meals' => $sc->meals,
          'menu' => $sc->ordercart->meals,
          'gender' => $sc->order->gender,
          'comments' => $sc->order->comments,
          'eco' => $sc->ordercart->eco_price > 0,
          'snacks' => $sc->snacks,
          'md5' => md5(trim($sc->meals))
        ]);
      }
    }

    $result = $result->groupBy('md5')->toArray();

    return view('admin.kitchen', compact('result', 'today', 'yesterday', 'tomorrow'));
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
    $day = $request->day;

    try {
      Mail::send('emails.long-period', compact('email', 'food', 'day'), function ($m) use ($food) {
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

  public function recommendation()
  {
    return view('admin.recommendation');
  }

  public function showRecommendation(Request $request)
  {
    if (!$request->ajax()) {
      exit;
    }

    $orders = $this->getRecommendation($request);
    return response($orders->toArray());
  }

  public function getRecommendation($request)
  {
    $orders = null;
    if ($request->dates == '') { return response('Please select the dates', 500); }

    list ($start, $finish) = $this->formatDates($request->dates);

    $orders = Order::where('paid', 1)
                    ->where('created_at', '>=', $start)
                    ->where('created_at', '<=', $finish .' 23:59:59')
                    ->get();

    return $orders;
  }

  public function formatDates($dates)
  {
    return [
      Carbon::parse($dates[0])->format('Y-m-d'),
      Carbon::parse($dates[1])->format('Y-m-d')
    ];
  }

  public function updatePayment(Request $request, $id)
  {
    $date = explode('/', $request->date);
    $newDate = $date[2] .'-'. $date[1] .'-'. $date[0];
    $order = Order::find($id)->update([
      'cash_paid' => $request->amount,
      'cash_paid_date' => $newDate
    ]);

    return response('OK');
  }

  public function exportRecommendationExcel(Request $request)
  {
    $format = $request->format;
    $orders = $this->getRecommendation($request);
    list ($start, $finish) = $this->formatDates($request->dates);

    $filename = 'Recommendation-Report-'. Carbon::parse($start)->format('d-M-Y') .'-to-'. Carbon::parse($finish)->format('d-M-Y');

    Excel::create($filename, function ($excel) use ($filename, $orders) {
      $excel->setTitle($filename);
      $excel->sheet('Sheet 1', function ($sheet) use ($orders) {
        $sheet->setColumnFormat(['D' => '0']);
        $sheet->row(1, [
          'Order number',
          'Date',
          'Name',
          'Where Did You Learn About Us?',
          'Motion Name',
        ]);
        foreach ($orders as $order) {
          $sheet->appendRow([
            $order->order_number,
            $order->date,
            $order->name,
            $order->learn_how,
            ($order->learn_name ? $order->learn_name : '-')
          ]);
        }
      });
    })->store($format, public_path('excel'));

    return response(asset('excel/'. $filename .'.'. $format));
  }
}
