<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderCart extends Model
{
	//protected $table = 'order_carts';

	public function order()
	{
		return $this->belongsTo('App\Model\Order');
	}

	public function schedule()
	{
		return $this->hasMany('App\Models\OrderSchedule', 'order_carts_id');
	}
}
