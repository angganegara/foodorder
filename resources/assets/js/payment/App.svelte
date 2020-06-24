<script>
	import range from './range.js';

	const order_number = window.order_number;
	const order_key = window.order_key;
	const payment_exist = window.payment;
	const today = new Date();

	let isLoading = false;
	let isError = false;
	let finish = payment_exist;

	$: btnText = isLoading ? '<i class="fa fa-spin fa-spinner-third"></i>' : 'submit';

	const month = {
		'0': 'Jan',
		'1': 'Feb',
		'2': 'Mar',
		'3': 'Apr',
		'4': 'May',
		'5': 'Jun',
		'6': 'Jul',
		'7': 'Aug',
		'8': 'Sep',
		'9': 'Oct',
		'10': 'Nov',
		'11': 'Des',
	};

	let files;

	let form = {
		bank_name: '',
		account_number: '',
		iban_code: '',
		account_name: '',
		payment_date_day: today.getDate(),
		payment_date_month: today.getMonth(),
		payment_date_year: today.getFullYear(),
		payment_amount: 0,
	};

	function isFormEmpty()
	{
		return (
			form.bank_name == '' ||
			form.account_number == '' ||
			form.account_name == '' ||
			form.payment_date_day == '' || 
			form.payment_date_month == '' || 
			form.payment_date_year == '' ||
			form.payment_amount == '' ||
			files == null
		);
	}

	function submit() {
		isLoading = true;

		if (isFormEmpty()) {
			isError = true;
			isLoading = false;
			return false;
		}

		const formData = new FormData();
		formData.append('bank_name', form.bank_name);
		formData.append('account_number', form.account_number);
		formData.append('iban_code', form.iban_code);
		formData.append('account_name', form.account_name);
		formData.append('payment_date_day', form.payment_date_day);
		formData.append('payment_date_month', form.payment_date_month);
		formData.append('payment_date_year', form.payment_date_year);
		formData.append('payment_amount', form.payment_amount);
		formData.append('file', files[0]);

		axios
			.post(`/payment-confirmation/${order_number}/${order_key}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
			.then(res => {
				isLoading = false;

				if (res.data == 'OK') {
					finish = true;
				}
			})
			.catch(err => {
				isLoading = false;
				console.log(err);
			});
	}
</script>

<main>
	<div class="payment-container">
		<div class="payment-header">
			<img src="/images/thankyou.jpg" alt="Motion Fitness Bali" />
			<img src="/images/logo.png" alt="Motion Fitness Bali" />
		</div>
		<div class="payment-inner">
			<div class="payment-body">
				<div class="flex justify-between items-center mb-6">
					<h3 class="font-bold text-xl">Payment Confirmation</h3>
					<p>#<b>{order_number}</b></p>
				</div>

				{#if !finish}
					<div class="text-sm italic mb-5"><span class="text-red-600">*</span> Required fields</div>

					{#if isError}
						<div class="border border-solid border-red-200 bg-red-100 text-red-600 py-3 px-4 leading-normal text-sm mb-4">
							<p><b>Please enter the required fields</b></p>
						</div>
					{/if}

					<div class="grid grid-cols-2 gap-4">
						<div class="field col-span-1">
							<label class="uppercase text-grey-700 block mb-2 font-bold text-sm">Bank Name <span class="text-red-600">*</span></label>
							<input type="text" placeholder="Bank name" class="form-input block w-full text-sm" bind:value={form.bank_name} required />
						</div>
						<div class="field col-span-1">
							<label class="uppercase text-grey-700 block mb-2 font-bold text-sm">IBAN Code</label>
							<input type="text" placeholder="IBAN Code" class="form-input block w-full text-sm" bind:value={form.iban_code} required />
						</div>
						<div class="field col-span-1">
							<label class="uppercase text-grey-700 block mb-2 font-bold text-sm">Account Number <span class="text-red-600">*</span></label>
							<input type="text" placeholder="Account Number" class="form-input block w-full text-sm" bind:value={form.account_number} required />
						</div>
						<div class="field col-span-1">
							<label class="uppercase text-grey-700 block mb-2 font-bold text-sm">Account Name <span class="text-red-600">*</span></label>
							<input type="text" placeholder="Account Name" class="form-input block w-full text-sm" bind:value={form.account_name} required />
						</div>
						<div class="field col-span-1">
							<label class="uppercase text-grey-700 block mb-2 font-bold text-sm">Payment Date <span class="text-red-600">*</span></label>
							<div class="flex justify-start items-start">
								<select class="form-select text-sm mr-2" bind:value={form.payment_date_day}>
									{#each range(1, 31) as i}
										<option value={i}>{i}</option>
									{/each}
								</select>
								<select class="form-select text-sm mr-2" bind:value={form.payment_date_month}>
									{#each range(1, 12) as i}
										<option value={i}>{month[i]}</option>
									{/each}
								</select>
								<select class="form-select text-sm" bind:value={form.payment_date_year}>
									{#each range(2019, 2023) as i}
										<option value={i}>{i}</option>
									{/each}
								</select>
							</div>
						</div>
						<div class="field col-span-1">
							<label class="uppercase text-grey-700 block mb-2 font-bold text-sm">Payment Amount <span class="text-red-600">*</span></label>
							<input type="text" placeholder="Payment Amount" class="form-input block w-full text-sm" bind:value={form.payment_amount} required />
						</div>
						<div class="field col-span-2">
							<label class="uppercase text-grey-700 block mb-2 font-bold text-sm">Payment Proof <span class="text-red-600">*</span></label>
							<input type="file" class="form-input block w-full text-sm" bind:files required />
						</div>
						<div class="field col-span-2">
							<div class="mt-4 py-3 px-4 leading-normal text-gray-700 text-sm bg-gray-100 border border-dashed border-gray-300">
								<p class="mb-2">Please transfer the money to the following bank details:</p>
								<p>
									Bank Name: <b>BCA</b><br />
									Bank Account: <b>MELROLLOU BALI</b><br />
									Account No: <b>7700398441</b><br />
									SWIFT/BIC: <b>CENAIDJA</b><br />
									Branch Code : <b>7700</b>
								</p>
							</div>
							<div class="mt-6 flex justify-center">
								<button class="py-2 px-4 block text-lg uppercase font-bold text-white bg-gray-800 rounded-sm" class:isLoading on:click={submit}>{@html btnText}</button>
							</div>
						</div>
					</div>
				{:else}
					<p>Thank you for submitting your payment proof. We will get back to you within 24 hours to confirm your order</p>

					<div class="flex justify-center mt-10">
						<a href="https://motionfitnessbali.com" title="" class="bg-gray-800 uppercase text-sm text-white py-3 px-5 font-bold rounded-sm"><i class="fal fa-arrow-left mr-1"></i> return to motion fitness bali website</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>