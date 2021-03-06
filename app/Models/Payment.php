<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
	protected $guarded = [];

	protected $dates = [
		'created_at', 'updated_at', 'payment_date'
	];

    public function order()
    {
        return $this->belongsTo(\App\Models\Order::class, 'order_number', 'order_number');
    }
}
