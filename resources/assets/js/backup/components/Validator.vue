<template>
	<span class="error" v-show="isError || force">This field is required</span>
</template>

<script>
export default {
	name: 'validator',
	props: ['value', 'force'],
	data() {
		return {
			isError: false
		}
	},
	watch: {
		value(val, old) {
			console.log('value : '+ val + ' old '+ old)
			this.isError = ! val
			if (this.isError) {
				this.$parent.error += 1
			} else {
				this.$parent.error -= 1
			}
			console.log(this.$parent.error)
		}
	}
}
</script>