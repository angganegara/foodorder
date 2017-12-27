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
    $coupon->price_type = json_encode($request->price_type);
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
    $coupon->price_type = json_encode($request->price_type);
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

    $menus = json_decode($data->menu, true);
    $price = json_decode($data->price_type, true);

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
			$ids = array_reduce($cart, function($res, $cart) {
				$res[] = $cart['id'];
				return $res;
			}, []);
			$diff = count(array_intersect($menus, $ids));
			$menuName = $this->getMenuName($menus);

			if (!$diff) {
				return response()->json([
					'status' => 'ERROR',
					'message' => 'Sorry, This Promo only applies for '. $menuName
				], 500);
			}
    }

    // calculate the discount only for affected items
    $discount = 0;
    $arr = [];
    $priceName = $this->getPriceName($price);

    foreach ($cart as $item) {
      if (in_array($item['id'], $menus)) {
        if ($data->price_type == '["all"]' || in_array($item['typeraw'], $price)) {
          // discount can be applied to this item
          switch ($data->discount_type) {
            case 'percent':
              $discount += ($item['price'] * ($data->amount / 100));
            break;

            case 'amount':
              $discount += ($item['price'] - $data->amount);
            break;
          }
        }
      }
    }

    if ($discount > 0) {
      $arr = [
        'status' => 'OK',
        'message' => 'Successfully applied discount',
        'value' => $discount
      ];
    } else {
      if ($data->discount_type != 'item') {
        $priceError = $priceName ? ' with '. $priceName : '';
        return response()->json([
          'status' => 'ERROR',
          'message' => 'Sorry, This Promo only applies for '. $menuName . $priceError
        ], 500);
      } else {
        $arr = [
					'status' => 'OK',
					'message' => $data->item,
					'value' => 0
				];
      }
    }

		return response()->json($arr);
	}

	public function getMenuName($arr) {
		return Diet::whereIn('id', $arr)->get(['name'])->implode('name', ', ');
  }

  public function getPriceName($arr) {
    $names = array_map(function ($menu) {
      return $menu != 'all' ? $this->getPriceRawName($menu) : false;
    }, $arr);

    return count($names) > 0 ? implode($names, ', ') : false;
  }

  public function getPriceRawName($name) {
    switch ($name) {
      case 'weekly': return 'Weekly Package'; break;
      case 'daily': return 'Daily Package'; break;
    }
  }
}
