<template>
	<section>
		<div class="container-fluid no-padding">
			<div class="bread">
				<ul>
					<li><router-link to="/admin">Admin</router-link></li>
					<li>Orders</li>
				</ul>
			</div>
			<order-list limit="1000" sort="id" order="desc" :auth="auth"></order-list>
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
