<template>
    <section v-if="!this.$root.isAdmin">
        <transition name="fade">
            <food-prompt v-show="popup" :popups="popup"></food-prompt>
        </transition>
        <div class="header-wrap">
            <div class="container header">
                <div class="row">
                    <div class="col-xs-12 col-md-12 flex">
                        <figure><router-link to="/"><img src="/images/logo.png" alt="Motion Fitness Bali" class="logo"></router-link></figure>
                        <h1 class="logo-title">
                            MEAL PLANS TO REACH YOUR GOALS
                        </h1>
                    </div>
                </div>
                <a :href="backToLink.href" title="" class="cart-btn main-site" v-html="backToLink.html"></a>
                <a title="" class="cart-btn" v-show="this.$route.name == 'home' || this.$route.name == 'food' || this.$route.name == 'terms'">
                    <div class="cart-title"><i class="fa fa-fw fa-shopping-cart"></i> See Your Order</div>
                    <div class="cart-menu">
                        <mini-cart :cart="cart"></mini-cart>
                    </div>
                </a>
            </div>
        </div>
    </section>
</template>

<script>
import MiniCart from '../MiniCart.vue'
import FoodPrompt from '../FoodPrompt.vue'
export default {
    name: 'app-header',
    components: { MiniCart, FoodPrompt },
    props: ['popup', 'cart'],

	data() {
		return {
			backToLink: {
				href: 'http://cafe.motionfitnessbali.com',
				html: `<i class="fa fa-fw fa-angle-left"></i> back to Motion Cafe's page`
			}
		}
	},

	created() {
		const host = window.location.hostname
		if (host == 'wanderlust.motionfitnessbali.com') {
			this.backToLink = {
				href: 'http://www.crossfitwanderlust.com/fit-foods/',
				html: `<i class="fa fa-fw fa-angle-left"></i> back to Wanderlust page`
			}
		}
	}
}
</script>
