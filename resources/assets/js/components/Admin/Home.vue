<template>
	<section>
		<div class="container-fluid no-padding">
			<div class="bread">
				<ul>
					<li><router-link to="/admin">Admin</router-link></li>
					<li>Dashboard</li>
				</ul>
			</div>
			<div class="inner">
				<div class="row">
					<div class="col-xs-12">
						<schedule></schedule>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import OrderList from './components/OrderList.vue'
import Schedule from './components/Schedule.vue'

export default {
	name: 'Dashboard',
	components: { OrderList, Schedule },
	created() {
		this.$Progress.finish()
	},
}
</script>
