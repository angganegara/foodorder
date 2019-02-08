<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use Srmklive\PayPal\Facades\PayPal;
use Srmklive\PayPal\Services\ExpressCheckout;

use App\Helpers\OrderHelper;

class PaypalHelper
{
	protected $provider;
	protected $oh;

	public function __construct(OrderHelper $oh)
	{
		$this->provider = new ExpressCheckout();
		$this->oh = $oh;
	}

	public function setExpressCheckout($request, $order_number)
	{
		if (!$request->ajax()) {
			// not from ajax, abort
			return redirect()->to('/');
		}

		$cart = $this->getCheckoutData($order_number);

    try {
			$response = $this->provider->addOptions([
				'BRANDNAME' => 'Motion Fitness',
				'LOGOIMG'   => url('images/logo-email.jpg')
			])->setExpressCheckout($cart);
      return [
				'code'     => 101,
				'message'  => 'StartPaypal',
				'redirect' => $response['paypal_link'],
        'token'    => null,
        'response' => $response
			];
    } catch (\Exception $e) {
      return response("Error processing PayPal payment : ". $e->getMessage());
    }
	}

	public function getCheckoutData($order_number)
	{
		$order = \App\Models\Order::where('order_number', $order_number)->with('ordercart')->first();
		$data = [];
		$data['items'] = [];

		foreach($order->ordercart as $oc) {
      $slim_sunday = $oc->slimsunday == "1" ? "(with Slim Sunday)" : "";
			array_push($data['items'], [
				'name' => $oc->meals .' x'. $oc->qty .' '. $slim_sunday,
				'price' => $this->convertToUSD($oc->total_price),
				'desc' => '',
				'qty' => 1
			]);
		}

		if ($order->coupon_value > 0) {
			array_push($data['items'], [
				'name' => 'Discount',
				'price' => -$this->convertToUSD($order->coupon_value),
				'desc' => 'Coupon code '. $order->coupon_code,
				'qty' => 1
			]);
		}

		$data['return_url'] = url('checkout/finish/'. $order_number);
		$data['invoice_id'] = $order->order_number;
		$data['invoice_description'] = "Order #$order_number Invoice";
    $data['cancel_url'] = url('checkout/cancel/'. $order_number);

		$data['total'] = 0;
		$data['total'] = array_reduce(
			array_map(function($val) { return $val['qty'] * $val['price']; }, $data['items']),
			function ($current, $total) { return $current + $total; }
		);

		return $data;
	}

	protected function convertToUSD($price)
	{
		return round($price / 14500, 0);
	}

	public function cancelPaypal($order_number)
	{
		// delete order
		$this->oh->deleteOrder($order_number);

		// redirect
		return redirect()->to('checkout');
	}

	public function getExpressCheckout(Request $request, $order_number)
	{
		$token = $request->get('token');
    $PayerID = $request->get('PayerID');
		$cart = $this->getCheckoutData($order_number);

		// Verify Express Checkout Token
    $response = $this->provider->getExpressCheckoutDetails($token);
    if (in_array(strtoupper($response['ACK']), ['SUCCESS', 'SUCCESSWITHWARNING'])) {
      // Perform transaction on PayPal
      $payment_status = $this->provider->doExpressCheckoutPayment($cart, $token, $PayerID);
      $status = $payment_status['PAYMENTINFO_0_PAYMENTSTATUS'];

      if ($this->oh->updatePaypalStatus($order_number, $status)) {
        // success
        $this->oh->sendOrder($order_number);

        // redirect to vue page?
        return redirect()->to('checkout/thank-you');
      } else {
        echo "There is an error processing your payment";
      }
    }
	}
}
