let _ = require('lodash')
import moment from 'moment'
export default {
    name: 'Scheduler',
    props: ['cart'],
    watch: {
        cart: {
            handler: _.debounce(function(val, old) {
                this.scheduledata = val
                this.$store.dispatch('syncSchedule', val)
            }, 1000),
            deep: true
        },
        'address.address1': {
            handler: _.debounce(function(val, old) {
                if (val == '') {
                    this.removeAddress('address1')
                }
                this.$store.dispatch('syncAddress', {
                    address1: val,
                    address1_outside: this.address.address1_outside,
                    address2: this.address.address2,
                    address2_outside: this.address.address2_outside
                })
            }, 1000)
        },
        'address.address2': {
            handler: _.debounce(function(val, old) {
                if (val == '') {
                    this.removeAddress('address2')
                }
                this.$store.dispatch('syncAddress', {
                    address1: this.address.address1,
                    address1_outside: this.address.address1_outside,
                    address2: val,
                    address2_outside: this.address.address2_outside
                })
            }, 1000)
        },
        'address.address1_outside': {
            handler: function(val, old) {
                this.$store.dispatch('syncAddress', {
                    address1: this.address.address1,
                    address1_outside: val,
                    address2: this.address.address2,
                    address2_outside: this.address.address2_outside
                })
            }
        },
        'address.address2_outside': {
            handler: function(val, old) {
                this.$store.dispatch('syncAddress', {
                    address1: this.address.address1,
                    address1_outside: this.address.address1_outside,
                    address2: this.address.address2,
                    address2_outside: val
                })
            }
        }
    },
    created() {
    	// we tell root that this comp is ready
    	bus.$emit('schedulerReady')
        // load saved schedule
        this.$store.dispatch('loadSchedule')
        // load saved address
        this.$store.dispatch('loadAddress')
    },
    methods: {
        erase(model, i, key) {
            this.cart[i].schedule[key].location = ''
            return true
        },
        openMap() {
            this.$parent.$parent.popupMap = true
        },
        updateAllowedTime(cart, schedule, e) {
            var val = e.target.value
            var pointer = this.cart[cart].schedule[schedule]
            pointer.allowed.breakfast = false
            pointer.breakfastLocation = ''
            pointer.allowed.lunch = false
            pointer.lunchLocation = ''
            pointer.allowed.dinner = false
            pointer.dinnerLocation = ''
            pointer.allowed[val] = true
        },
        removeAddress(type) {
            var start = 1;
            this.cart.forEach((data) => {
                let s = data.schedule
                s.forEach((day) => {

                    day.breakfastLocation =
                        day.breakfastLocation != 'pickup1' && day.breakfastLocation != 'pickup2' && day.breakfastLocation == type
                        ? '' : day.breakfastLocation

                    day.lunchLocation =
                        day.lunchLocation != 'pickup1' && day.lunchLocation != 'pickup2' && day.lunchLocation == type
                        ? '' : day.lunchLocation

                    day.dinnerLocation =
                        day.dinnerLocation != 'pickup1' && day.dinnerLocation != 'pickup2' && day.dinnerLocation == type
                        ? '' : day.dinnerLocation
                })
            })
        }

    }
}
