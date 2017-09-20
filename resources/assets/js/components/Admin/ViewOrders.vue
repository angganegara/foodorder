<template>
	<section>
		<notification></notification>
		<div class="container-fluid no-padding">
			<div class="bread">
				<ul>
					<li><router-link to="/admin">Admin</router-link></li>
					<li><router-link to="/admin/orders">Orders</router-link></li>
					<li>{{ this.form.name }} #{{ this.form.id }}</li>
				</ul>
			</div>
			<div class="orders">
				<h2 class="pad-title">Viewing order {{ this.form.name }} #{{ this.form.id }}</h2>
				<table class="sch">
					<tr><th colspan="2" class="th">Personal Data</th></tr>
					<tr>
						<td width="30%">First name</td>
						<td width="70%"><input type="text" v-model="form.fname" class="form-control form-control-sm"></td>
					</tr>
					<tr>
						<td>Last name</td>
						<td><input type="text" v-model="form.lname" class="form-control form-control-sm"></td>
					</tr>
					<tr>
						<td>Email</td>
						<td><input type="text" v-model="form.email" class="form-control form-control-sm"></td>
					</tr>
					<tr>
						<td>Phone</td>
						<td><input type="text" v-model="form.phone" class="form-control form-control-sm"></td>
					</tr>
					<tr><th colspan="2" class="th">Payment Information</th></tr>
					<tr>
						<td>Payment Method</td>
						<td class="text-xs-left">{{ paymentStatus }}</td>
					</tr>
					<tr>
						<td>Order status</td>
						<td class="text-xs-left">
							<b>{{ orderStatus }}</b>.
							<span v-if="orderStatus == 'Paid'">
								Order is paid and can be sent to customer
							</span>
							<span v-if="orderStatus == 'Challenge'">
								You need to manually approve this transaction. <a href="#" @click.prevent="approve()">Click here</a> to approve this transaction.
							</span>
							<span v-if="orderStatus == 'Expired'">
								Customer didn't pay the order within the time limit.
							</span>
						</td>
					</tr>
					<tr><th colspan="2" class="th">Food Preferences</th></tr>
					<tr>
						<td>Food Intolerances</td>
						<td><input type="text" v-model="form.intolerance" class="form-control form-control-sm"></td>
					</tr>
					<tr>
						<td>Food Allergies</td>
						<td><input type="text" v-model="form.allergies" class="form-control form-control-sm"></td>
					</tr>
					<tr>
						<td>Disliked Foods</td>
						<td><input type="text" v-model="form.dislikefood" class="form-control form-control-sm"></td>
					</tr>
				</table>
				<table class="sch">
					<tr><th colspan="5" class="th">Food Orders</th></tr>
					<tr class="sub">
						<th width="50%">Items</th>
						<th width="15%">Type</th>
						<th width="10%" class="text-xs-center">Qty</th>
						<th width="10%" class="text-xs-right">Price</th>
						<th width="15%" class="text-xs-right">Subtotal</th>
					</tr>
					<template v-for="(product, i) in form.ordercart">
						<tr class="product" :key="`th-${i}`">
							<td>
								<strong>
									{{ product.name }}
									<span v-if="product.subname"><br>{{ product.subname }}</span>
									<span v-if="product.typeraw == 'fullday' || product.typeraw == 'singlemeal'"> for {{ product.totaldays }} day(s)</span>
								</strong>
							</td>
							<td class="hidden-md-down">{{ product.type }}</td>
							<td class="text-xs-center">{{ product.qty }}</td>
							<td class="text-xs-right">
								<input type="text" class="form-control form-control-sm" :value="product.price" v-model="product.price">
							</td>
							<td class="text-xs-right">{{ subtotal(product) }} IDR</td>
						</tr>
						<template v-for="(s, si) in product.schedule">
							<tr class="delivery" :key="`a-${si}`">
								<td colspan="5" class="days text-xs-left">{{ s.date }}</td>
							</tr>
							<tr v-if="s.breakfast_location != ''" :key="`b-${si}`">
								<td colspan="4">
									<span class="type">Breakfast:</span>
									<div v-html="getLocation(s.breakfast_location)"></div>
								</td>
								<td class="text-xs-right date">
									{{ s.breakfast_time }}
								</td>
							</tr>
							<tr v-if="s.lunch_location != ''" :key="`c-${si}`">
								<td colspan="4">
									<span class="type">Lunch:</span>
									<div v-html="getLocation(s.lunch_location)"></div>
								</td>
								<td class="text-xs-right date">
									{{ s.lunch_time }}
								</td>
							</tr>
							<tr v-if="s.dinner_location != ''" :key="`d-${si}`">
								<td colspan="4">
									<span class="type">Dinner:</span>
									<div v-html="getLocation(s.dinner_location)"></div>
								</td>
								<td class="text-xs-right date">
									{{ s.dinner_time }}
								</td>
							</tr>
						</template>
					</template>
					<tr v-if="this.form.extraprice">
						<td colspan="4" class="text-xs-right">Extra Delivery</td>
						<td class="text-xs-right">{{ extraPrice(this.form.extraprice) }} IDR</td>
					</tr>
					<tr>
						<td colspan="4" class="text-xs-right">TOTAL</td>
						<td class="text-xs-right">{{ total(form.cart) }} IDR</td>
					</tr>
				</table>
				<br>
				<div class="text-xs-center">
					<button class="button" @click="saveOrder">
						<span v-show="!this.saving">save order</span>
						<span v-show="this.saving"><i class="fa fa-fw fa-spin fa-spinner"></i> saving</span>
					</button>
				</div>
				<br>
			</div>
		</div>
	</section>
</template>

<script>
var $ = require('jquery')
var axios = require('axios')
const MIDTRANS_API_URL = 'https://api.sandbox.midtrans.com/v2'
const SERVER_KEY = 'VlQtc2VydmVyLW1qcHdpM3I3WGx4Q3F0SEhmNjFEY0l5Mw=='

export default {
	name: 'ViewOrders',
	data() {
		return {
			notification: {
				type: '',
				message: ''
			},
			saving: false,
			form: {
				fname: '',
				lname: '',
				email: '',
				phone: '',
				intolerance: '',
				allergies: '',
				dislikefood: '',
				extraprice: 0,
				comments: '',
				cart: {},
				confirmed: null
			}
		}
	},
	computed:
	{
		paymentStatus()
		{
			return this.form.payment == 'creditcard'
				? this.form.trx_type
				: this.form.payment
		},
		orderStatus()
		{
			let result
			if (this.form.payment == 'creditcard') {
				switch (this.form.trx_status_code) {
					case 200: result = 'Paid'; break
					case 201: result = this.form.trx_type == 'credit_card' ? 'Challenge' : 'Pending'; break
					case 202: result = 'Expired'; break
					case '': case null: result ='Aborted'; break
				}
			} else {
				result = 'Paid'
			}
			return result
		}
	},
	methods:
	{
		approve()
		{
			this.$http
				.post('/payment/approve/' + this.form.order_number)
				.then(res => {
					this.form.trx_status_code = 200
				}, err => {
					window.alert('Cannot approve this transaction. Please check this transaction from your Midtrans dashboard.')
				})
		},
		getLocation(type)
		{
            if (type != 'pickup1' && type != 'pickup2') {
                var outside = `${type}_outside`
                return this.form[type]
            } else {
                return type == 'pickup1' ? 'Avocado Cafe' : 'Motion Fitness'
            }
        },
		saveOrder()
		{
			this.saving = true
			this.$http
				.post(`/api/admin/orders/${this.$route.params.id}`, { cart: this.form.ordercart, form: this.form })
				.then((res) => {
					this.notification = {
						type: 'success',
						message: 'order saved'
					}
					bus.$emit('open-notification', this.notification)
					this.saving = false
				}).catch((err) => {
					this.saving = false
				})
		},
		subtotal(product) {
			return numeral(product.qty * product.price).format('0,0')
		},
		extraPrice(price) {
			return numeral(price).format('0,0')
		},
		total(product) {
			var total = _.sumBy(this.form.ordercart, (item) => {
				return item.qty * item.price
			})
			if (this.form.extraprice > 0) {
				total += this.form.extraprice
			}
			return numeral(total).format('0,0')
		}
	},
	created() {
		this.$http.get('/api/admin/orders/'+ this.$route.params.id).then((res) => {
			this.form = res.body
			this.$Progress.finish()
		}).catch((err) => {
			this.$Progress.finish()
		})

	},
}
</script>

<style>
.fa-spin { -webkit-filter: blur(0); letter-spacing: normal; line-height: normal; }
</style>
