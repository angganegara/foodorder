<template>
	<section class="admin">
		<div class="header">
			<nav>
				<ul>
					<li><a href="#" title="" class="logo"><i class="fa fa-home fa-fw"></i> MOTION CAFE</a></li>
					<li><router-link to="/auth/logout"><i class="fa fa-fw fa-sign-out"></i> Logout</router-link></li>
				</ul>
			</nav>
		</div>
		<div class="app-body">
			<div class="sidebar">
				<ul>
					<li class="topic">Manage</li>
					<li><router-link to="/admin" exact><i class="fa fa-fw fa-calendar"></i> Schedule</router-link></li>
					<li><router-link to="/admin/orders"><i class="fa fa-fw fa-shopping-basket"></i> Orders</router-link></li>
					<li><router-link to="/admin/coupon"><i class="fa fa-fw fa-money"></i> Coupon Code</router-link></li>
				</ul>
			</div>
			<div class="content">
				<transition name="fade" mode="out-in">
					<router-view keep-alive :auth="auth"></router-view>
				</transition>
			</div>
		</div>
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
		//auth.check()
		if (!auth.authenticated) {
			//this.$router.push('/auth/login')
		}
		this.$Progress.finish()
		this.$root.isAdmin = true
	}
}
</script>
