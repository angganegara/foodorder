<template>
	<div class="checkout container">
		<div class="page-title">
			<h2>thank you</h2>
		</div>
		<p>Your food order has been submitted successfully.</p>
		<p>Your Motion Cafe Team</p>
		<p><router-link class="button primary" to="/"><i class="fa fa-fw fa-angle-left"></i> back to home</router-link></p>
		<figure>
			<img src="/images/thankyou.jpg?v=1" alt="" class="responsive">
		</figure>
	</div>
</template>

<script>
export default {
	name: 'ThankYou',

	methods:
	{
		isMidtransOrder()
		{
			return this.$route.query.mt != undefined
		},
		checkAndSendOrder(order_number)
		{
			return this.$http.post('/payment/confirm/'+ order_number)
		}
	},

	created()
	{
		if (this.isMidtransOrder()) {
			// do a check again for the final result
			// if it's still pending, then send a pending email
			// later cronjob will check and if it's settled, it
			// will send a new email
			let order_number = this.$route.query.mt
			this.checkAndSendOrder(order_number).then((res) => {
				//console.log(res)
			})
		}
		// remove cookie regardless
		this.$store.state.cart = []
		this.$store.state.schedule = []
		this.$store.state.address = {
			address1: '',
			address1_outside: false,
			address2: '',
			address2_outside: false
		}
		localStorage.removeItem('cart', '')
		localStorage.removeItem('schedule', '')
		localStorage.setItem('address', JSON.stringify(this.$store.state.address))
	}
}
</script>
