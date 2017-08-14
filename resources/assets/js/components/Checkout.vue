<template>
	<div class="checkout container">
		<div class="comp-loading" v-if="loading">
			<div class="el-loading-spinner">
				<svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
				<p class="el-loading-text">Loading...</p>
			</div>
		</div>
		<template v-if="finish">
			<div class="page-title">
				<h2>thank you</h2>
			</div>
			<p>Your food order has been submitted successfully.</p>
			<p>Your Motion Cafe Team</p>
			<p><router-link class="button primary" to="/"><i class="fa fa-fw fa-angle-left"></i> back to home</router-link></p>
			<figure>
				<img src="/images/thankyou.jpg?v=1" alt="" class="responsive">
			</figure>
		</template>
		<template v-else>
			<div class="page-title">
				<h2>checkout</h2>
			</div>
			<div class="info">
				You are almost done<br>
				Please check again all details and fill in your personal data below.
			</div>
			<br>
			<div class="alert alert-danger" v-if="error">
				<strong>Sorry</strong>, but the confirmation email could not be delivered. Check/change your email address
			</div>
			<form action="/checkout" method="post" id="form">

				<h4 class="no-pad">PERSONAL DATA</h4>
				<div class="row section">
					<div class="hidden-md-down col-md-4">
						<p class="lp">
							Enter your details here. Fields marked with <span class="required">*</span> are required.
						</p>
					</div>
					<div class="col-xs-6 col-md-4">
						<fieldset class="form-group">
							<label for="fname">First name <span class="required">*</span></label>
							<input type="text" v-validate.initial="form.fname" data-vv-rules="required" data-vv-as="First name" name="fname"
							:class="{'form-control': true, 'is-danger': errors.has('form.fname') }" placeholder="First name" v-model="form.fname">
							<p class="text-danger" v-if="errors.has('fname')">{{ errors.first('fname') }}</p>
						</fieldset>
					</div>
					<div class="col-xs-6 col-md-4">
						<fieldset class="form-group">
							<label for="surname">Surname <span class="required">*</span></label>
							<input type="text" v-validate.initial="form.lname" data-vv-rules="required" data-vv-as="Surname" name="lname"
							:class="{'form-control': true, 'is-danger': errors.has('form.lname') }" placeholder="Surname" v-model="form.lname">
							<p class="text-danger" v-if="errors.has('lname')">{{ errors.first('lname') }}</p>
						</fieldset>
					</div>
					<div class="col-xs-6 offset-md-4 col-md-4">
						<fieldset class="form-group">
							<label for="date">Email address <span class="required">*</span></label>
							<input type="text" v-validate.initial="form.email" data-vv-rules="required|email" data-vv-as="Email" name="email"
							:class="{'form-control': true, 'is-danger': errors.has('form.email') }" placeholder="Email" v-model.trim="form.email">
							<p class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</p>
						</fieldset>
					</div>
					<div class="col-xs-6 col-md-4">
						<fieldset class="form-group">
							<label for="phone">Phone number <span class="required">*</span></label>
							<input type="text" v-validate.initial="form.phone" data-vv-rules="required" data-vv-as="Phone number" name="phone"
							:class="{'form-control': true, 'is-danger': errors.has('form.phone') }" placeholder="Phone number" v-model="form.phone">
							<p class="text-danger" v-if="errors.has('phone')">{{ errors.first('phone') }}</p>
						</fieldset>
					</div>
					<div class="col-xs-6 offset-md-4 col-md-4">
						<fieldset class="form-group radio-only">
							<label class="single">Food Intolerances <span class="required">*</span></label>
							<label for="intolerances-yes">
								<input id="intolerances-yes" type="radio" v-validate data-vv-rules="required|in:Yes,No" v-model="form.intolerances" name="intolerances" data-vv-as="selection" value="Yes">
								&nbsp;&nbsp;Yes
							</label>
							&nbsp;&nbsp;
							<label for="intolerances-no">
								<input id="intolerances-no" type="radio" v-model="form.intolerances" name="intolerances" value="No">&nbsp;&nbsp;No
							</label>
							<p class="text-danger" v-if="errors.has('intolerances')">{{ errors.first('intolerances') }}</p>
							<div v-if="form.intolerances == 'Yes'" class="extra-field">
								<textarea type="text" v-validate.initial="form.intolerancesText" data-vv-rules="required" data-vv-as="Field"
								:class="{'form-control': true, 'is-danger': errors.has('form.intolerancesText') }" placeholder="Please enter" v-model="form.intolerancesText" rows="5"></textarea>
								<p class="text-danger" v-if="errors.has('form.intolerancesText')">{{ errors.first('form.intolerancesText') }}</p>
							</div>
						</fieldset>
					</div>
					<div class="col-xs-6 col-md-4">
					   <fieldset class="form-group radio-only">
							<label class="single">Food Allergies <span class="required">*</span></label>
							<label for="allergies-yes">
								<input id="allergies-yes" type="radio" v-validate data-vv-rules="required|in:Yes,No" v-model="form.allergies" data-vv-as="selection" name="allergies" value="Yes">
								&nbsp;&nbsp;Yes
							</label>
							&nbsp;&nbsp;
							<label for="allergies-no">
								<input id="allergies-no" type="radio" v-model="form.allergies" name="allergies" value="No">&nbsp;&nbsp;No
							</label>
							<p class="text-danger" v-if="errors.has('allergies')">{{ errors.first('allergies') }}</p>
							<div v-if="form.allergies == 'Yes'" class="extra-field">
								<textarea type="text" v-validate.initial="form.allergiesText" data-vv-rules="required" data-vv-as="Field"
								:class="{'form-control': true, 'is-danger': errors.has('form.allergiesText') }" placeholder="Please enter" v-model="form.allergiesText" rows="5"></textarea>
								<p class="text-danger" v-if="errors.has('form.allergiesText')">{{ errors.first('form.allergiesText') }}</p>
							</div>
						</fieldset>
					</div>
					<div class="col-xs-12 offset-md-4 col-md-8">
						<fieldset class="form-group">
							<label for="dislikefood">Food I don't like</label>
							<textarea class="form-control" placeholder="Please enter" v-model="form.dislikefood" rows="5"></textarea>
						</fieldset>
					</div>
				</div>

				<h4 class="no-pad">CART OVERVIEW</h4>
				<div class="row section">
					<div class="hidden-md-down col-md-4">
						<p class="lp">
							Review your selected items and press SEND ORDER to proceed.
						</p>
					</div>
					<div class="col-xs-12 col-md-8">
						<!--<cart :emit="true" :extradelivery="form.deliveryarea"></cart>-->
						<cart :cart="cart" :extradelivery="form.deliveryarea"></cart>
					</div>
				</div>

				<h4 class="no-pad">DELIVERY INFO</h4>
				<div class="row section">
					<div class="hidden-md-down col-md-4">
						<p class="lp">
							Review your food delivery schedule.
						</p>
					</div>
					<div class="col-xs-12 col-md-8">
						<schedule :cart="cart"></schedule>
					</div>
				</div>

				<h4 class="no-pad">COMMENTS</h4>
				<div class="row section">
					<div class="hidden-md-down col-md-4">
						<p class="lp">
							Any special request we should be aware of?
							Feel free to write some comments here.
						</p>
					</div>
					<div class="col-xs-12 col-md-8">
						<textarea name="comments" class="form-control" rows="10" v-model="form.comments"></textarea>
					</div>
				</div>

				<br>

				<h4 class="no-pad">PAYMENT OPTION</h4>
				<div class="row section">
					<div class="hidden-md-down col-md-4">
						<p class="lp">Select your payment option</p>
					</div>
					<div class="col-xs-12 col-md-8">
						<div class="payment-selection">
							<label><input type="radio" name="payment" v-model="payment" value="paypal"> <i class="fa fa-fw fa-paypal"></i> PayPal</label>
							<label><input type="radio" name="payment" v-model="payment" value="cash"> <i class="fa fa-fw fa-motorcycle"></i> Cash to driver / the cafe</label>
						</div>
					</div>
				</div>

				<br><br>
				<div class="text-xs-center">
					<router-link to="/overview" class="button primary big">
						back
					</router-link>
					&nbsp;
					<a href="#" @click.prevent="checkout" class="button yellow big" v-if="this.cartState.length > 0">
						send order <i class="fa fa-fw fa-angle-right"></i>
					</a>
				</div>
			</form>
		</template>
	</div>
</template>

<script>
import mixin from '../mixins'
import cart from './Cart.vue'
import schedule from './ScheduleList.vue'

export default {
	name: 'Checkout',
	mixins: [mixin],
	components: { cart, schedule },
	props: ['cart'],
	created() {
		this.$Progress.finish()
	},
	methods: {
		clearCart() {
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
		},

		checkout() {
			this.loading = true
			this.$validator.validateAll()

			if (this.errors.any()) {
				this.scroll('#form', 750, -140)
				this.loading = false
				return false
			}

			// sudah tidak ada masalah
			if (window.confirm('You are about to send a binding food order. Do you want to submit?')) {
				// create order
				this.$http
					.post('/api/create-order', {cart: this.cart, form: this.form, schedule: this.schedule, address: this.address})
					.then((res) => {
						var ordernumber = res.data
						var methods = this.payment
						// clear everything
						this.$http
							.post('/checkout/start', { ordernumber, methods })
							.then((res) => {
								const { code, message, redirect } = res.data
								// cash payment complete
								switch(code) {
									case 100:
										if (message == 'SUCCESS') {
											this.finish = true
											this.clearCart()
											this.scroll('.checkout', 750)
										}
										break;

									case 101:
										// paypal
										if (message == 'StartPaypal' && redirect != '') {
											this.clearCart()
											window.location = redirect
										} else {
											window.alert('There is a problem contacting PayPal. Please notify us at info@motionfitnessbali.com')
										}
										break;
								}
								
								this.loading = false
							})
							.catch((err) => {
								console.log(err)
								this.loading = false
							})
					})
					.catch((err) => {
						this.loading = false
						this.error = true
						this.scroll('.checkout', 750)
					})
			} else {
				this.loading = false
			}
			return false
		}
	},
	data () {
		return {
			loading: false,
			finish: false,
			error: false,
			payment: 'cash',
			form: {
				fname: '',
				lname: '',
				email: '',
				phone: '',
				comments: '',
				terms: false,
				intolerances: '',
				intolerancesText: '',
				allergies: '',
				allergiesText: '',
				dislikefood: '',
				deliveryprice: 0,
				totaldays: 0,
				discount: 0
			}
		}
	}
}
</script>
