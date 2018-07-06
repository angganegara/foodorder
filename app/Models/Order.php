<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
	protected $hidden = ['ip_address', 'updated_at'];
	protected $appends = ['name', 'date', 'payment_formatted', 'order_status'];
	protected $fillable = ['total'];

	public function getNameAttribute()
	{
		return $this->fname .' '. $this->lname;
	}

  public function getDateAttribute()
  {
    return $this->created_at->format('d M y h:i A');
  }

  public function getPaymentFormattedAttribute()
  {
    switch ($this->payment) {
      case 'cash':
        return 'cash';
        break;
      case 'paypal':
        return 'Paypal';
        break;
      case 'creditcard':
        return $this->trx_type;
        break;
    }
  }

  public function getOrderStatusAttribute()
  {
    if ($this->payment == 'creditcard') {
      return $this->trx_status ? $this->trx_status : 'Aborted';
    } else if ($this->payment == 'paypal') {
      return 'Paid';
    } else {
      return '';
    }
  }

	public function ordercart()
	{
		return $this->hasMany('App\Models\OrderCart', 'order_id');
	}

	public function schedule()
	{
		return $this->hasMany('App\Models\OrderSchedule', 'order_id');
	}

  public function partner()
  {
    return $this->hasOne(\App\Models\Partner::class, 'id', 'partner_id');
  }
}
