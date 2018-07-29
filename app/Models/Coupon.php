<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
	protected $dates = ['created_at', 'updated_at', 'promo_start', 'promo_end'];
	protected $appends = ['start', 'end'];
  protected $fillable = [
    'code', 'promo_start', 'promo_end', 'menu', 'discount_type', 'package_type', 'amount', 'item', 'min_order', 'max_order', 'limit_usage'
  ];

	public function getStartAttribute() {
		return $this->promo_start ? $this->promo_start->format('d F Y') : '-';
	}

	public function getEndAttribute() {
		return $this->promo_end ? $this->promo_end->format('d F Y') : '-';
	}
}
