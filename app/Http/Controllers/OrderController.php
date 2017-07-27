<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\OrderCart;
use App\Models\OrderSchedule;
use App\Helpers\OrderHelper;

class OrderController extends Controller
{
    protected $oh;
    protected $delivery_type;

    public function __construct(\App\Helpers\OrderHelper $oh)
    {
        $this->oh = $oh;
        $this->delivery_type = [
            'address1' => 'delivery',
            'address2' => 'delivery',
            'pickup1'  => 'pickup',
            'pickup2'  => 'pickup'
        ];
    }

    public function sendOrder(Request $request)
    {
        // check referral
        $url = $this->oh->urlToDomain($request->url());
        $referral = '';
        if ($url === 'balimma.avocadocafebali.com') {
            $referral = 'balimma';
        }

        $order = new Order;

    	$form     = $request->form;
    	$schedule = $request->schedule;
        $address  = $request->address;

    	$order->fname = $form['fname'];
    	$order->lname = $form['lname'];
    	$order->email = $form['email'];
    	$order->phone = $form['phone'];
    	$order->intolerance = $form['intolerancesText'];
    	$order->allergies = $form['allergiesText'];
    	$order->dislikefood = $form['dislikefood'];
    	$order->extraprice = $form['deliveryprice'];
        $order->discount = $form['discount'];
    	$order->confirmed = 0;
    	$order->comments = $form['comments'];
    	$order->ip_address = $request->ip();
        $order->address1 = $address['address1'];
        $order->address1_outside = 0;
        $order->address2 = $address['address2'];
        $order->address2_outside = 0;
        $order->referral = $referral;
    	$order->save();

        // save cart content
    	foreach ($request->cart as $cart) {

    		$oc = new OrderCart;

    		$oc->order_id = $order->id;
    		$oc->item_id = $cart['id'];
    		$oc->name = $cart['name'];
    		$oc->subname = $cart['subname'];
    		$oc->price = $cart['price'];
    		$oc->type = $cart['type'];
    		$oc->typeraw = $cart['typeraw'];
    		$oc->qty = $cart['qty'];
    		$oc->easysunday = $cart['easysunday'];
    		$oc->totaldays = intVal($cart['totaldays']);

    		$oc->save();

    		foreach ($schedule[$cart['id']] as $sch) {
    			// save schedule
    			$sc = new OrderSchedule;

    			$sc->order_id = $order->id;
    			$sc->item_id = $cart['id'];
    			$sc->order_carts_id = $oc->id;
    			$sc->date = $sch['date'];
    			$sc->breakfast_time = $sch['breakfast'];
                $sc->breakfast_location = $sch['breakfastLocation'];
    			$sc->lunch_time = $sch['lunch'];
                $sc->lunch_location = $sch['lunchLocation'];
                $sc->dinner_time = $sch['dinner'];
                $sc->dinner_location = $sch['dinnerLocation'];

    			$sc->save();
    		}
    	}

    	// send order
    	return $this->oh->sendOrder($order->id);
    }

    public function resendOrder($id)
    {
        // call send order with param resend = true
        return $this->oh->sendOrder($id, true);
    }

    public function index(Request $request)
    {
        $limit = $request->get('limit');
		$sort = $request->get('sort');
		$order = $request->get('order');
		$pagination = $request->get('pagination');
		$data = Order::orderBy($sort, $order);
		if ($limit > 0) {
			$data->take($limit);
		}
		$data = $data->get();
		return $data;
    }

    public function show($id)
    {
        $order = Order::where('id', $id);
        return $order->with('ordercart.schedule')->first();
    }

    public function update($id, Request $request)
    {
        $form = $request->form;
		$cart = $form['cart'];
		$order = Order::find($id);

		$delivery = $form['extradelivery'] ? 1 : 0;
		$order->fname = $form['fname'];
		$order->lname = $form['lname'];
		$order->email = $form['email'];
		$order->phone = $form['phone'];
		$order->intolerance = $form['intolerance'];
		$order->allergies = $form['allergies'];
		$order->dislikefood = $form['dislikefood'];
		$order->extradelivery = $delivery;
		$order->extraprice = $form['extraprice'];
		$order->comments = $form['comments'];
		$order->cart = json_encode($cart);
		$order->save();
		return 'OK';
    }

    public function delete($id)
    {
        // delete order
        return $this->oh->deleteOrder($id);
    }
}
