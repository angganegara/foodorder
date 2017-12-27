<template>
	<div class="coupon-menu">
		<a href="javascript:" title="" @click="toggle('all')" :class="isActive('all') ? 'active' : ''">All packages</a>
		<a href="javascript:" title="" @click="toggle('weekly')" :class="isActive('weekly') ? 'active' : ''">Weekly package</a>
    <a href="javascript:" title="" @click="toggle('daily')" :class="isActive('daily') ? 'active' : ''">Daily package</a>
	</div>
</template>

<script>
export default {
	name: 'CouponPrice',
	props: ['value'],

	computed: {
		getPrice() {
			return this.value
		}
	},

	methods: {
		isActive(id) {
			return (_.indexOf(this.getPrice, id) !== -1)
		},

		toggle(num) {
			const index = _.indexOf(this.getPrice, num)
			if (num == 0) {
				this.getPrice.splice(0)
			} else {
				const zero = _.indexOf(this.getPrice, 0)
				if (zero != -1) {
					this.getPrice.splice(zero, 1)
				}
			}
			index == -1
				? this.getPrice.push(num)
				: this.getPrice.splice(index, 1)
		},

	}
}
</script>
