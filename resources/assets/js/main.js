
// require bootstrap
require('./bootstrap')

import store from './store/index'
import VueProgressBar from 'vue-progressbar'
import VeeValidate from 'vee-validate'
import App from './App.vue'
import Home from './components/Home.vue'
import Admin from './components/Admin/Admin.vue'
import auth from './helpers/auth.js'
import Notification from './components/Notification.vue'
import VueAgile from 'vue-agile'

import VueRouter from 'vue-router'

Vue.use(VueAgile)
Vue.use(VueRouter);

import Overview from './components/Overview.vue'
import Checkout from './components/Checkout.vue'
import ThankYou from './components/Thankyou.vue'
import Food from './components/Food.vue'
//const Food = resolve => require.ensure(['./components/Food.vue'], () => resolve(require('./components/Food.vue')))

Vue.http.headers.common['Authorization'] = auth.getJwtBearer();
auth.checkAuth()

Vue.http.interceptors.push((req, next) => {
	next((res) => {
		if (res.status == 401) {
			auth.logout()
			router.push('/auth/login')
		}
	})
})

const config = {
  errorBagName: 'errors', // change if property conflicts.
  delay: 0,
  locale: 'en',
  messages: null,
  strict: true
};
Vue.use(VeeValidate, config)
Vue.use(VueProgressBar, {
  color: 'rgb(181, 225, 237)',
  failedColor: 'red',
  height: '4px'
})

Vue.component('notification', Notification)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
			path: '/admin', component: Admin, meta: { auth: true },
      children: [
        { name: 'order page', path: 'orders', component: require('./components/Admin/Orders.vue') },
        { name: 'order details page', path: 'orders/:id', component: require('./components/Admin/ViewOrders.vue') },
				{ name: 'fit&slim menu', path: 'fitslim', component: require('./components/Admin/FitSlim.vue') },
				{ name: 'coupon page', path: 'coupon', component: require('./components/Admin/Coupon.vue') },
				{ name: 'coupon details page', path: 'coupon/:id', component: require('./components/Admin/ViewCoupon.vue') },
        { name: 'admin home', path: '', component: require('./components/Admin/Home.vue') },
      ]
    },
    { path: '/auth/:action', component: require('./components/Admin/Auth.vue'), name: 'auth' },
    { path: '/:slug/:id', component: Food, name: 'food' },
    { path: '/overview', component: Overview, name: 'overview' },
		{ path: '/checkout', component: Checkout, name: 'checkout' },
		{ path: '/thank-you', component: ThankYou, name: 'thankyou' },
		{ path: '/terms-and-conditions', component: require('./components/Terms.vue'), name: 'terms' },
    { path: '/', component: Home, name: 'home' }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

var bus = new Vue({})
window.bus = bus

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
		(!auth.authenticated)
			? next('/auth/login')
			: next()
  } else {
    next()
  }
})

var vm = new Vue({
  el: '#app',
  data () {
    return {
      itemAdded: false,
      sAdmin: false,
      domain: false
    }
  },
  store,
  router,
  render: h => h(App)
})

// set dev mode
if (vm.$route.query.dev == 1) {
	window.localStorage.setItem('dev_mode', true)
}

// other scripts
require('./web')
