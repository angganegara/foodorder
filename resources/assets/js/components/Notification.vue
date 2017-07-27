<template>
	<div :class="{ 'notification': true, [this.notificationType]: true, 'on': notification }">
		<span v-html="notificationMessage"></span>
	</div>
</template>

<script>

export default {
	data() {
		return {
			notification: false,
			notificationType: '',
			message: ''
		}
	},
	computed: {
		notificationMessage() {
			var icon = this.type == 'success' ? '<i class="fa fa-fw fa-check-circle"></i>' : '<i class="fa fa-fw fa-exclamation-triangle"></i>'
			return icon +' '+ this.message
		}
	},
	created() {
		bus.$on('open-notification', ({type, message}) => {
			this.notification = true
			this.notificationType = type
			this.message = message
			setTimeout(() => {
				this.closeNotification()
			}, 2000)
		})
	},
	methods: {
		closeNotification() {
			this.notification = false
			this.notificationType = ''
			this.message = ''
		}
	}
}
</script>