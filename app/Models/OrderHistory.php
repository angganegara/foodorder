<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderHistory extends Model
{
  protected $table = 'order_histories';

  protected $guarded = [];

  public function order()
  {
    return $this->belongsTo('App\Models\Order');
  }
}
