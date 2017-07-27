<template>
	<section>
		<table width="100%" class="table">
			<tr>
				<th></th>
				<th>Date</th>
				<th>Name</th>
				<th>Email</th>
				<th>Phone</th>
				<th class="text-xs-center">Extra delivery</th>
				<th class="text-xs-center">Confirmed</th>
				<th></th>
			</tr>
			<tr v-for="item in items">
				<td>#{{ item.id }}</td>
				<td>{{ item.date }}</td>
				<td><b>{{ item.name }}</b></td>
				<td>{{ item.email }}</td>
				<td>{{ item.phone }}</td>
				<td class="text-xs-center">
					<i class="fa fa-fw fa-check" v-show="item.extradelivery == 1"></i>
					<i class="fa fa-fw fa-times" v-show="item.extradelivery == 0"></i>
				</td>
				<td class="text-xs-center">
					<i class="fa fa-fw fa-check" v-show="item.confirmed == 1"></i>
					<i class="fa fa-fw fa-times" v-show="item.confirmed == 0"></i>
				</td>
				<td><router-link :to="`/admin/orders/${item.id}/`" class="button small">view</router-link></td>
			</tr>
		</table>
	</section>	
</template>

<script>
export default {
	name: 'OrderList',
	props: ['limit', 'sort', 'order'],
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
	}
}
</script>

<style lang="sass">

</style>