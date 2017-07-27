<template>
	<section>
		<div class="container no-padding">
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
						<order-list limit="15" sort="id" order="desc"></order-list>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import auth from '../../helpers/auth.js'
import OrderList from './components/OrderList.vue'
export default {
	name: 'Orders',
	components: { OrderList },
	created() {
		this.$Progress.finish()
		auth.checkAuth()
	},
}
</script>