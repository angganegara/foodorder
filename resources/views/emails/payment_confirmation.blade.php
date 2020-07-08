<div style="line-height: 150%; font-size: 14px; font-family: Arial, Helvetica;">
	<p style="margin-bottom: 10px"><b>Dear Administrator</b></p>

	<p style="margin-bottom: 10px">You have new bank transfer payment confirmation. Please check the details below:</p>
	<p style="margin-bottom: 10px">
		<b>Bank Name</b>: {{ $payment->bank_name }}<br />
		<b>IBAN Code</b>: {{ $payment->iban_code }}<br />
		<b>Account Name</b>: {{ $payment->account_name }}<br />
		<b>Account Number</b>: {{ $payment->account_number }}<br />
		<b>Payment Date</b>: {{ $payment->payment_date }}<br />
		<b>Payment Amount</b>: IDR {{ number_format($payment->amount) }}<br />
		<b>Payment Proof</b>:

		<br /><br />
		<img src="{{ url('/images/proof/'. $payment->filename) }}" style="max-width: 600px; display: block; border-radius: 5px;" />
	</p>

	<p style="margin-bottom: 10px">Please <a href="{{ url('/admin/orders/'. $payment->order_number .'/'. $payment->order->id) }}" title=""><b>login to the admin panel</b></a> to review this confirmation.</p>

	<br />

	<p><em>Sent from Motion Cafe System</em></p>
</div>
