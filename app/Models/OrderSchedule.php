<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class OrderSchedule extends Model
{
	public function order()
	{
		return $this->belongsTo('App\Models\Order', 'order_id', 'id');
	}

	public function ordercart()
	{
		return $this->belongsTo('App\Models\OrderCart', 'order_carts_id', 'id');
	}
}
