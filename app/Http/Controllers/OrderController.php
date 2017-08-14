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
            'address1'   => 'delivery',
            'address2'   => 'delivery',
            'pickup1'    => 'pickup',
            'pickup2'    => 'pickup',
			'wanderlust' => 'wanderlust'
        ];
	}
	
	public function createOrder(Request $request)
	{
		$order_number = $this->oh->createOrder($request);
		
		return $order_number;
	}

    public function sendOrder($order_number)
    {
		return $this->oh->sendOrder($order_number);
    }

    public function resendOrder($order_number)
    {
        // call send order with param resend = true
        return $this->oh->sendOrder($order_number, true);
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
