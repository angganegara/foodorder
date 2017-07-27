// hold the application state

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        cart: [],
        schedule: [],
        activeProduct: {},
        detox: '',
        total: 0,
        popup: false,
    },
    mutations: {
        ADD_ITEM(state, object) {
            var found = _.find(state.cart, ['id', object.id])
            if (typeof found == 'object') {
                state.cart.splice(state.cart.indexOf(object), 1)
            }
            state.cart.push(object)
            // save to localstorage here?
            localStorage.setItem('cart', JSON.stringify(state.cart))
            state.popup = false
        },
        INCREASE_QTY(state, object) {
            var found = _.find(state.cart, ['id', object.id])
            if (typeof found == 'object') {
                var index = _.indexOf(state.cart, found)
                state.cart[index].qty++
            }
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        DECREASE_QTY(state, object) {
            var found = _.find(state.cart, ['id', object.id])
            if (typeof found == 'object') {
                var index = _.indexOf(state.cart, found)
                //console.log(index, state.cart.indexOf(object))
                if (state.cart[index].qty > 1) {
                    state.cart[index].qty--
                } else {
                    state.cart.splice(index, 1)
                }
                localStorage.setItem('cart', JSON.stringify(state.cart))
            }
        },
        REMOVE_ITEM(state, object) {
            var found = _.find(state.cart, ['id', object.id])
            var index = _.indexOf(state.cart, found)
            state.cart.splice(index, 1)
            localStorage.setItem('cart', JSON.stringify(state.cart))

            // delete schedule as well
            var schedule = localStorage.getItem('schedule')
            if (schedule != undefined && schedule != '') {
                state.schedule = JSON.parse(schedule)
                state.schedule.splice(object.id, 1)
                localStorage.setItem('schedule', JSON.stringify(state.schedule))
            }
        },
        LOAD_CART(state, object) {
            state.cart = JSON.parse(object) || []
        },
        SELECT_MEAL_OPTIONS(state, object) {
            state.activeProduct = object
        },
        SET_ACTIVE_DETOX(state, object) {
            state.detox = object
        },
        SYNC_SCHEDULE(state, object) {
            var data = object
            state.schedule = []
            if (data != '') {
                data.forEach((d) => {
                    // is it exist ?
                    if(d.schedule.length > 0) {
                        state.schedule[d.id] = d.schedule
                    }
                })

                localStorage.setItem('schedule', JSON.stringify(state.schedule))
            }
        },
        LOAD_SCHEDULE(state) {
            var schedule = localStorage.getItem('schedule')
            if (schedule != undefined && schedule != '') {
                state.schedule = JSON.parse(schedule)
            }
        }
    },
    actions: {
        addItem({commit}, object) {
            commit('ADD_ITEM', object)
        },
        increaseQty({commit}, object) {
            commit('INCREASE_QTY', object)
        },
        decreaseQty({commit}, object) {
            commit('DECREASE_QTY', object)
        },
        removeItem({commit}, object) {
            commit('REMOVE_ITEM', object)
        },
        loadCart({commit}, object) {
            commit('LOAD_CART', object)
        },
        selectMealOptions({commit}, object) {
            commit('SELECT_MEAL_OPTIONS', object)
        },
        setActiveDetox({commit}, object) {
            commit('SET_ACTIVE_DETOX', object)
        },
        syncSchedule({commit}, object) {
            commit('SYNC_SCHEDULE', object)
        },
        loadSchedule({commit}) {
            commit('LOAD_SCHEDULE')
        }
    }
})
