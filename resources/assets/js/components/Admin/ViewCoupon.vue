<template>
	<section>
		<notification></notification>
		<div class="container-fluid no-padding">
			<div class="bread">
				<ul>
					<li><router-link to="/admin">Admin</router-link></li>
					<li><router-link to="/admin/coupon">Coupons</router-link></li>
					<li>{{ this.newCoupon ? 'New Coupon' : this.form.code }}</li>
				</ul>
			</div>
			<div class="orders">
				<h2 class="pad-title">{{ this.newCoupon ? 'Creating new coupon' : 'Viewing coupon details' }}</h2>
				<table class="sch">
					<tr><th colspan="2" class="th">Coupon Details</th></tr>
					<tr>
						<td width="30%">Coupon code</td>
						<td width="70%"><input type="text" v-model="form.code" class="form-control form-control-sm" /></td>
					</tr>
					<tr>
						<td>Promo start (y-m-d format e.g 2018-01-30)</td>
						<td><input type="text" v-model="form.promo_start" class="form-control form-control-sm" /></td>
					</tr>
					<tr>
						<td>Promo end (y-m-d format e.g 2018-01-30)</td>
						<td><input type="text" v-model="form.promo_end" class="form-control form-control-sm" /></td>
					</tr>
					<tr>
						<td>Promo applies for</td>
						<td><coupon-menu v-model="form.menu"></coupon-menu></td>
					</tr>
          <tr>
            <td>Price type</td>
            <td><coupon-price v-model="form.price_type"></coupon-price></td>
          </tr>
          <tr>
            <td>Minimum item order (enter 0 for no limit)</td>
            <td><input type="text" v-model="form.min_order" class="form-control form-control-sm" /></td>
          </tr>
          <tr>
            <td>Maximum item order (enter 0 for no limit)</td>
            <td><input type="text" v-model="form.max_order" class="form-control form-control-sm" /></td>
          </tr>
					<tr>
						<td>Discount type</td>
						<td>
							<select class="form-control form-control-sm" v-model="form.discount_type" :value="form.discount_type">
								<option value="">select discount type</option>
								<option value="amount">Amount</option>
								<option value="percent">Percent</option>
								<option value="item">Free item</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>Discount Amount (if Amount / Percent)</td>
						<td><input type="text" v-model="form.amount" class="form-control form-control-sm" /></td>
					</tr>
					<tr>
						<td>Promo Item (if free item)</td>
						<td><input type="text" v-model="form.item" class="form-control form-control-sm" /></td>
					</tr>
				</table>
				<br>
				<div class="text-xs-center">
					<button class="button" @click="saveCoupon">
						<span v-show="!this.saving">save coupon</span>
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
import CouponMenu from './components/CouponMenu.vue';
import CouponPrice from './components/CouponPrice';

export default {
	name: 'ViewCoupon',
	components: { CouponMenu, CouponPrice },
	data() {
		return {
			notification: {
				type: '',
				message: ''
			},
			newCoupon: false,
			saving: false,
			form: {
				code: '',
				promo_start: '',
				promo_end: '',
				menu: [],
				discount_type: '',
        price_type: [],
        min_order: 0,
        max_order: 0,
				amount: '',
				item: ''
			}
		}
	},
	methods: {
		saveCoupon() {
			this.saving = true
			this.$http
				.post(`/api/admin/coupons/${this.$route.params.id}`, this.form)
				.then((res) => {
					this.notification = {
						type: 'success',
						message: 'coupon saved'
					}
					bus.$emit('open-notification', this.notification)
					this.saving = false
					return res.body
				}).then((id) => {
					if (this.newCoupon) {
						this.$router.push(`/admin/coupon/${id}`)
						this.newCoupon = false
					}
				}).catch((err) => {
					this.saving = false
				})
		},
		loadCoupon() {
			this.$http.get('/api/admin/coupons/'+ this.$route.params.id).then((res) => {
				this.form = res.body;
        this.form.menu = JSON.parse(res.body.menu);
        this.form.price_type = JSON.parse(res.body.price_type);
			})
		}
	},
	created() {
		if(this.$route.params.id == 'new') {
			this.newCoupon = true
		} else {
			this.newCoupon = false
			this.loadCoupon()
		}
	},
}
</script>

<style>
.fa-spin { -webkit-filter: blur(0); letter-spacing: normal; line-height: normal; }
</style>
