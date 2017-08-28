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
        $this->delivery_type = [
            'address1' => 'delivery',
            'address2' => 'delivery',
            'pickup1'  => 'pickup',
            'pickup2'  => 'pickup'
        ];
    }

    public function index($date='')
    {
        if ($date == '') {
			$date = date('Y-m-d');
        }
        
        $carbon = new Carbon($date);
		$orders = OrderSchedule::where('date', 'like', '%'. $carbon->format('l, d M Y') .'%')->get();
        $result = [];

        foreach ($orders as $order) {
            $result[] = [
                'id'                => $order->order->id,
                'name'              => $order->order->name,
                'menu'              => $order->ordercart->name,
                'breakfast_time'    => $order->breakfast_time,
                'breakfast_address' => $this->oh->getLocation($order->breakfast_location, $order->order),
                'lunch_time'        => $order->lunch_time,
                'lunch_address'     => $this->oh->getLocation($order->lunch_location, $order->order),
                'dinner_time'       => $order->dinner_time,
                'dinner_address'    => $this->oh->getLocation($order->dinner_location, $order->order),
                'allergies'         => $order->order->allergies,
                'intolerance'       => $order->order->intolerance,
                'dislike'           => $order->order->dislikefood
            ];
        }

        return response()->json($result);
    }
}
