'use strict'

import { vm, router } from '../main.js'

export default {

	authenticated: false,
	profile: null,

	login(context, creds, redirect) {
		context.$http.post('/api/auth/login', creds).then((data) => {
			localStorage.setItem('token', data.body.token)

			this.authenticated = true

			if (redirect) {
				context.$router.push(redirect)
			}

			Vue.http.headers.common['Authorization'] = this.getJwtBearer()
		}).catch((err) => {
			if (err.status == 422) {
				alert('please enter your username / password')
			}

			if (err.status == 404) {
				alert('User not found')
			}
		})
	},

	logout(context = null) {
		localStorage.removeItem('token')
		this.authenticated = false
		if (context != null) {
			context.$router.push('/auth/login')
		}
	},

	checkAuth() {
		var jwt = localStorage.getItem('token')
		if (jwt) {
			this.authenticated = true
		} else {
			this.authenticated = false
		}
	},

	check() {
		if (localStorage.getItem('token') !== null) {
			Vue.http.get('/api/admin/user').then(response => {
				this.authenticated = true
				this.profile = response.data.data
			})
		}
	},

	getAuthHeader() {
		return {
			'Authorization': getJwtBearer()
		}
	},

	getJwtBearer() {
		return 'Bearer ' + localStorage.getItem('token')
	}

}