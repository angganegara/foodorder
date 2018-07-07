<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class OrderSchedule extends Model
{
  protected $appends = ['nice_date'];

	public function order()
	{
		return $this->belongsTo('App\Models\Order', 'order_id', 'id');
	}

	public function ordercart()
	{
		return $this->belongsTo('App\Models\OrderCart', 'order_carts_id', 'id');
	}

  public function getNiceDateAttribute()
  {
    return Carbon::parse($this->date)->format('d M y');
  }
}
