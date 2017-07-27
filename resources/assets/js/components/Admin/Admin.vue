<template>
	<section class="admin">
		<div class="header">
			<nav>
				<ul>
					<li><a href="#" title="" class="logo">AVOCADO CAFE</a></li>
					<li><router-link to="/admin" exact>Dashboard</router-link></li>
					<li><router-link to="/admin/fitslim">Fit&Slim</router-link></li>
					<li><router-link to="#/admin/items">Items</router-link></li>
					<li><router-link to="/admin/orders">Orders</router-link></li>
					<li><router-link to="/auth/logout">Logout</router-link></li>
				</ul>
			</nav>
		</div>
		<div class="content">
			<transition name="fade" mode="out-in">
				<router-view keep-alive :auth="auth"></router-view>
			</transition>
		</div>
		<footer>
			Made with <i class="fa fa-fw fa-heart"></i> by <a href="http://helloangga.com" target="_blank">Angga Negara</a>
		</footer>
	</section>
</template>

<script>
import auth from '../../helpers/auth.js'

export default {
	name: 'Admin',
	data () {
		return {
			auth: auth
		}
	},
	created() {
		auth.check()
		if (!auth.authenticated) {
			this.$router.push('/auth/login')
		}
		this.$Progress.finish()
		this.$root.isAdmin = true
	}
}
</script>
