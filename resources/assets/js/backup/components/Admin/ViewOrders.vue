<template>
	<section>
		<notification></notification>
		<div class="container no-padding">
			<div class="bread">
				<ul>
					<li><router-link to="/admin">Admin</router-link></li>
					<li><router-link to="/admin/orders">Orders</router-link></li>
					<li>{{ this.form.name }} #{{ this.form.id }}</li>
				</ul>
			</div>
			<div class="inner">
				<div class="row">
					<div class="col-xs-12">
						<h2>Viewing order {{ this.form.name }} #{{ this.form.id }}</h2>
						<table class="table">
							<tr><th colspan="2">Personal Data</th></tr>
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
							<tr>
								<td>Address</td>
								<td>
									<textarea v-model="form.address" class="form-control form-control-sm" rows="5"></textarea>
								</td>
							</tr>
							<tr>
								<td>Extra delivery</td>
								<td>
									<label><input type="radio" v-model="form.extradelivery" name="extradelivery" :value="1"> &nbsp;Yes</label>
									&nbsp;&nbsp;
									<label><input type="radio" v-model="form.extradelivery" name="extradelivery" :value="0"> &nbsp;No</label>
								</td>
							</tr>
							<tr><th colspan="2">Food Preferences</th></tr>
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
						<table class="table">
							<tr><th colspan="5">Food Orders</th></tr>
							<tr class="sub">
								<th width="50%">Items</th>
								<th width="15%">Type</th>
								<th width="10%" class="text-xs-center">Qty</th>
								<th width="10%" class="text-xs-right">Price</th>
								<th width="15%" class="text-xs-right">Subtotal</th>
							</tr>
							<tr v-for="product in form.cart">
								<td>
									<strong>
										{{ product.name }}
										<span v-if="product.subname"><br>{{ product.subname }}</span>
										<span v-if="product.typeraw == 'fullday' || product.typeraw == 'singlemeal'"> for {{ product.totaldays }} day(s)</span>
									</strong>
									<br>
									Delivery starting date: {{ product.deliverydate }}
								</td>
								<td class="hidden-md-down">{{ product.type }}</td>
								<td class="text-xs-center">{{ product.qty }}</td>
								<td class="text-xs-right">
									<input type="text" class="form-control form-control-sm" :value="product.price" v-model="product.price">
								</td>
								<td class="text-xs-right">{{ subtotal(product) }} IDR</td>
							</tr>
							<tr v-if="this.form.extradelivery">
								<td colspan="4" class="text-xs-right">Extra Delivery</td>
								<td class="text-xs-right">50,000 IDR</td>
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
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
var $ = require('jquery')

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
				address: '',
				email: '', 
				phone: '',
				intolerance: '',
				allergies: '',
				dislikefood: '',
				extradelivery: Number,
				comments: '',
				cart: {},
				confirmed: null
			}
		}
	},
	methods: {
		saveOrder() {
			this.saving = true
			this.$http.post(`/api/admin/orders/${this.$route.params.id}`, { cart: this.form.cart, form: this.form })
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
		total(product) {
			var total = _.sumBy(this.form.cart, (item) => {
				return item.qty * item.price
			})
			if (this.form.extradelivery) {
				total += 50000
			}
			return numeral(total).format('0,0')
		}
	},
	created() {
		this.$http.get('/api/admin/orders/'+ this.$route.params.id).then((res) => {
			this.form = res.body
			this.form.cart = JSON.parse(res.body.cart)
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