<template>
	<section>
		<notification></notification>
		<div class="page-title">
			<h2>Recent orders</h2>
		</div>
		<div class="orders">
			<table width="100%" class="sch">
				<tr>
					<th>ID</th>
					<th>Date</th>
					<th>Name</th>
					<th>Email</th>
					<th>Phone</th>
					<th>Referral</th>
					<th>Payment methods</th>
					<th></th>
				</tr>
				<tr v-for="(item, i) in items" :id="`menu-${item.id}`" :key="i">
					<td>{{ item.id }}</td>
					<td>{{ item.date }}</td>
					<td><b>{{ item.name }}</b></td>
					<td>{{ item.email }}</td>
					<td>{{ item.phone }}</td>
					<td style="text-transform: uppercase">{{ item.referral }}</td>
					<td>{{ item.payment }}</td>
					<td class="text-xs-right">
						<router-link :to="`/admin/orders/${item.id}/`" class="pill"><i class="fa fa-fw fa-eye"></i> View</router-link>
						&nbsp;
						<template v-if="auth.profile != null && auth.profile.id == 4">
							<a href="#" title="" @click.prevent="deleteMenu(item.id)" class="pill">Delete</a>
							&nbsp;
						</template>
						<a href="#" title="" @click.prevent="resendOrder(item.order_number)" class="pill" :class="`resend-${item.id}`">
							<i class="fa fa-fw fa-calendar-check-o"></i> Reminder</a>
					</td>
				</tr>
			</table>
		</div>
	</section>
</template>

<script>
export default {
	name: 'OrderList',
	props: ['limit', 'sort', 'order', 'auth'],
	data () {
		return {
			items: {},
			itemLimit: 0,
		}
	},
	created () {
		this.itemLimit = parseInt(this.limit)
		this.loadOrders()
	},
	methods: {
		loadOrders() {
			const params = 'limit='+ this.itemLimit +'&sort='+ this.sort +'&order='+ this.order +'pagination=no'
			this.$http.get('/api/admin/orders?'+ params).then((res) => {
				this.items = res.body
			})
		},
		setLimit(num) {
			this.$set(this, 'itemLimit', num);
			this.loadOrders()
		},
		resendOrder(id) {
			if (window.confirm('Send Payment reminder email to this customer?')) {
				$(`.resend-${id}`).html('<i class="fa fa-fw fa-spinner fa-spin"></i> sending..').addClass('sending');
				// talk to order helper
				this.$http.get(`/api/admin/orders/resend/${id}`).then((res) => {
					this.notification = {
						type: 'success',
						message: 'Email sent'
					}
					bus.$emit('open-notification', this.notification)
					$(`.resend-${id}`).html('Payment Reminder').removeClass('sending');
				})
			}
		},
		deleteMenu(id) {
			if (window.confirm('Are you sure?')) {
				this.$http.get(`/api/admin/orders/${id}/delete`).then((res) => {
					this.notification = {
						type: 'success',
						message: 'order deleted'
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
