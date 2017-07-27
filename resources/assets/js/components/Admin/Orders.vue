<template>
	<section>
		<div class="container-fluid no-padding">
			<div class="bread">
				<ul>
					<li><router-link to="/admin">Admin</router-link></li>
					<li>Orders</li>
				</ul>
			</div>
			<div class="inner">
				<div class="row">
					<div class="col-xs-12">
						<h2>Recent orders</h2>
						<order-list limit="15" sort="id" order="desc" :auth="auth"></order-list>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import OrderList from './components/OrderList.vue'
export default {
	name: 'Orders',
	props: ['auth'],
	components: { OrderList },
	created() {
		this.$Progress.finish()
	},
}
</script>
