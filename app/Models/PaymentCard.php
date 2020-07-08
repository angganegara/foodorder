<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentCard extends Model
{
	protected $guarded = [];

	protected $dates = [
		'created_at', 'updated_at'
	];

    public function order()
    {
        return $this->belongsTo(\App\Models\Order::class, 'order_number', 'order_number');
    }
}
