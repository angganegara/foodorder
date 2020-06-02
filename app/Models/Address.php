<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
	protected $casts = [
    'id' => 'integer',
    'customer_id' => 'integer'
  ];

  public function customer()
  {
    return $this->belongsTo(\App\Models\Customer::class);
  }
}
