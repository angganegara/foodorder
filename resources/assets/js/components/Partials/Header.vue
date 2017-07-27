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
                            HEALTHY MEAL PLANS FOR DELIVERY
                        </h1>
                    </div>
                </div>
                <a href="http://cafe.motionfitnessbali.com" title="" class="cart-btn main-site"><i class="fa fa-fw fa-angle-left"></i> back to Motion Cafe's page</a>
                <a title="" class="cart-btn" v-show="this.$route.name == 'home' || this.$route.name == 'food'">
                    <div class="cart-title"><i class="fa fa-fw fa-shopping-cart"></i> Your Cart</div>
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
}
</script>
