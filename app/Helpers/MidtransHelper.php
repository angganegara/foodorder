<?php

namespace App\Helpers;

use Illuminate\Http\Request;

use App\Veritrans\Midtrans;
use App\Models\Order;
use App\Helpers\OrderHelper;

class MidtransHelper
{
	protected $oh;

	public function __construct(OrderHelper $oh)
	{
		$this->oh = $oh;
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
			'duration'   => 24
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

	public function approveChallenge($order_number)
	{
		return Midtrans::approve($order_number);
	}

	public function confirmAndSend($order_number)
	{
		return json_encode(Midtrans::status($order_number));
	}

	private function checkSignature($req)
	{
		$base = $req['order_id'] . $req['status_code'] . $req['gross_amount'] . Midtrans::$serverKey;
		return (openssl_digest($base, 'sha512') === $req['signature_key']);
	}

	// to do : rename to save ?
	public function process(Request $request)
	{
		$data = json_decode($request->getContent(), true);

		if (!array_key_exists('order_id', $data)) {
			return response()->json('ID NOT FOUND', 500);
		}

		if ($data['order_id'] == '') {
			return response()->json('ID CANNOT BE BLANK', 500);
		}

		$orderId = $data['order_id'];
		$order = Order::where('order_number', $orderId)->firstOrFail();

		// if status code 200, no need to update it again.
		if ($order->trx_status_code == 200) {
			exit;
		}

		// check the secret hash
		if (!$this->checkSignature($data)) {
			return response()->json('FORGED REQUEST', 500);
		}

		$order->trx_type = $data['payment_type'];

		if ($data['payment_type'] == 'credit_card') {
			$order->trx_approval_code = $data['approval_code'];
		}
		
		$order->trx_id           = $data['transaction_id'];
		$order->trx_fraud_status = $data['fraud_status'];
		$order->trx_status_code  = $data['status_code'];
		$order->trx_status_msg   = $data['status_message'];
		$order->trx_status       = $data['transaction_status'];
		$order->trx_time         = $data['transaction_time'];
		$order->trx_raw          = $request->getContent();

		if (
			intVal($data['status_code']) == 200
			&& strtoupper($data['fraud_status']) == 'ACCEPT'
			&& (strtoupper($data['transaction_status']) == 'CAPTURE' || strtoupper($data['transaction_status']) == 'SETTLEMENT')
		) {
			$order->paid = 1;
			// send email
			$this->oh->sendOrder($order->order_number);
		}

		$order->save();
		return 'OK';
	}
}