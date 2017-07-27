import moment from 'moment'
export default {
    props: ['emit', 'extradelivery'],
    data () {
        return {
            cart: [
                {
                    id: null,
                    name: '',
                    subname: '',
                    price: 0,
                    type: '',
                    deliverydate: '',
                    deliverytype: '',
                    schedule: [{
                        date: '',
                        day: '',
                        breakfast: {
                            time: '',
                            location: '',
                            address: ''
                        },
                        lunch: {
                            time: '',
                            location: '',
                            address: ''
                        },
                        dinner: {
                            time: '',
                            location: '',
                            address: ''
                        }
                    }],
                    qty: null,
                    typeraw: '',
                    easySunday: null,
                    numberOfDays: null
                }
            ],
            result: {},
            totaldays: 0
        }
    },
    computed: {
        total () {
            var total = _.sumBy(this.cart, function(item) {
                var price = item.price
                return (price * item.qty)
            });
            if (this.extradelivery) {
                total = total + (this.totaldays * 50000)
            }
            return numeral(total).format('0,0')
        },
        emitted() {
            return this.emit
        },
        extraprice() {
            return numeral(this.totaldays * 50000).format('0,0')
        }
    },
    created () {
        if (this.$store.cartState != '') {
            this.calculateCart()
        }
    },
    methods: {
        qty (object) {
            var found = _.find(this.$store.state.cart, ['id', object.id])
            var index = _.indexOf(this.$store.state.cart, found)
            return this.$store.state.cart[index].qty
        },
        subtotal (object) {
            return numeral(object.qty * object.price).format('0,0')
        },
        calculateCart() {
            this.$http.post('/api/calculate-cart', this.cartState).then((res) => {
                this.cart = res.body
                if (this.emitted) {
                    this.$parent.postCart = this.cart
                }
                var schedule = this.cart
                var days = 0
                schedule.forEach((data) => {
                    days += parseInt(data.totaldays)
                })
                this.totaldays = days
            }).catch((err) => {
                // sum thing wong
                this.cart = ''
                this.$store.state.cart = []
                localStorage.removeItem('cart')
            })
        },
        resetCart() {
            this.$store.state.cart = []
            localStorage.setItem('cart', JSON.stringify(this.$store.state.cart))
        },
        generateConsecutiveDate(start, total) {
            if (total == 1) {
                return start
            } else {
                let startDate = moment(start, "dddd, DD MMM YYYY")
                let dates = []
                let k = 0
                let dateCheck
                dates[0] = startDate.format('dddd, DD MMM YYYY')
                for (let i = 1; i < total; i++) {
                    k = startDate.format('ddd') == 'Sat' ? 2 : 1
                    dateCheck = startDate.add(k, 'days')
                    dates[i] = dateCheck.format('dddd, DD MMM YYYY')
                }

                return _.join(dates, ', ')
            }
        }
    }
}
