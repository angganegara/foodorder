<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Coupon;

class CouponController extends Controller
{
	public function index() {
		return Coupon::take(50)->get();
	}

	public function show($id) {
		return Coupon::findOrFail($id);
	}

	public function update($id, Request $request) {
		$coupon = Coupon::find($id);

		$coupon->code = $request->code;
		$coupon->promo_start = $request->promo_start;
		$coupon->promo_end = $request->promo_end;
		$coupon->menu = json_encode($request->menu);
		$coupon->discount_type = $request->discount_type;
		$coupon->amount = $request->amount;
		$coupon->item = $request->item;

		$coupon->save();
		return 'OK';
	}

	public function insert(Request $request) {
		$coupon = new Coupon;
		
		$coupon->code = $request->code;
		$coupon->promo_start = $request->promo_start;
		$coupon->promo_end = $request->promo_end;
		$coupon->menu = json_encode($request->menu);
		$coupon->discount_type = $request->discount_type;
		$coupon->amount = $request->amount;
		$coupon->item = $request->item;

		$coupon->save();
		return $coupon->id;
	}

	public function delete($id) {
		Coupon::destroy($id);
		return 'OK';
	}
}