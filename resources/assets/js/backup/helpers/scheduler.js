import moment from 'moment'
export default {
    data () {
        return {
            cart: [],
            scheduledata: Array
        }
    },
    watch: {
        cart: {
            handler: _.debounce(function(val, old) {
                this.scheduledata = val
                this.$store.dispatch('syncSchedule', val)
            }, 1000),
            deep: true
        }
    },
    created() {
        this.$store.dispatch('loadSchedule')
    },
    mounted() {
        if (this.$store.cartState != '') {
            this.calculateCart()
        }
    },
    methods: {
        calculateCart() {
            this.$http.post('/api/calculate-cart', this.cartState).then((res) => {
                this.cart = res.body
                // generate days for schedule
                this.generateSchedule()
            }).catch((err) => {
                // sum thing wong
                console.log(err)
                /*this.cart = ''
                this.$store.state.cart = []
                localStorage.removeItem('cart')*/
            })
        },

        /**
         * Generates schedule for all menu in cart
         */
        generateSchedule() {
            let cart = this.cart
            let schedule = this.$store.state.schedule
            if (schedule != undefined && schedule != '') {
                schedule = (schedule)
            }

            cart.forEach((c, index) => {
                let totaldays = 0
                let skipday = null
                if (c.typeraw == 'weekly') {
                    totaldays = c.easysunday ? 7 : 6
                    skipday = false
                }
                if (c.typeraw == 'fullday') {
                    totaldays = c.totaldays
                    skipday = true
                }

                let days = this.generateConsecutiveDate(c.deliverydate, totaldays, skipday)
                days = _.isArray(days) ? days : [days]

                this.cart[index].schedule = []
                days.forEach((d) => {
                    let data = {
                        itemid:    c.id,
                        date:      d,
                        type:      '',
                        location:  '',
                        breakfast: '07:30',
                        lunch:     '13:00',
                        dinner:    '19:00'
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
        }
    }
}
