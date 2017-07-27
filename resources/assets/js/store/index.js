// hold the application state

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		cart: [],
		schedule: [],
		address: {
			address1: '',
			address1_outside: false,
			address2: '',
			address2_outside: false
		},
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
				}
				localStorage.setItem('cart', JSON.stringify(state.cart))
			}
		},
		REMOVE_ITEM(state, object) {
			var found = _.find(state.cart, ['id', object.id])
			var index = _.indexOf(state.cart, found)
			state.cart.splice(index, 1)
			localStorage.setItem('cart', JSON.stringify(state.cart))

			// remove schedule
			state.schedule[object.id] = null
			localStorage.setItem('schedule', JSON.stringify(state.schedule))
		},
		LOAD_CART(state) {
			let localCart = localStorage.getItem('cart')
			if (localCart != null && localCart != '') {
				var tmp = JSON.parse(localCart)[0]
				if (_.has(tmp, 'singleMeal') == false) {
					state.cart = []
					localStorage.setItem('cart', JSON.stringify(state.cart))
				}
			}
			state.cart = JSON.parse(localCart) || []
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
		},
		SYNC_ADDRESS(state, object) {
			state.address = object
			localStorage.setItem('address', JSON.stringify(state.address))
		},
		LOAD_ADDRESS(state) {
			var address = localStorage.getItem('address')
			if (address != undefined && address != '' && address != '{}') {
				state.address = JSON.parse(address)
			}
		},
	},
	actions: {
		addItem({commit}, object) {
			return new Promise ((resolve, reject) => {
				commit('ADD_ITEM', object)
				resolve(object)
			})
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
		loadCart({commit}) {
			return new Promise((resolve, reject) => {
				commit('LOAD_CART')
				resolve()
			})
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
			return new Promise((resolve, reject) => {
				commit('LOAD_SCHEDULE')
				resolve()
			})
		},
		syncAddress({commit}, object) {
			commit('SYNC_ADDRESS', object)
		},
		loadAddress({commit}) {
			commit('LOAD_ADDRESS')
		},
		removeSchedule({commit}, object) {
			commit('REMOVE_SCHEDULE', object)
		}
	}
})
