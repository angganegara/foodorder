<template>
	<section>
		<div class="container no-padding">
			<div class="bread">
				<ul>
					<li><router-link to="/admin">Admin</router-link></li>
					<li>Dashboard</li>
				</ul>
			</div>
			<div class="inner">
				<div class="row">
					<div class="col-xs-12">
						<h2>Last 5 orders</h2>
						<order-list limit="5" sort="id" order="desc"></order-list>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import OrderList from './components/OrderList.vue'
export default {
	name: 'Dashboard',
	components: { OrderList },
	created() {
		this.$Progress.finish()
	},
}
</script>