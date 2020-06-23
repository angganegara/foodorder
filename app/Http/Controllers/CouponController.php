<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Coupon;
use App\Models\Diet;
use App\Models\Item;
use App\Models\Order;

use Carbon\Carbon;

class CouponController extends Controller
{
	public function index() {
		$coupons = Coupon::all();

    return view('admin.coupons', compact('coupons'));
	}

	public function show(Request $request, $id) {
		$coupon = Coupon::findOrFail($id)->toArray();

    if ($request->ajax()) {
      return response($coupon);
    }

    return view('admin.coupon', compact('coupon'));
	}

  public function create()
  {
    return view('admin.new-coupon');
  }

	public function update($id, Request $request) {
		$coupon = Coupon::find($id);

		$coupon->code = $request->code;
		$coupon->promo_start = $request->promo_start == '' ? null : $request->promo_start;
    $coupon->promo_end = $request->promo_end == '' ? null : $request->promo_end;
    $coupon->order_start = $request->order_start == '' ? null : $request->order_start;
		$coupon->order_end = $request->order_end == '' ? null : $request->order_end;
    $coupon->menu = json_encode($request->menu);
    $coupon->snacks = json_encode($request->snacks);
    $coupon->package_type = json_encode($request->package_type);
    $coupon->discount_type = $request->discount_type;
    $coupon->min_order = $request->min_order;
    $coupon->max_order = $request->max_order;
    $coupon->limit_usage = $request->limit_usage;
		$coupon->amount = $request->amount;
		$coupon->item = $request->item == null ? '' : $request->item;

		$coupon->save();
		return 'OK';
	}

	public function insert(Request $request) {
		$coupon = new Coupon;

		$coupon->code = $request->code;
    $coupon->promo_start = $request->promo_start == '' ? null : $request->promo_start;
    $coupon->promo_end = $request->promo_end == '' ? null : $request->promo_end;
    $coupon->order_start = $request->order_start == '' ? null : $request->promo_start;
    $coupon->order_end = $request->order_end == '' ? null : $request->promo_end;
    $coupon->menu = json_encode($request->menu);
    $coupon->snacks = json_encode($request->snacks);
    $coupon->package_type = json_encode($request->package_type);
    $coupon->discount_type = $request->discount_type;
    $coupon->min_order = $request->min_order;
    $coupon->max_order = $request->max_order;
    $coupon->limit_usage = $request->limit_usage;
    $coupon->amount = $request->amount;
    $coupon->item = $request->item == null ? '' : $request->item;

		$coupon->save();
		return $coupon->id;
	}

	public function delete($id)
  {
		Coupon::destroy($id);
		return redirect('/admin/coupons');
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
      $usage = Order::where('coupon_code', $coupon)->count();
      if ($data->limit_usage <= $usage) {
        return response()->json([
          'status' => 'ERROR',
          'message' => 'Sorry, This discount code has already been used'
        ], 500);
      }
    }

    $menus = json_decode($data->menu, true);
    $snacks = json_decode($data->snacks, true);
    $package = json_decode($data->package_type, true);

		// has the promo started yet?
		$today = time();
		$order_start = $data->order_start ? strtotime($data->order_start) : null;
		$order_end = $data->order_end ? strtotime($data->order_end) : null;

		if ($order_start && $today < $order_start) {
			return response()->json([
				'status' => 'ERROR',
				'message' => 'Sorry, This Promo will start on '. $data->order_start .', A little bit more patience!'
			], 500);
		}

		if ($order_end && $today > $order_end) {
			return response()->json([
				'status' => 'ERROR',
				'message' => 'Sorry, This Promo is already over!'
			], 500);
		}

		if ($data->menu != '[0]' && $data->menu != '[]') {
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

    if ($data->snacks != '[]') {
			// not for all snacks
			$ids = array_reduce($cart, function($res, $cart) {
				$res[] = array_reduce($cart['schedules'], function ($res2, $sch) {
          $sn = $sch['snacks'];
          if (count($sn) > 0) {
            $res2[] = $sn;
          }
          return $res2;
        }, []);
				return $res;
      }, []);
      $ids = collect($ids)->flatten()->all();
      $diff = count(array_intersect($snacks, $ids));
      $snacksName = $this->getSnacksName($snacks);

			if (!$diff) {
				return response()->json([
					'status' => 'ERROR',
					'message' => 'Sorry, This Promo only applies for '. $snacksName
				], 500);
			}
    }

    // do we have min and max order?
    $minOrder = $data->min_order;
    $maxOrder = $data->max_order;

    if ($minOrder > 0 || $maxOrder > 0) {
      // calculate total cart
      $totalCart = array_reduce($cart, function($total, $item) use ($data, $package) {
        // only include item with eligible price type
        if ($data->package_type == '["all"]' || in_array($item['packageId'], $package)) {
          $total += $item['qty'];
        }
        return $total;
      }, 0);

      $packageError = $package[0] !== 'all' ? ($package[0] == 1 ? '6-day package' : '4-day package') : '';

      if (($minOrder > 0) && ($totalCart < $minOrder)) {
        return response()->json([
					'status' => 'ERROR',
					'message' => 'Sorry, this coupon is only valid when ordering a minimum of '. $minOrder .' '. $packageError .' meal plans at once'
				], 500);
      }

      if (($maxOrder > 0) && ($totalCart > $maxOrder)) {
        return response()->json([
					'status' => 'ERROR',
					'message' => 'Sorry, this coupon is only valid when ordering a maximum of '. $maxOrder .' '. $packageError .' meal plans at once'
				], 500);
      }
    }

    // calculate the discount only for affected items
    $discount = 0;
    $arr = [];
    $packageName = $this->getPackageName($package);

    foreach ($cart as $item) {
      // eligible for this menu ?
      if (in_array($item['id'], $menus) || $data->menu == '[0]' || $data->menu == '[]') {
        // eligible for this type of package ?
        if ($data->package_type == '["all"]' || in_array($item['packageId'], $package)) {
          // check delivery starting date restrictions
          $promo_start = new Carbon($data->promo_start);
          $promo_end = new Carbon($data->promo_end);
          $delivery_start = new Carbon($item['dateStart']);
          if ($delivery_start->lt($promo_start) || $delivery_start->gt($promo_end)) {
            return response()->json([
              'status' => 'ERROR',
              'message' => 'Sorry, your order must be starting on '. $promo_start->format('l, j F Y')
            ], 500);
          }

          // discount can be applied to this item
          // is it only for snacks or menu? fuck this shit
          if ($data->snacks != '[]') {
            // for snack
            foreach ($item['schedules'] as $sch) {

              if ($sch['snacksData'] != '0') {
                foreach ($sch['snacksData'] as $sd) {
                  if (in_array($sd['id'], $snacks)) {

                    if ($data->discount_type == 'percent') {
                      $discount += $sd['totalPrice'] * ( $data->amount / 100 );
                    }

                  }
                }
              }

            }
          } else {
            // only for menu
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
        $with = $menuName ? ' with ' : '';
        $packageError = $packageName ? $with . $packageName : '';
        return response()->json([
          'status' => 'ERROR',
          'message' => 'Sorry, This Promo only applies for '. $menuName . $packageError
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

  public function getSnacksName($arr) {
		return Item::whereIn('id', $arr)->get(['name'])->implode('name', ', ');
  }

  public function getPackageName($arr) {
    $names = array_map(function ($menu) {
      return $menu != 'all' ? $this->getPackageRawName($menu) : false;
    }, $arr);

    return count($names) > 0 ? implode($names, ', ') : false;
  }

  public function getPackageRawName($name) {
    switch ($name) {
      case '1': return '6-day Package'; break;
      case '2': return '4-day Package'; break;
    }
  }
}
