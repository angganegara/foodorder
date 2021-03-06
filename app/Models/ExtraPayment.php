<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExtraPayment extends Model
{
  protected $table = 'extra_payments';

  protected $guarded = [];

  public function order()
  {
    return $this->belongsTo('App\Models\Order');
  }
}
