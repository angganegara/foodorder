<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Session;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

use App\Helpers\DokuHelper;
use App\Helpers\PaypalHelper;
use App\Helpers\OrderHelper;
use App\Helpers\FileHelper;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentCard;

class PaymentController extends Controller
{
	protected $dk;
	protected $pp;
	protected $oh;
	protected $key;
	protected $fh;

	public function __construct(DokuHelper $dk, PaypalHelper $pp, OrderHelper $oh, FileHelper $fh)
	{
		$this->dk = $dk;
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
				$response = $this->dk->paymentRequest($order_number);
				session()->put('doku_request', $response);

				return response()->json([
					'code'     => 102,
					'message'  => 'SUCCESS'
				]);
			}
		} else {
			return response()->json('INVALID CALL', 500);
		}
	}

	public function dokuStart()
	{
		if (! session()->has('doku_request')) {
			return redirect('/');
		}

		$doku_request = session('doku_request');

		return view('doku.start', compact('doku_request'));
	}

	public function dokuRedirect()
	{
		if (! session()->has('doku_request')) {
			return redirect('/');
		}

		$doku_request = session('doku_request');

		$session_id = $doku_request['data']['SESSIONID'];

		if ($session_id !== request('SESSIONID')) {
			return redirect('/');
		}

		$order = Order::with(['paymentCard'])->where('order_number', request('TRANSIDMERCHANT'))->first();

		if (! $order) {
			return redirect('/');
		}

		$payment = $order->paymentCard()->create(request()->all());

		$payment->update([
			'raw_response' => json_encode(request()->all())
		]);

		$order_number = $order->order_number;

		return view('doku.redirect', compact('order_number'));
	}

	public function dokuNotify()
	{
		if (!request()->has('TRANSIDMERCHANT')) {
			abort(500, 'Invalid ID');
		}

		$order_number = request('TRANSIDMERCHANT');

		$order = Order::with(['paymentCard'])->where('order_number', $order_number)->first();

		if (!$order) {
			abort(500, 'Order does not exist');
		}

		$order->paymentCard()->update(request()->only([
			'TRANSIDMERCHANT',
			'RESPONSECODE',
			'APPROVALCODE',
			'RESULTMSG',
			'PAYMENTCHANNEL',
			'PAYMENTCODE',
			'SESSIONID',
			'BANK',
			'MCN',
			'PAYMENTDATETIME',
			'VERIFYID',
			'VERIFYSCORE',
			'VERIFYSTATUS',
			'BRAND',
			'CHNAME',
			'THREEDSECURESTATUS',
			'LIABILITY',
			'CUSTOMERID',
			'TOKENID'
		]));

		return response('CONTINUE');
	}

	public function dokuFinish()
	{
		// cleaning up ...
		$success = 0;

		if (! session()->has('doku_request')) {
			return redirect('/');
		}

		$doku_request = session('doku_request');

		$order = Order::with(['paymentCard'])->where('order_number', $doku_request['data']['TRANSIDMERCHANT'])->first();

		if ($order->paymentCard->statuscode === '0000') {
			$success = 1;

			$this->oh->sendOrder($order->order_number);
		}

		$from_doku = true;

		$action = null;

		return view('app', compact('from_doku', 'success', 'action'));
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

		$check = Order::with(['payments'])->where('order_number', $ordernumber)->first();

		$total_payment = $check->payments()->count();

		return view('payment', compact('ordernumber', 'key', 'check', 'total_payment'));
	}

	public function saveConfirmation($ordernumber, $key)
	{
		$encode = $this->oh->generatePaymentKey($ordernumber);

		if ($encode['key'] !== $key) {
			return response('ERROR');
		}

		$order = Order::with(['payments'])->where('order_number', $ordernumber)->first();

		$payment_date = Carbon::parse(request('payment_date_year') .'-'. intVal(request('payment_date_month') + 1) .'-'. request('payment_date_day'));

		$order->payments()->delete();

		$payment = $order->payments()->create([
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
