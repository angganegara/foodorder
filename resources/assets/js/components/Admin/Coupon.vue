<template>
	<section>
		<div class="container-fluid no-padding">
			<div class="bread">
				<ul>
					<li><router-link to="/admin">Admin</router-link></li>
					<li>Coupons</li>
				</ul>
			</div>
			<coupon-list limit="50" sort="id" order="desc" :auth="auth"></coupon-list>
		</div>
	</section>
</template>

<script>
import CouponList from './components/CouponList.vue'
export default {
	name: 'Coupon',
	props: ['auth'],
	components: { CouponList },
	created() {
		this.$Progress.finish()
	},
}
</script>
