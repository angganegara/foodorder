<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Coupon;
use App\Models\Diet;
use App\Models\Order;
use Carbon\Carbon;

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
		$coupon->promo_start = $request->promo_start == '' ? null : $request->promo_start;
		$coupon->promo_end = $request->promo_end == '' ? null : $request->promo_end;
    $coupon->menu = json_encode($request->menu);
    $coupon->price_type = json_encode($request->price_type);
    $coupon->discount_type = $request->discount_type;
    $coupon->min_order = $request->min_order;
    $coupon->max_order = $request->max_order;
    $coupon->limit_usage = $request->limit_usage;
    $coupon->delivery_dates = $request->delivery_dates;
    $coupon->delivery_start = $request->delivery_start == '' ? null : $request->delivery_start;
		$coupon->amount = $request->amount;
		$coupon->item = $request->item;

		$coupon->save();
		return 'OK';
	}

	public function insert(Request $request) {
		$coupon = new Coupon;

		$coupon->code = $request->code;
		$coupon->promo_start = $request->promo_start == '' ? null : $request->promo_start;
		$coupon->promo_end = $request->promo_end == '' ? null : $request->promo_end;
    $coupon->menu = json_encode($request->menu);
    $coupon->price_type = json_encode($request->price_type);
    $coupon->discount_type = $request->discount_type;
    $coupon->min_order = $request->min_order;
    $coupon->max_order = $request->max_order;
    $coupon->limit_usage = $request->limit_usage;
    $coupon->amount = $request->amount;
    $coupon->delivery_dates = $request->delivery_dates;
    $coupon->delivery_start = $request->delivery_start == '' ? null : $request->delivery_start;
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
				'message' => 'Sorry, This discount code doesn\'t exist... But nice try ;)'
			], 500);
    }

    if ($data->limit_usage > 0) {
      // if limit usage is not 0, count the total
      $usage = Order::where('coupon', $coupon)->count();
      if ($data->limit_usage <= $usage) {
        return response()->json([
          'status' => 'ERROR',
          'message' => 'Sorry, This discount code has already been used'
        ], 500);
      }
    }

    $menus = json_decode($data->menu, true);
    $price = json_decode($data->price_type, true);

		// has the promo started yet?
		$today = time();
		$promo_start = $data->promo_start ? strtotime($data->promo_start) : null;
		$promo_end = $data->promo_end ? strtotime($data->promo_end) : null;

		if ($promo_start && $today < $promo_start) {
			return response()->json([
				'status' => 'ERROR',
				'message' => 'Sorry, This Promo will start on '. $data->start .', A little bit more patience!'
			], 500);
		}

		if ($promo_end && $today > $promo_end) {
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

    // do we have min and max order?
    $minOrder = $data->min_order;
    $maxOrder = $data->max_order;

    if ($minOrder > 0 || $maxOrder > 0) {
      // calculate total cart
      $totalCart = array_reduce($cart, function($total, $item) use ($data, $price) {
        // only include item with eligible price type
        if ($data->price_type == '["all"]') {
          $total += $item['qty'];
        }
        return $total;
      }, 0);

      $priceError = $price[0] !== 'all' ? $price[0] : '';

      if (($minOrder > 0) && ($totalCart < $minOrder)) {
        return response()->json([
					'status' => 'ERROR',
					'message' => 'Sorry, this coupon is only valid when ordering a minimum of '. $minOrder .' '. $priceError .' meal plans at once'
				], 500);
      }

      if (($maxOrder > 0) && ($totalCart > $maxOrder)) {
        return response()->json([
					'status' => 'ERROR',
					'message' => 'Sorry, this coupon is only valid when ordering a maximum of '. $maxOrder .' '. $priceError .' meal plans at once'
				], 500);
      }
    }

    // calculate the discount only for affected items
    $discount = 0;
    $arr = [];
    $priceName = $this->getPriceName($price);

    foreach ($cart as $item) {
      // eligible for this menu ?
      if (in_array($item['id'], $menus) || $data->menu == '[0]') {
        // eligible for this type of package ?
        if ($data->price_type == '["all"]') {
          // do we have starting date restriction?
          if ($data->delivery_dates === 1 && $data->delivery_start !== null) {
            $delivery_start_limit = new Carbon($data->delivery_start);
            $delivery_start_enter = new Carbon($item['dateStart']);

            if (!$delivery_start_enter->eq($delivery_start_limit)) {
              return response()->json([
                'status' => 'ERROR',
                'message' => 'Sorry, your order must be starting on '. $delivery_start_limit->format('l, j F Y')
              ], 500);
            }
          }
          // discount can be applied to this item
          switch ($data->discount_type) {
            case 'percent':
              $discount += (($item['foodPrice'] * $item['qty']) * ($data->amount / 100));
            break;

            case 'amount':
              $discount = ($data->amount);
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
        $menuName = !isset($menuName) ? null : $menuName;
        $with = $menuName ? 'with ' : '';
        $priceError = $priceName ? $with . $priceName : '';
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
