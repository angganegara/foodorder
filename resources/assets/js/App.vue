<template>
  <div class="app-wrapper">
    <app-header :popup="popup" :cart="cart"></app-header>
    <div class="popup-map on" v-show="popupMap" @click="closePopupMap">
      <div class="popup-map-close">
        click anywhere to close the map
      </div>
      <div class="popup-map-flex">
        <img src="/images/map.jpg?1" alt="">
      </div>
    </div>

    <div class="popup-hiw on" v-show="popupHIW">
      <div class="popup-hiw-flex">
        <how-it-works level="1" :popup="true"></how-it-works>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <router-view keep-alive :cart="cart"></router-view>
    </transition>
    <vue-progress-bar></vue-progress-bar>

    <app-footer></app-footer>

  </div>
</template>

<style>
.slide-enter-active {
  transition: all .2s ease-in-out;
}
.slide-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-enter, .slide-leave-active {
  padding-left: 20px;
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: all .3s ease-in-out
}
.fade-enter, .fade-leave-active {
  opacity: 0.01
}
</style>

<script>
import AppHeader from './components/Partials/Header.vue'
import AppFooter from './components/Partials/Footer.vue'
import HowItWorks from './components/HowItWorks.vue'
import mixin from './mixins'
import moment from 'moment'
var $ = require('jquery')

export default {
  name: 'App',
  mixins: [mixin],
  components: { AppHeader, AppFooter, HowItWorks },
  data() {
    return {
      cart: {},
      popupMap: false,
      popupHIW: false
    }
  },
  mounted() {
    this.$Progress.finish()
    this.getDomain();
  },
  created() {
    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        this.$Progress.parseMeta(meta)
      }

      this.$Progress.start()
      next()
    })

    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })

    this.$store.dispatch('loadCart').then((res) => {
      this.calculateCart()
    })
    bus.$on('schedulerReady', () => {
      this.calculateCart()
    })
    bus.$on('cartIsReady', () => {
      this.calculateCart()
      setTimeout(() => bus.$emit('mainCartIsReady'), 500);
    })
    bus.$on('updateCartContent', () => {
      this.calculateCart()
    })
    this.$Progress.finish()
  },
  methods: {
    getDomain() {
      this.$http.get('/api/domain').then(res => this.$root.domain = res.body);
    },
    closePopupMap() {
      this.popupMap = false
    },
    closePopupHIW() {
      this.popupHIW = false
    },
    calculateCart() {
      this.$http.post('/api/calculate-cart', this.cartState).then((res) => {
        this.cart = res.body
        return res.body
      }).then((res) => {
        // generating blank schedule. maybe this should be done in home instead?
        this.generateSchedule()
      }).catch((err) => {
        // sum thing wong
        console.log(err)
      })
    },
    generateSchedule() {
      let cart = this.cart
      let schedule = this.schedule
      if (schedule != undefined && schedule != '') {
        schedule = (schedule)
      }

      cart.forEach((c, index) => {
        let totaldays = 0
        let skipday = null

        if (c.typeraw == 'weekly') {
          totaldays = c.totaldays
          skipday = true
        }
        if (c.typeraw == 'fullday') {
          totaldays = c.totaldays
          skipday = true
        }
        if (c.typeraw == 'singlemeal') {
          totaldays = c.totaldays
          skipday = true
        }

        let days = this.generateConsecutiveDate(c.deliverydate, totaldays, skipday)
        days = _.isArray(days) ? days : [days]

        this.cart[index].schedule = []
        days.forEach((d) => {
          let data = {
            itemid:            c.id,
            date:              d,
            breakfast:         '07:30',
            breakfastLocation: '',
            lunch:             '12:00',
            lunchLocation:     '',
            dinner:            '17:30',
            dinnerLocation:    '',
            allowed: {
              breakfast:     true,
              lunch:         this.isSpecialDetox(c) ? false : true,
              dinner:        this.isSpecialDetox(c) ? false : true
            }
          }
          this.cart[index].schedule.push(data)
        })

        if (schedule[c.id] != undefined && schedule[c.id] != '') {
          this.cart[index].schedule = schedule[c.id]
        }
      })
    },

    generateConsecutiveDate(start, total, skipsunday) {
      if (total == 1) {
        return start
      } else {
        let startDate = moment(start, "dddd, DD MMM YYYY")
        let dates = []
        let k = 0
        let dateCheck
        dates[0] = startDate.format('dddd, DD MMM YYYY')
        for (let i = 1; i < total; i++) {
          if (skipsunday) {
            k = startDate.format('ddd') == 'Sat' ? 2 : 1
          } else {
            k = 1
          }
          dateCheck = startDate.add(k, 'days')
          dates[i] = dateCheck.format('dddd, DD MMM YYYY')
        }

        //return _.join(dates, ', ')
        return dates
      }
    },
  }
}
</script>
