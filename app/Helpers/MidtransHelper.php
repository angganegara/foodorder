<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use App\Veritrans\Midtrans;
use App\Models\Order;

class MidtransHelper
{
	public function __construct()
	{
		Midtrans::$serverKey = $this->isLocalEnv() ? 'VT-server-mjpwi3r7XlxCqtHHf61DcIy3' : 'live-key';
		Midtrans::$isProduction = ! $this->isLocalEnv();
	}

	public function isLocalEnv()
	{
		return (env('APP_ENV') == 'local');
	}

	public function generateItems($order)
	{
		$data = [];

		foreach ($order->ordercart as $oc) {
			array_push($data, [
				'id' => $oc->id,
				'price' => $oc->price,
				'name' => $oc->name,
				'quantity' => $oc->qty
			]);
		}

		if ($order->coupon_value > 0) {
			array_push($data, [
				'price' => -($order->coupon_value),
				'name' => 'Coupon code '. $order->coupon,
				'quantity' => 1
			]);
		}

		if ($order->discount > 0) {
			array_push($data, [
				'price' => -($order->discount),
				'name' => 'Delivery Discount',
				'quantity' => 1
			]);
		}

		return $data;
	}

	public function getToken($request, $order_number)
	{
		// generate token by sending cart
		$midtrans = new Midtrans;
		$order = Order::where('order_number', $order_number)->with('ordercart')->first();
		
		$transaction_details = array(
			'order_id'      => $order_number,
			'gross_amount'  => $order->total - $order->discount - $order->coupon_value
		);

		$items = $this->generateItems($order);

		// Populate customer's Info
		$customer_details = [
			'first_name'      => $order->fname,
			'last_name'       => $order->lname,
			'email'           => $order->email,
			'phone'           => $order->phone
		];

		// Data yang akan dikirim untuk request redirect_url.
		$credit_card['secure'] = true;
		//ser save_card true to enable oneclick or 2click
		//$credit_card['save_card'] = true;

		$time = time();
		$custom_expiry = array(
			'start_time' => date("Y-m-d H:i:s O",$time),
			'unit'       => 'hour', 
			'duration'   => 2
		);
		
		$transaction_data = array(
			'transaction_details'=> $transaction_details,
			'item_details'       => $items,
			'customer_details'   => $customer_details,
			'credit_card'        => $credit_card,
			'expiry'             => $custom_expiry
		);
	
		try {
			$snap_token = $midtrans->getSnapToken($transaction_data);
			return $snap_token;
		} catch (Exception $e) {   
			return $e->getMessage;
		}
	}

	// to do : rename to save ?
	public function process(Request $request)
	{
		$json_result = file_get_contents('php://input');
		$data = json_decode($json_result);

		print_r($data);
		exit;

		$orderId = $data->order_id;
		if ($orderId != '') {
			$order = Order::where('order_number', $orderId)->first();
			$order->trx_type = $data->payment_type;
			$order->trx_approval_code = $data->approval_code;
			$order->trx_fraud_status = $data->fraud_status;
			$order->trx_status_code = $data->status_code;
			$order->trx_status_msg  = $data->status_message;
			$order->trx_status = $data->transaction_status;
			$order->trx_time = $data->transaction_time;
			$order->trx_raw  = $json_result;
			$order->save();
		}

		return 'OK';
	}
}