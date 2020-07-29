<?php

namespace App\Helpers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Helpers\OrderHelper;
use Ixudra\Curl\Facades\Curl;

class DokuHelper
{
	protected $oh;
	protected $mallId;
	protected $sharedKey;
	protected $endpoint;

	public function __construct(OrderHelper $oh)
	{
		$this->oh = $oh;

		if ($this->isLocalEnv()) {
			$this->mallId = '11996961';
			$this->sharedKey = 'Hrhk2wzCKlSB';
			$this->endpoint = 'https://staging.doku.com';
		} else {
			$this->mallId = '8204';
			$this->sharedKey = 'pl2SH5tK7w2Q';
			$this->endpoint = 'https://pay.doku.com';
		}
	}

	public function isLocalEnv()
	{
		return (env('APP_ENV') == 'local');
	}

	public function generateBasket($order)
	{
		$basket = [];

		foreach ($order->ordercart as $oc) {
			$additions = [];

			if ($oc->delivery_price > 0) {
				array_push($additions, 'with delivery fee');
			}

			if ($oc->snacks_price > 0) {
				array_push($additions, 'with snacks');
			}

			$additions = implode($additions, ', ');
			$package = intVal($oc->package) == 1 ? '6-days package' : 'single days';
			$name = trim($oc->meals .' '. $package .' '. $additions);
			$qty = intVal($oc->qty);
			$subtotal = (intVal($oc->total_price) / $qty) .'.00';
			$total = (intVal($oc->total_price)) .'.00';

			array_push($basket, $name .','. $subtotal .','. $qty .','. $total);
		}

		if ($order->coupon_value > 0) {
			$coupon_value = -($order->coupon_value) .'.00';
			array_push($basket, 'Coupon code '. $order->coupon_code .','. $coupon_value .',1,'. $coupon_value);
		}

		return implode($basket, ';');
	}

	public function paymentRequest($order_number)
	{
		$order = Order::where('order_number', $order_number)->with('ordercart')->first();

		$total = $order->total .'.00';

		$words = $this->generateWords($order);

		$response = [
			'MALLID' => $this->mallId,
			'CHAINMERCHANT' => 'NA',
			'AMOUNT' => $total,
			'PURCHASEAMOUNT' => $total,
			'TRANSIDMERCHANT' => $order->order_number,
			'WORDS' => $words,
			'REQUESTDATETIME' => date('YmdHis'),
			'CURRENCY' => 360,
			'PURCHASECURRENCY' => 360,
			'SESSIONID' => $order->order_number . $order->id,
			'NAME' => $order->name,
			'EMAIL' =>  $order->email,
			'BASKET' => $this->generateBasket($order)
		];

		return [
			'url' => $this->endpoint .'/Suite/Receive',
			'data' => $response
		];
	}

	protected function generateWords($order)
	{
		$total = $order->total .'.00';

		return sha1($total . $this->mallId . $this->sharedKey . $order->order_number);
	}

	public function validateWords($order, $challenge_words)
	{
		$words = $this->generateWords($order);

		return $words === $challenge_words;
	}

}
