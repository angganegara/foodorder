<template>
	<section>
		<notification></notification>
		<div class="switcher">
			<h2>Recent Coupons</h2>
			<div class="links">
				<router-link to="/admin/coupon/new" class="active"><i class="fa fa-fw fa-plus"></i> New Coupon</router-link>
			</div>
        </div>
		<div class="orders">
			<table width="100%" class="sch">
				<tr>
					<th>Coupon</th>
					<th>Start</th>
					<th>End</th>
					<th>Type</th>
					<th>Amount</th>
					<th></th>
				</tr>
				<tr v-for="(item, i) in items" :id="`menu-${item.id}`" :key="i">
					<td><b>{{ item.code }}</b></td>
					<td>{{ item.start }}</td>
					<td>{{ item.end }}</td>
					<td>{{ item.discount_type }}</td>
					<td>{{ amount(item) }}</td>
					<td class="text-xs-right">
						<router-link :to="`/admin/coupon/${item.id}/`" class="pill"><i class="fa fa-fw fa-eye"></i> View</router-link>
						&nbsp;
						<a href="#" title="" @click.prevent="deleteCoupon(item.id)" class="pill">
							<i class="fa fa-fw fa-times"></i> Delete
						</a>
					</td>
				</tr>
			</table>
		</div>
	</section>
</template>

<script>
export default {
	name: 'CouponList',
	props: ['limit', 'sort', 'order', 'auth'],
	data () {
		return {
			items: {},
			itemLimit: 0,
		}
	},
	created () {
		this.itemLimit = parseInt(this.limit)
		this.loadCoupons()
	},
	methods: {
		amount(item) {
			return item.discount_type != 'item'
				? item.discount_type == 'percent'
				? item.amount + '%'
				: item.amount
				: '-'
		},
		loadCoupons() {
			const params = 'limit='+ this.itemLimit +'&sort='+ this.sort +'&order='+ this.order +'pagination=no'
			this.$http.get('/api/admin/coupons?'+ params).then((res) => {
				this.items = res.body
			})
		},
		setLimit(num) {
			this.$set(this, 'itemLimit', num);
			this.loadOrders()
		},
		deleteCoupon(id) {
			if (window.confirm('Are you sure?')) {
				this.$http.get(`/api/admin/coupons/${id}/delete`).then((res) => {
					this.notification = {
						type: 'success',
						message: 'coupon deleted'
					}
					bus.$emit('open-notification', this.notification)
					$(`#menu-${id}`).fadeOut()
				})
			}
		}
	}
}
</script>

<style lang="sass">

</style>
