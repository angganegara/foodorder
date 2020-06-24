<div style="line-height: 150%; font-size: 14px; font-family: Arial, Helvetica;">
	<p><b>Dear Administrator</b></p>

	<p>You have new bank transfer payment confirmation. Please check the details below:</p>
	<p>
		<b>Bank Name</b>: {{ $payment->bank_name }}<br />
		<b>IBAN Code</b>: {{ $payment->iban_code }}<br />
		<b>Account Name</b>: {{ $payment->account_name }}<br />
		<b>Account Number</b>: {{ $payment->account_number }}<br />
		<b>Payment Date</b>: {{ $payment->payment_date }}<br />
		<b>Payment Amount</b>: IDR {{ number_format($payment->amount) }}<br />
		<b>Payment Proof</b>:

		<br /><br />
		<img src="{{ url('/images/proof/'. $payment->filename) }}" style="max-width: 500px; display: block; border-radius: 5px;" />
	</p>

	<p>Please <a href="{{ url('/admin/payment-confirmation/'. $payment->order_number) }}" title=""><b>login to the admin panel</b></a> to approve / reject this confirmation.</p>

	<br />

	<p><em>Sent from Motion Cafe System</em></p>
</div>
