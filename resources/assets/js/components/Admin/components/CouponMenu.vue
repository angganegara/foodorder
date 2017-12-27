<template>
	<div class="coupon-menu">
		<a href="javascript:" title="" @click="toggle(0)" :class="isActive(0) ? 'active' : ''">All Menu</a>
		<a href="javascript:" title="" v-for="(item, i) in items" :key="i" @click="toggle(item.id)" :class="isActive(item.id) ? 'active' : ''">
			{{ item.name }}
		</a>
	</div>
</template>

<script>
export default {
	name: 'CouponMenu',
	props: ['value'],

	data() {
		return {
			items: []
		}
	},

	created() {
		this.loadItems()
	},

	computed: {
		getItems() {
			return this.value
		}
	},

	methods: {
		isActive(id) {
			return (_.indexOf(this.getItems, id) !== -1)
		},

		toggle(num) {
			const index = _.indexOf(this.getItems, num)
			if (num == 0) {
				this.getItems.splice(0)
			} else {
				const zero = _.indexOf(this.getItems, 0)
				if (zero != -1) {
					this.getItems.splice(zero, 1)
				}
			}
			index == -1
				? this.getItems.push(num)
				: this.getItems.splice(index, 1)
		},

		loadItems() {
			this.$http.get('/api/foods')
				.then((res) => {
					this.items = res.body
				})
		}
	}
}
</script>