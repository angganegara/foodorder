import moment from 'moment'

export default {
	props: ['extradelivery', 'cart'],
	data () {
		return {
			result: {},
			totaldays: 0,
			discount: 0,
			loading: true
		}
	},
	computed: {
		total () {
			var total = _.sumBy(this.cart, function(item) {
				var price = item.price
				return (price * item.qty)
			});
			if (this.totaldays > 0) {
				total = total + (this.totaldays * 50000)
			}
			if (this.discount > 0) {
				total = total - this.discount
			}
			return numeral(total).format('0,0')
		},
		extraprice() {
			return numeral(this.totaldays * 50000).format('0,0')
		},
		discountformat() {
			return numeral(this.discount).format('0,0')
		}
	},
	created () {
		// we tell main app that this comp is ready
		bus.$emit('cartIsReady')
		// after main app's reply, start calculating discount
		bus.$on('mainCartIsReady', () => {
			bus.$on('scheduleIsReady', () => {
				setTimeout(() => {
					this.checkDeliveryDiscount(this.cart).then((total) => {
						bus.$emit('totaldisc', total)
					})
				}, 500)
			})
		})
		bus.$on('totaldisc', (total) => {
			this.discount = total * 100000
			if(this.$parent.form != undefined) {
				this.$parent.form.discount = this.discount
			}
			this.loading = false
		})
	},
	methods: {
		checkDeliveryDiscount(object) {
			return new Promise((resolve, reject) => {
				let cart = object
				let found = 0
				var total = 0
				cart.forEach((d) => {
					if (d.typeraw == 'weekly') {
						let schedule = this.schedule[d.id]
						if (schedule != undefined) {
							// use filter baby
							var found = schedule.filter((date) => {
								return (
									( date.breakfastLocation != 'pickup1' && date.breakfastLocation != 'pickup2' && date.breakfastLocation != 'wanderlust' )
									|| ( date.lunchLocation != 'pickup1' && date.lunchLocation != 'pickup2' && date.lunchLocation != 'wanderlust' )
									|| ( date.dinnerLocation != 'pickup1' && date.dinnerLocation != 'pickup2' && date.dinnerLocation != 'wanderlust' )
								)
							}).length

							if (found <= 0) {
								// gak ada, semuanya pickup. add 1 total
								total += 1
							}
						}
					}
				})
				resolve(total)
			})
		},
		nl2br(string) {
			return string.replace('\n', '<br>')
		},
		qty (object) {
			var found = _.find(this.$store.state.cart, ['id', object.id])
			if (typeof found == 'object') {
				var index = _.indexOf(this.$store.state.cart, found)
				return this.$store.state.cart[index].qty
			}
		},
		subtotal (object) {
			return numeral(object.qty * object.price).format('0,0')
		},
		checkTotalDays(object) {
			let cart = object
			let found = 0
			let add = this.address

			cart.forEach((data) => {
				let schedule = this.schedule[data.id]
				if (schedule != undefined) {
					schedule.forEach((date) => {
						if (date.breakfastLocation != '' || date.lunchLocation != '' || date.dinnerLocation != '') {
							if (add.address1_outside) {
								if (date.breakfastLocation == 'address1' ||
									date.lunchLocation == 'address1' ||
									date.dinnerLocation == 'address1') {
									found += 1
								}
							} else if (add.address2_outside) {
								if (date.breakfastLocation == 'address2' ||
									date.lunchLocation == 'address2' ||
									date.dinnerLocation == 'address2') {
									found += 1
								}
							}
						}
					})
				}
			})
			this.totaldays = found
			if(this.$parent.form != undefined) {
				this.$parent.form.deliveryprice = found * 50000
			}
		},
		resetCart() {
			this.$store.state.cart = []
			this.$store.state.schedule = []
			localStorage.setItem('cart', JSON.stringify(this.$store.state.cart))
			localStorage.setItem('schedule', JSON.stringify(this.$store.state.schedule))
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
