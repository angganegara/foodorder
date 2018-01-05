<template>
	<section>
		<notification></notification>
		<div class="page-title">
			<h2>All orders</h2>
		</div>
		<div class="orders">
			<table width="100%" class="sch">
				<tr>
					<th>ID</th>
					<th>Date</th>
					<th>Name</th>
					<th>Phone</th>
					<th>Referral</th>
					<th>Payment methods</th>
					<th>Status</th>
					<th></th>
				</tr>
				<tr v-for="(item, i) in items" :id="`menu-${item.id}`" :key="i" :class="`status-${getOrderStatus(item)}`">
					<td>{{ item.order_number }}</td>
					<td>{{ item.date }}</td>
					<td><a :href="`mailto:${item.email}`" target="_blank"><b>{{ item.name }}</b></a></td>
					<td>{{ item.phone }}</td>
					<td style="text-transform: uppercase">{{ item.referral }}</td>
					<td>{{ formatPayment(item) }}</td>
					<td><a title="" class="pill status" :class="`status-${getOrderStatus(item)}`" v-if="item.payment != 'cash'">{{ getOrderStatus(item) }}</a></td>
					<td class="text-xs-right">
						<router-link :to="`/admin/orders/${item.id}/`" class="pill"><i class="fa fa-fw fa-eye"></i> View</router-link>
						<template v-if="auth.profile != null && auth.profile.id == 4">
							&nbsp;
							<a href="#" title="" @click.prevent="deleteMenu(item.id)" class="pill">Delete</a>
							&nbsp;
						</template>
						<a href="#" title="" @click.prevent="resendOrder(item.order_number)" class="pill" :class="`resend-${item.id}`" v-if="showReminder(item)">
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
	methods:
	{
		showReminder(item)
		{
			if (item.paid == 0) {
				if (
					item.trx_status_code == 202 ||
					item.trx_status_code == null ||
					item.trx_status_code == 201
				) return false
				return true
			}
			return false
		},
		getOrderStatus(item)
		{
			let result;
			if (item.payment == 'creditcard') {
				result = item.trx_status ? item.trx_status : 'Aborted';
			} else if (item.payment == 'paypal') {
				result = 'Paid'
			} else {
				result = ''
			}
			return result;
		},
		formatPayment(item)
		{
			let payment = item.payment
			let text = payment
			if (payment == 'creditcard') {
				text = item.trx_type
			}
			return text
		},
		loadOrders()
		{
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
