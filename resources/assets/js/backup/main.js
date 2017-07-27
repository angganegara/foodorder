
// require bootstrap
require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the body of the page. From here, you may begin adding components to
 * the application, or feel free to tweak this setup for your needs.
 */

import store from './store/index'
import VueProgressBar from 'vue-progressbar'
import VeeValidate from 'vee-validate'
import App from './App.vue'
import Home from './components/Home.vue'
import Admin from './components/Admin/Admin.vue'
import auth from './helpers/auth.js'
import Notification from './components/Notification.vue'

Vue.http.headers.common['Authorization'] = auth.getJwtBearer();
auth.checkAuth()

Vue.http.interceptors.push((req, next) => {
    next((res) => {
        if (res.status == 401) {
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
    color: 'rgb(255, 204, 0)',
    failedColor: 'red',
    height: '4px'
})

Vue.component('notification', Notification)

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/admin', component: Admin, name: 'admin', meta: { auth: true },
            children: [
                { name: 'order page', path: 'orders', component: require('./components/Admin/Orders.vue') },
                { name: 'order details page', path: 'orders/:id', component: require('./components/Admin/ViewOrders.vue') },
                { name: 'admin home', path: '', component: require('./components/Admin/Home.vue') },
            ]
        },
        { path: '/auth/:action', component: require('./components/Admin/Auth.vue'), name: 'auth' },
        { path: '/:slug/:id', component: require('./components/Food.vue'), name: 'food' },
        { path: '/overview', component: require('./components/Overview.vue'), name: 'overview' },
        { path: '/checkout', component: require('./components/Checkout.vue'), name: 'checkout' },
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

window.bus = new Vue()

var vm = new Vue({
    el: '#app',
    data () {
        return {
            itemAdded: false,
            isAdmin: false
        }
    },
    store,
    router,
    render: h => h(App)
})

router.beforeEach((to, from, next) => {
    vm.$Progress.start()
    if (to.matched.some(record => record.meta.auth)) {
        if (!auth.authenticated) {
            next('/auth/login')
        } else {
            next()
        }
    } else {
        next()
    }
})

// other scripts
require('./web')