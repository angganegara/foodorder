<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\MidtransHelper;
use App\Helpers\PaypalHelper;
use App\Helpers\OrderHelper;

class PaymentController extends Controller
{
	protected $mt;
	protected $pp;
	protected $oh;
	protected $key;

	public function __construct(MidtransHelper $mt, PaypalHelper $pp, OrderHelper $oh)
	{
		$this->mt = $mt;
		$this->pp = $pp;
		$this->oh = $oh;
	}

	public function start(Request $request)
	{
		$order_number = $request->ordernumber;
		$methods = $request->methods;

		if ($methods && $order_number) {
			if ($methods == 'cash') {
				// as usual ...
				$send = $this->oh->sendOrder($order_number);
				if ($send == 'OK') {
					// return redirect to thank you?
					return response()->json([
						'code'     => 100,
						'message'  => 'SUCCESS',
						'redirect' => null,
						'token'    => null,
					]);
				}
			} else if ($methods == 'paypal') {
				return $this->pp->setExpressCheckout($request, $order_number);
			} else if ($methods == 'creditcard') {
				return response()->json([
					'code'     => 102,
					'message'  => 'SUCCESS',
					'redirect' => null,
					'token'    => $this->mt->getToken($request, $order_number)
				]);
			}
		} else {
			return response()->json('INVALID CALL', 500);
		}
	}

	public function cancelPaypal($order_number)
	{
		return $this->pp->cancelPaypal($order_number);
	}

	public function getExpressCheckout(Request $request, $order_number)
	{
		return $this->pp->getExpressCheckout($request, $order_number);
	}

	public function process(Request $request)
	{
		return $this->mt->process($request);
	}

	public function approveChallenge($order_number)
	{
		return $this->mt->approveChallenge($order_number);
	}

	public function confirm($order_number)
	{
		return $this->mt->confirmAndSend($order_number);
	}

	public function deleteOrder(Request $request)
	{
		$order = \App\Models\Order::where('order_number', $request->order_number)->first();
		// only possible for CC order and if transaction_status === null
		if (
			($order->payment == 'creditcard' || $order->payment == 'banktransfer') &&
			($order->transaction_status == null || $order->transaction_status == '')
		) {
			\App\Models\OrderCart::where('order_id', $order->id)->first()->delete();
			\App\Models\OrderSchedule::where('order_id', $order->id)->first()->delete();
			$order->delete();
		}

		return 'OK';
	}

	public function test()
	{
		$order = \App\Models\Order::latest()->with('ordercart')->first();
		return $this->mt->generateItems($order);
	}
}