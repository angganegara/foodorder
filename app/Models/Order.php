<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
  protected $with = ['paymentCard'];
	protected $hidden = ['ip_address', 'updated_at', 'user_agent'];
	protected $appends = ['name', 'date', 'payment_formatted', 'order_status'];
  protected $fillable = ['total', 'menu_email_sent', 'cash_paid', 'cash_paid_date', 'email_payment_reminder', 'payment_comment', 'paid'];

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
        return 'Credit Card';
        break;

      case 'banktransfer':
        return 'Bank Transfer';
        break;
    }
  }

  public function getOrderStatusAttribute()
  {
    if ($this->payment == 'creditcard') {
      if ($this->trx_status) {
        return '<span class="is-uppercase has-text-success">'. $this->trx_status .'</span>';
      }
      if ($this->paymentCard && !$this->trx_status) {
        return $this->paymentCard->statuscode !== '0000' ? '<span class="is-uppercase has-text-danger">FAILED</span>' : '<span class="is-uppercase has-text-success">SUCCESS</span>';
      }

      return '<span class="is-uppercase has-text-grey">ABORTED</span>';
    } else if ($this->payment == 'paypal') {
      return !$this->paid && is_null($this->paypal_response) ? '<span class="has-text-warning is-uppercase">Pending</span>' : '<span class="has-text-success is-uppercase">Paid</span>';
    } else if ($this->payment == 'banktransfer') {
      return $this->openAmount() > 0 ? '<span class="has-text-info is-uppercase">Pending</span>' : '<span class="has-text-success is-uppercase">Paid</span>';
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

  public function payments()
  {
    return $this->hasOne(\App\Models\Payment::class, 'order_number', 'order_number');
  }

  public function paymentCard()
  {
    return $this->hasOne(\App\Models\PaymentCard::class, 'order_number', 'order_number');
  }

  public function extra_payment()
  {
    return $this->hasMany('App\Models\ExtraPayment');
  }

  public function total_extra()
  {
    return $this->extra_payment()->pluck('amount')->sum();
  }

  public function history()
  {
    return $this->hasMany('App\Models\OrderHistory');
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
        $open = $this->total - ($this->cash_paid + $this->total_extra());
      break;

      case 'banktransfer':
        $open = $this->total;
        if ($this->payments()->count() > 0) {
          $open = $this->total - intVal($this->payments->amount);
        }
    }

    return $open;
  }
}
