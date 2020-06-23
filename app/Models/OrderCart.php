<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class OrderCart extends Model
{
  //protected $table = 'order_carts';
  protected $hidden = ['schedules_data'];
  protected $appends = ['package_name', 'date_period', 'parsed_price'];

	public function order()
	{
		return $this->belongsTo('App\Model\Order');
	}

	public function schedule()
	{
		return $this->hasMany('App\Models\OrderSchedule', 'order_carts_id');
	}

  public function getPackageNameAttribute()
  {
    return $this->package == "1" ? "6-day package" : "Single days";
  }

  public function getDatePeriodAttribute()
  {
    $start = Carbon::parse($this->start_date)->format('d M y');
    $end = Carbon::parse($this->end_date)->format('d M y');
    return $start .' &mdash; '. $end;
  }

  public function getParsedPriceAttribute()
  {
    return number_format($this->total_price, 0);
  }

  public function diet()
  {
    return $this->belongsTo(\App\Models\Diet::class, 'meal_id', 'id');
  }
}
