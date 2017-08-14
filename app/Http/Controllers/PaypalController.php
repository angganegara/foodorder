<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Srmklive\PayPal\Facades\PayPal;
use Srmklive\PayPal\Services\ExpressCheckout;

use App\Helpers\OrderHelper;

/**
 * TODO
 * refactor the code and change it to PaymentController
 */

class PaypalController extends Controller
{
	protected $provider;
	protected $oh;

	public function __construct(OrderHelper $oh)
	{
		$this->provider = new ExpressCheckout();
		$this->oh = $oh;
	}

	public function start(Request $request)
	{
		$ordernumber = $request->ordernumber;
		$methods = $request->methods;

		if ($methods && $ordernumber) {
			if ($methods == 'cash') {
				// as usual ...
				if ($this->oh->sendOrder($ordernumber) == 'OK') {
					// return redirect to thank you?
					return response()->json([
						'code'     => 100,
						'message'  => 'SUCCESS',
						'redirect' => null
					]);
				}
			} else if ($methods == 'paypal') {
				return $this->setExpressCheckout($request, $ordernumber);
			}
		} else {
			return response()->json('INVALID CALL', 500);
		}
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
				'LOGOIMG'   => 'https://foodorder.motionfitnessbali.com/images/logo-email.jpg'
			])->setExpressCheckout($cart);
            return [
				'code'     => 101,
				'message'  => 'StartPaypal',
				'redirect' => $response['paypal_link']
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
			array_push($data['items'], [
				'name' => $oc->name,
				'price' => $this->convertToUSD($oc->price),
				'desc' => $oc->subname,
				'qty' => $oc->qty
			]);
		}

		if ($order->discount > 0) {
			array_push($data['items'], [
				'name' => 'Discount',
				'price' => -$this->convertToUSD($order->discount),
				'desc' => 'Discount',
				'qty' => 1
			]);
		}

		$data['return_url'] = url('/checkout/finish/'. $order_number);
		$data['invoice_id'] = $order->order_number;
		$data['invoice_description'] = "Order #$order_number Invoice";
        $data['cancel_url'] = url('/checkout/cancel/'. $order_number);

		$data['total'] = 0;
		$data['total'] = array_reduce(
			array_map(function($val) { return $val['qty'] * $val['price']; }, $data['items']),
			function ($current, $total) { return $current + $total; }
		);
		
		return $data;
	}

	protected function convertToUSD($price)
	{
		return round($price / 13500, 0);
	}

	public function cancelPaypal($order_number)
	{
		// delete order
		$this->oh->deleteOrder($order_number);

		// redirect
		return redirect()->to('/checkout');
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
				// send order
				$this->oh->sendOrder($order_number);
				// redirect to vue page?
				return redirect()->to('/thank-you');
			} else {
				echo "There is an error processing your payment";
			}
        }
	}
}