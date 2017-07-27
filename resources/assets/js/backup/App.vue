<template>
    <div class="app-wrapper">
        <app-header :popup="popup"></app-header>

        <transition name="fade" mode="out-in">
            <router-view keep-alive></router-view>
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
import mixin from './mixins'
var $ = require('jquery')

export default {
    name: 'App',
    mixins: [mixin],
    components: { AppHeader, AppFooter },
    data() {
        return {
            localCart: []
        }
    },
    created() {
        //localStorage.removeItem('cart')
        var localCart = localStorage.getItem('cart')
        
        if (localCart != null && localCart != '') {
            var tmp = JSON.parse(localCart)[0]
            if (_.has(tmp, 'singleMeal') == false) {
                this.$store.state.cart = []
                localStorage.setItem('cart', JSON.stringify(this.$store.state.cart))
            } else {
                this.$store.dispatch('loadCart', localCart)
            }
        }

        this.$Progress.finish()
    }
}
</script>
