<template>
	<div class="cart-wrap">
		<div class="comp-loading" v-if="loading">
			<div class="el-loading-spinner">
				<svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
				<p class="el-loading-text">Loading...</p>
			</div>
		</div>
		<section class="overview-cart" v-if="cartState.length > 0">
			<table class="table-cart">
				<tr>
					<th width="50%">Name</th>
					<th width="15%" class="hidden-md-down">Type</th>
					<th width="15%" class="text-xs-center">Qty</th>
					<th width="15%">Subtotal</th>
					<th width="5%">&nbsp;</th>
				</tr>
				<tr :key="product.id" v-for="product in cart" v-if="product.qty > 0">
					<td>
						<strong>
							{{ product.name }}
							<span v-if="product.subname"><br>{{ product.subname }}</span>
							<span v-if="product.typeraw == 'fullday' || product.typeraw == 'singlemeal'"> for {{ product.totaldays }} day(s)</span>
						</strong>
						<br>
						<template v-if="product.typeraw == 'fullday' || product.typeraw == 'singlemeal'">
							Delivery starting date:<br>{{ generateConsecutiveDate(product.deliverydate, product.totaldays) }}
						</template>
						<template v-else>
							Delivery starting date: {{ product.deliverydate }}
						</template>
					</td>
					<td class="hidden-md-down">{{ product.type }}</td>
					<td class="text-xs-center">
						<div class="qty-number">
							<a href="#" @click.prevent="decrement(product)" class="qty left" v-show="product.qty > 1"><i class="fa fa-fw fa-minus"></i></a>
							<span>{{ qty(product) }}</span>
							<a href="#" @click.prevent="increment(product)" class="qty right"><i class="fa fa-fw fa-plus"></i></a>
						</div>
					</td>
					<td>{{ subtotal(product) }} IDR</td>
					<td class="text-xs-center">
						<a href="#" @click.prevent="remove(product)" class="qty"><i class="fa fa-fw fa-times"></i></a>
					</td>
				</tr>
				<tr class="total">
					<td colspan="1">&nbsp;</td>
					<td colspan="4">
						<div class="input-group input-group-sm" v-if="$parent.form.coupon == ''">
							<input type="text" class="form-control input-sm" placeholder="Enter coupon code" v-model="coupon">
							<span class="input-group-btn">
								<button class="btn btn-secondary btn-primary" type="button" @click.prevent="applyCoupon()">Apply</button>
							</span>
						</div>
						<div v-else>
							<p style="margin-bottom: 0; text-align: right;">
								<span v-if="couponValue <= 0">
									Congratulations, you get a free {{ couponItem }}.
								</span>
								<span v-else>
									{{ couponItem }}.
								</span>
								<a href="#" title="" @click.prevent="cancelCoupon()">Cancel</a>
							</p>
						</div>
					</td>
				</tr>
				<tr v-if="couponValue > 0" class="total hidden-md-down">
					<td colspan="3" class="text-xs-right">Discount</td>
					<td colspan="2">- {{ formatValue }} IDR</td>
				</tr>
				<tr v-if="totaldays > 0" class="total hidden-md-down">
					<td colspan="3" class="text-xs-right">Extra delivery</td>
					<td colspan="2">{{ extraprice }} IDR</td>
				</tr>
				<tr v-if="totaldays > 0" class="total hidden-md-up">
					<td colspan="2" class="text-xs-right">Extra delivery</td>
					<td colspan="2">{{ extraprice }} IDR</td>
				</tr>
				<tr v-if="discount > 0" class="total hidden-md-down">
					<td colspan="3" class="text-xs-right">Delivery discount</td>
					<td colspan="2">- {{ discountformat }} IDR</td>
				</tr>
				<tr v-if="discount > 0" class="total hidden-md-up">
					<td colspan="2" class="text-xs-right">Delivery discount</td>
					<td colspan="2">- {{ discountformat }} IDR</td>
				</tr>
				<tr class="total hidden-md-down">
					<td colspan="3" class="text-xs-right" style="border-bottom: 0">TOTAL</td>
					<td colspan="2" style="border-bottom: 0">{{ total }} IDR</td>
				</tr>
				<tr class="total hidden-md-up">
					<td colspan="2" class="text-xs-right">TOTAL</td>
					<td colspan="2">{{ total }} IDR</td>
				</tr>
			</table>
		</section>
		<section v-else>
			Your cart is empty
		</section>
	</div>
</template>

<script>
import mixin from '../mixins'
import cartHelper from '../helpers/cart'

export default {
	mixins: [mixin, cartHelper],

	data() {
		return {
			coupon: '',
			couponValue: 0,
			couponItem: ''
		}
	},

	computed: {
		formatValue() {
			return numeral(this.couponValue).format('0,0')
		}
	},

	methods: {
		applyCoupon() {
			if (this.coupon != '') {
				let data = { cart: this.cart, coupon: this.coupon, total: parseInt(this.cartTotal) }
				this.$http
					.post('/api/apply-coupon', data)
					.then((res) => {
						this.couponValue = res.body.value
						this.couponItem = res.body.message
						bus.$emit('updateCoupon', { coupon: this.coupon, value: res.body.value, item: res.body.message })
					})
					.catch((err) => {
						window.alert(err.body.message)
						this.coupon = ''
						bus.$emit('emptyCoupon')
					})
			}
		},
		cancelCoupon() {
			this.coupon = ''
			this.couponValue = 0
			this.couponItem = ''
			bus.$emit('emptyCoupon');
		}
	}
}
</script>

<style>
.cart-wrap {
	position: relative;
}
</style>
