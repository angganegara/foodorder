<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Coupon;
use App\Models\Diet;

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

	public function applyCoupon(Request $request)
	{
		$coupon = $request->coupon;
		$cart = $request->cart;
		$total = ($request->total);

		if ($coupon == '') {
			return false;
		}

		$data = Coupon::where('code', $coupon)->first();

		if (!$data) {
			return response()->json([
				'status' => 'ERROR',
				'message' => 'Sorry, This discount code doesn’t exist… But nice try ;)'
			], 500);
		}

		// has the promo started yet?
		$today = time();
		$promo_start = strtotime($data->promo_start);
		$promo_end = strtotime($data->promo_end);

		if ($today < $promo_start) {
			return response()->json([
				'status' => 'ERROR',
				'message' => 'Sorry, This Promo will start on '. $data->start .', A little bit more patience!'
			], 500);
		}

		if ($today > $promo_end) {
			return response()->json([
				'status' => 'ERROR',
				'message' => 'Sorry, This Promo is already over!'
			], 500);
		}

		if ($data->menu != '[0]') {
			// not for all menu
			$menu = json_decode($data->menu, true);
			$ids = array_reduce($cart, function($res, $cart) {
				$res[] = $cart['id'];
				return $res;
			}, []);
			$diff = count(array_intersect($menu, $ids));
			$menuName = $this->getMenuName($menu);

			if ( ! $diff ) {
				return response()->json([
					'status' => 'ERROR',
					'message' => 'Sorry, This Promo only applies for '. $menuName
				], 500);
			}
		}

		// calculate
		$arr = [];
		switch ($data->discount_type) {
			case 'item':
				$arr = [
					'status' => 'OK',
					'message' => $data->item,
					'value' => 0
				];
				break;
			case 'percent':
				$discount = ($total * ($data->amount / 100));
				$arr = [
					'status' => 'OK',
					'message' => 'Successfully applied discount',
					'value' => $discount
				];
				break;
			case 'amount':
				$discount = $data->amount;
				$arr = [
					'status' => 'OK',
					'message' => 'Successfully applied discount',
					'value' => $discount
				];
				break;
		}
		return response()->json($arr);
	}

	public function getMenuName($arr) {
		return Diet::whereIn('id', $arr)->get(['name'])->implode('name', ', ');
	}
}