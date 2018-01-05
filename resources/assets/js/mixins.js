import {mapState} from 'vuex'

export default {
  methods: {
		selectAll(location, id) {
			bus.$emit('updateLocation', { location, id })
		},
		subtitle ({ typeraw, type, totaldays }) {
			let text = type
			if (typeraw == 'weekly') {
				let week = Math.round(totaldays / 6)
				let weekWord = week > 1 ? 'weeks' : 'week'
				text += ` (${week} ${weekWord})`
			}
			if (typeraw == 'fullday') {
				let daysWord = totaldays > 1 ? 'days' : 'day'
				text += ` (${totaldays} ${daysWord})`
			}
			if (typeraw == 'singlemeal') {
				let daysWord = totaldays > 1 ? 'days' : 'day'
				text += ` (${totaldays} ${daysWord})`
			}
			return text
		},
    decrement (object) {
      this.$store.dispatch('decreaseQty', object)
      object.qty--
    },
    increment (object) {
      this.$store.dispatch('increaseQty', object)
      object.qty++
    },
    remove (object) {
      if (window.confirm('Remove item from shopping cart?')) {
        this.$store.dispatch('removeItem', object);
        bus.$emit('updateCartContent');
        this.$root.itemAdded = true;
        setTimeout(() => {
          this.$root.itemAdded = false;
        }, 100);
        object.qty = 0
      }
    },
    showPopup(product) {
      this.$store.state.popup = true
      this.$store.dispatch('selectMealOptions', product)
    },
    scroll(target, duration, offset=0) {
      $('html, body').animate({
        scrollTop: $(`${target}`).offset().top + parseInt(offset)
      }, duration)
    },
    isSpecialDetox(product) {
      return (product.id == 19 || product.id == 20 || product.id == 15)
		},
		format(num) {
      return numeral(num).format('0,0')
		},
		isAdded(id) {
      return _.find(this.$store.state.cart, (o) => {
        return o.id == id
      });
		},
		removeItem(obj) {
      if (window.confirm('Remove item from shopping cart?')) {
        this.$store.dispatch('removeItem', obj)
        this.$root.itemAdded = true
        setTimeout(() => {
          this.$root.itemAdded = false
        }, 100)
      }
    }
  },
  computed: {
    ...mapState({
      cartState: state => state.cart,
      product: state => state.activeProduct,
      popup: state => state.popup,
      added: state => state.added,
      detox: state => state.detox,
      schedule: state => state.schedule,
      address: state => state.address
    })
  }
}
