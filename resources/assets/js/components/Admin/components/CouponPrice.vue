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
		getValue() {
			return this.value
		}
	},

	methods: {
		isActive(id) {
			return (_.indexOf(this.getValue, id) !== -1);
		},

		toggle(num) {
			const index = _.indexOf(this.getValue, num);
      if (num == 'all') {
				this.getValue.splice(0);
			} else {
				const zero = _.indexOf(this.getValue, 'all');
				if (zero != -1) {
					this.getValue.splice(zero, 1);
				}
			}
			index == -1
				? this.getValue.push(num)
				: this.getValue.splice(index, 1);
		},

	}
}
</script>
