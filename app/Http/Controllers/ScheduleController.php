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
    $this->middleware('staff');
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

    return view('schedule', compact('schedules', 'today', 'yesterday', 'tomorrow'));
  }

  public function kitchen(Request $request)
  {
    $today = $request->has('date') ? new Carbon($request->date) : Carbon::today();
    if (!$request->has('date')) { $today->addDay(); }

    $schedules = OrderSchedule::where('date', $today->format('Y-m-d'))->whereHas('order', function ($query) {
      $query->where('paid', 1);
    })->get();
    $tomorrow = $today->addDay()->format('Y-m-d');
    $yesterday = $today->subDays(2)->format('Y-m-d');
    $today->addDay();

    return view('kitchen', compact('schedules', 'today', 'yesterday', 'tomorrow'));
  }
}
