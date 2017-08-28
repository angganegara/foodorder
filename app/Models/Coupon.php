<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
	protected $dates = ['created_at', 'updated_at', 'promo_start', 'promo_end'];
	protected $appends = ['start', 'end'];

	public function getStartAttribute() {
		return $this->promo_start->format('d F Y');
	}

	public function getEndAttribute() {
		return $this->promo_end->format('d F Y');
	}
}