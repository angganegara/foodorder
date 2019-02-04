<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
	protected $hidden = ['ip_address', 'updated_at', 'user_agent'];
	protected $appends = ['name', 'date', 'payment_formatted', 'order_status'];
  protected $fillable = ['total', 'menu_email_sent', 'cash_paid', 'cash_paid_date'];

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
      return !$this->paid && is_null($this->paypal_response) ? 'Incomplete' : 'Paid';
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

  public function openAmount()
  {
    $open = $this->total;

    switch ($this->payment) {
      case 'paypal':
        if ($this->paypal_response == 'Completed') {
          $open = 0;
        }
      break;

      case 'creditcard':
        if (
          strtoupper($this->trx_status) == 'ACCEPT'
          && ($this->trx_status_code == '200' || $this->trx_status_code == '202')
          && ($this->trx_status == 'settlement')
        ) {
          $open = 0;
        }
      break;

      case 'cash':
        $open = $this->total - $this->cash_paid;
      break;
    }

    return $open;
  }
}
