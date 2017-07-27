<template>
    <section v-if="!this.$root.isAdmin">
        <transition name="fade">
            <food-prompt v-show="popup" :popup="popup"></food-prompt>
        </transition>
        <div class="header-wrap">
            <div class="container header">
                <div class="row">
                    <div class="col-xs-6 col-md-12">
                        <figure><img src="/images/logo.jpg" alt="Motion Fitness Bali" class="logo"></figure>
                    </div>
                </div>
                <a title="" class="cart-btn" v-show="this.$route.name == 'home' || this.$route.name == 'food'">
                    <div class="cart-title"><i class="fa fa-fw fa-shopping-cart"></i> Your Cart</div>
                    <div class="cart-menu">
                        <mini-cart></mini-cart>
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
    props: ['popup']
}
</script>