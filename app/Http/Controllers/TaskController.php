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

class TaskController extends Controller
{
  protected $oh;
  protected $key;

  public function __construct(\App\Helpers\OrderHelper $oh)
  {
    $this->oh = $oh;
    $this->key = 'pdkjCgGyue';
  }

  public function paymentReminder()
  {
    if (request()->key != 'pdkjCgGyue') {
      return '';
    }

    $today = date('Y-m-d');
    $orders = Order::with(['ordercart'])
      ->where('payment', 'cash')
      ->where('cash_paid', null)
      ->where('backend_order', 1)
      ->whereHas('ordercart', function ($q) use ($today) {
        $q->where('start_date', $today);
      })
      ->get();

    if ($orders) {
      dd($orders);
      foreach ($orders as $order) {
        //$this->sendPaymentReminderEmail($order);
      }
    }

    return 'OK';
  }

  public function sendPaymentReminderEmail($order)
  {
    Mail::send('emails.reminder', compact('order'), function ($m) use ($order) {
      $m
        ->from('no-reply@motionfitnessbali.com', 'Motion - Meal Plans')
        ->subject('Payment Reminder')
        ->to($order->email, $order->fname . ' ' . $order->lname)
        ->replyTo('foodorder@motionfitnessbali.com', 'Motion - Meal Plans');
      }
    );

    return 'OK';
  }
}
