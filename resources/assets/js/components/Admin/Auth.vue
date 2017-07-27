<template>
	<section class="login">
		<div class="login-bg">
			<div class="login-form">
				<h2>Login</h2>
				<form method="post" @submit.prevent="login">
					<input type="text" v-model="username" class="form-control" placeholder="username">
					<br>
					<input type="password" v-model="password" class="form-control" placeholder="password">
					<br>
					<button class="button">login</button>
				</form>
			</div>
		</div>
	</section>
</template>

<script>
import auth from '../../helpers/auth.js'

export default {
	name: 'auth-login',
	data() {
		return {
			username: '',
			password: '',
			authenticate: auth.authenticate
		}
	},
	methods: {
		login() {
			var credentials = {
				username: this.username,
				password: this.password
			}

			auth.login(this, credentials, '/admin')
		}
	},
	created() {
		// if logout
		if (this.$route.params.action == 'logout') {
			auth.logout(this)
		}
		this.$Progress.finish()
	},
	mounted() {
		this.$root.isAdmin = true
	}
}
</script>