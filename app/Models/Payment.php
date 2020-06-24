<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
	protected $guarded = [];

    public function order()
    {
        return $this->belongsTo(\App\Models\Order::class, 'order_number', 'order_number');
    }
}
