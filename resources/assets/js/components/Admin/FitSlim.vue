<template>
	<section>
		<notification></notification>
		<div class="container-fluid no-padding">
			<div class="bread">
				<ul>
					<li><router-link to="/admin">Admin</router-link></li>
					<li>Fit&Slim Menu</li>
				</ul>
			</div>
			<div class="inner">
				<div class="row">
					<div class="col-xs-12">
						<div class="section-title">
							<h2>Fit&Slim Details</h2>
							<button @click="saveName()" class="button"><i class="fa fa-fw fa-check"></i> Save Name</button>
						</div>
					</div>
				</div>
				<form enctype="multipart/form-data" method="post" name="fitslim-name">
					<div class="row fitslim">
						<div class="col-xs-12 col-md-6">
							<h2>Name</h2>
							<input name="name" type="text" class="form-control" v-model="name">
						</div>
						<div class="col-xs-12 col-md-6">
							<h2>Subname</h2>
							<input name="subname" type="text" class="form-control" v-model="subname">
						</div>
						<div class="col-xs-12 col-md-6">
							<h2>Thumbnail</h2>
							<input type="file" name="thumbnail" @change="syncThumb">
						</div>
						<div class="col-xs-12 col-md-6">
							<h2>Full picture</h2>
							<input type="file" name="full" @change="syncFull">
						</div>
						<div class="col-xs-12">
							<hr>
						</div>
					</div>
				</form>
				<div class="row">
					<div class="col-xs-12">
						<div class="section-title">
							<h2>Fit&Slim Menu</h2>
							<button @click="saveMenu()" class="button"><i class="fa fa-fw fa-check"></i> Save Menu</button>
						</div>
					</div>
				</div>
				<div class="row fitslim">
					<div class="col-xs-12 col-md-3" v-for="menu in menus">
						<h2>{{ menu.day }}</h2>
						<textarea class="form-control" rows="14" v-html="markdown(menu.content)" v-model="menu.content"></textarea>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
var marked = require('../../plugins/marked')
import auth from '../../helpers/auth.js'
export default {
	name: 'FitSlim',
	data() {
		return {
			menus: {},
			notification: {},
			name: '',
			subname: '',
			thumb: '',
			full: ''
		}
	},
	created() {
		this.fetchMenu()
		this.fetchName()
		auth.checkAuth()
	},
	methods: {
		syncThumb(e) {
			e.preventDefault()
			var files = e.target.files || e.dataTransfer.files
			if (!files.length)
				return;
			this.thumb = files[0]
		},
		syncFull(e) {
			e.preventDefault()
			var files = e.target.files || e.dataTransfer.files
			if (!files.length)
				return;
			this.full = files[0]
		},
		markdown(value) {
			return marked(value, { sanitize: true })
		},
		fetchName() {
			this.$http.get('/api/admin/fitslim/names').then((res) => {
				this.name = res.body.name
				this.subname = res.body.subname
			})
		},
		fetchMenu() {
			this.$http.get('/api/admin/fitslim/menu').then((res) => {
				this.menus = res.body
				this.$Progress.finish()
			})
		},
		saveName() {
			var formData = new FormData()
			formData.append('name', this.name)
			formData.append('subname', this.subname)
			formData.append('thumb', this.thumb)
			formData.append('full', this.full)

			this.$http.post('/api/admin/fitslim/names', formData, {
			}).then((res) => {
				this.notification = {
					type: 'success',
					message: 'details saved'
				}
				bus.$emit('open-notification', this.notification)
			})
		},
		saveMenu() {
			this.$http.post('/api/admin/fitslim/menu', { menus: this.menus }).then((res) => {
				this.notification = {
					type: 'success',
					message: 'menu saved'
				}
				bus.$emit('open-notification', this.notification)
			})
		}
	}
}
</script>

<style>
textarea.form-control {
	font-size: 13px;
	line-height: 140%;
}
</style>
