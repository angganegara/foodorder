<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use DB;

use App\Models\Order;
use App\Models\OrderCart;
use App\Models\OrderSchedule;
use App\Helpers\OrderHelper;

class ScheduleController extends Controller
{
  protected $oh;
  protected $delivery_type;

  public function __construct(OrderHelper $oh)
  {
    $this->oh = $oh;
  }

  public function index($date='')
  {
    if ($date == '') {
		  $date = date('Y-m-d');
    }

    $carbon = new Carbon($date);
		$orders = OrderSchedule::where('date', 'like', '%'. $carbon->format('l, d M Y') .'%')->with('order')->whereHas('order', function ($query) {
			$query->where('paid', 1);
		})->get();

    return response()->json($orders);
  }
}
