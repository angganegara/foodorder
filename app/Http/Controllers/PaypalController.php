<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Srmklive\PayPal\Facades\PayPal;
use Srmklive\PayPal\Services\ExpressCheckout;

class PaypalController extends Controller
{
	protected $provider;

	public function __construct()
	{
		$this->provider = new ExpressCheckout();
	}

	public function index()
	{
		// step 1
		$data = [];
		$data['items'] = [
			[
				'name' => 'Product 1',
				'price' => 9.99,
				'qty' => 1
			],
			[
				'name' => 'Product 2',
				'price' => 4.99,
				'qty' => 2
			]
		];

		$data['invoice_id'] = 1;
		$data['invoice_description'] = "Order #{$data['invoice_id']} Invoice";
		$data['return_url'] = url('/paypal/2');
		$data['cancel_url'] = url('/');

		$total = 0;
		foreach($data['items'] as $item) {
			$total += $item['price']*$item['qty'];
		}

		$data['total'] = $total;

		try {
            $response = $this->provider->setExpressCheckout($data, true);
            return redirect($response['paypal_link']);
        } catch (\Exception $e) {
            dd('Error processing PayPal payment');
        }
	}
}