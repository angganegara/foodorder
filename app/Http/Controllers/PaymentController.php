<?php

namespace App\Http\Controllers;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

use App\Helpers\MidtransHelper;
use App\Helpers\PaypalHelper;
use App\Helpers\OrderHelper;
use App\Helpers\FileHelper;
use App\Models\Order;
use App\Models\Payment;

class PaymentController extends Controller
{
	protected $mt;
	protected $pp;
	protected $oh;
	protected $key;
	protected $fh;

	public function __construct(MidtransHelper $mt, PaypalHelper $pp, OrderHelper $oh, FileHelper $fh)
	{
		$this->mt = $mt;
		$this->pp = $pp;
		$this->oh = $oh;
		$this->fh = $fh;
	}

	public function start(Request $request)
	{
		$order_number = $request->ordernumber;
		$methods = $request->methods;

		if ($methods && $order_number) {
			if ($methods == 'cash' || $methods == 'banktransfer') {
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

	public function confirmation($ordernumber, $key)
	{
		$encode = $this->oh->generatePaymentKey($ordernumber);

		if ($encode['key'] !== $key) {
			return redirect('/');
		}

		$check = Order::with(['payment'])->where('order_number', $ordernumber)->first();

		$total_payment = $check->payment()->count();

		return view('payment', compact('ordernumber', 'key', 'check', 'total_payment'));
	}

	public function saveConfirmation($ordernumber, $key)
	{
		$encode = $this->oh->generatePaymentKey($ordernumber);

		if ($encode['key'] !== $key) {
			return response('ERROR');
		}

		$order = Order::with(['payment'])->where('order_number', $ordernumber)->first();

		$payment_date = Carbon::parse(request('payment_date_year') .'-'. intVal(request('payment_date_month') + 1) .'-'. request('payment_date_day'));

		$payment = $order->payment()->create([
			'order_number' => request('order_number'),
			'bank_name' => request('bank_name'),
			'iban_code' => request('iban_code'),
			'account_number' => request('account_number'),
			'account_name' => request('account_name'),
			'payment_date' => $payment_date->format('Y-m-d'),
			'amount' => floatVal(request('payment_amount')),
			'approved' => 0,
			'signature' => $key,
			'ip_address' => request()->ip()
		]);

		$order->refresh();

		if (request()->has('file')) {
			$file_response = $this->fh->uploadPicture(request('file'), 'proof', $ordernumber);

			$payment->update([
				'filename' => $file_response['filename']
			]);
		}

		// send email to administrator
		$this->sendPaymentConfirmationEmail($payment);

		return response('OK');
	}

	protected function sendPaymentConfirmationEmail($payment)
	{
		try {
			Mail::send('emails.payment_confirmation', compact('payment'), function ($m) use ($payment) {
				$m
		            ->from('no-reply@motionfitnessbali.com', 'Motion - Meal Plans')
		            ->to('foodorder@motionfitnessbali.com', 'Motion Cafe Bali')
		            ->subject('Bank transfer payment confirmation #'. $payment->order_number);
	        });
		} catch (\Exception $e) {
			abort(500, 'CANNOT_SEND_MAIL : '. $e->getMessage());
		}
	}
}
