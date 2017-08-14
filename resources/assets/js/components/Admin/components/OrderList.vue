<template>
	<section>
		<notification></notification>
		<table width="100%" class="table">
			<tr>
				<th></th>
				<th>Date</th>
				<th>Name</th>
				<th>Email</th>
				<th>Phone</th>
				<th>Referral</th>
				<th>Payment methods</th>
				<th></th>
			</tr>
			<tr v-for="item in items" :id="`menu-${item.id}`">
				<td>#{{ item.id }}</td>
				<td>{{ item.date }}</td>
				<td><b>{{ item.name }}</b></td>
				<td>{{ item.email }}</td>
				<td>{{ item.phone }}</td>
				<td style="text-transform: uppercase">{{ item.referral }}</td>
				<td>{{ item.payment }}</td>
				<td class="text-xs-right">
					<router-link :to="`/admin/orders/${item.id}/`" class="button small">view</router-link>
					&nbsp;
					<template v-if="auth.profile != null && auth.profile.id == 4">
						<a href="#" title="" @click.prevent="deleteMenu(item.id)" class="button small">Delete</a>
						&nbsp;
					</template>
					<a href="#" title="" @click.prevent="resendOrder(item.order_number)" class="button small" :class="`resend-${item.id}`">Payment Reminder</a>
				</td>
			</tr>
		</table>
	</section>
</template>

<script>
export default {
	name: 'OrderList',
	props: ['limit', 'sort', 'order', 'auth'],
	data () {
		return {
			items: {}
		}
	},
	created () {
		var params = 'limit='+ this.limit +'&sort='+ this.sort +'&order='+ this.order +'pagination=no'
		this.$http.get('/api/admin/orders?'+ params).then((res) => {
			this.items = res.body
		})
	},
	methods: {
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
