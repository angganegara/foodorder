<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
	protected $hidden = ['ip_address', 'updated_at'];
	protected $appends = ['name', 'date'];

	public function getNameAttribute()
	{
		return $this->fname .' '. $this->lname;
	}

	public function getDateAttribute()
	{
		return $this->created_at->format('l, d M Y');
	}

	public function ordercart()
	{
		return $this->hasMany('App\Models\OrderCart', 'order_id');
	}

	public function schedule()
	{
		return $this->hasMany('App\Models\OrderSchedule', 'order_id');
	}
}
