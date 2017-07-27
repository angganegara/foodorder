import {mapState} from 'vuex'

export default {
    methods: {
        decrement (object) {
            this.$store.dispatch('decreaseQty', object)
            object.qty--
        },
        increment (object) {
            this.$store.dispatch('increaseQty', object)
            object.qty++
        },
        remove (object) {
            this.$store.dispatch('removeItem', object)
            object.qty = 0
        },
        showPopup(product) {
            this.$store.state.popup = true
            this.$store.dispatch('selectMealOptions', product)
        },
        scroll(target, duration, offset=0) {
            $('html, body').animate({
                scrollTop: $(`${target}`).offset().top + parseInt(offset)
            }, duration)
        }
    },
    computed: {
        ...mapState({
            cartState: state => state.cart,
            product: state => state.activeProduct,
            popup: state => state.popup,
            added: state => state.added,
            detox: state => state.detox,
            schedule: state => state.schedule
        })
    }
}
