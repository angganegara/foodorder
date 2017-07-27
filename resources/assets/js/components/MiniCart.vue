<template>
    <div class="mini-cart">
        <div v-if="cartState.length > 0">
            <section class="items">
                <transition-group name="fade" tag="div">
                    <div class="item" v-for="product in cart" key="cart-item" v-if="product.qty">
                        <div class="col-1">
                            <h4>{{ product.name }}</h4>
                            <div class="qty-number">
                                <a href="#" @click.prevent="decrement(product)" class="qty left"><i class="fa fa-fw fa-minus"></i></a>
                                <span>{{ qty(product) }}</span>
                                <a href="#" @click.prevent="increment(product)" class="qty right"><i class="fa fa-fw fa-plus"></i></a>
                            </div>
                        </div>
                        <div class="col-2">
                            <p>{{ subtotal(product) }} IDR</p>
                        </div>
                        <div class="col-3">
                            <button @click="remove(product)"><i class="fa fa-fw fa-times"></i></button>
                        </div>
                    </div>
                </transition-group>
            </section>
            <div class="total">
                <div class="col-1">
                    <router-link to="/overview" class="check-out">checkout <i class="fa fa-fw fa-angle-right"></i></router-link>
                    <br>
                    <a href="#" @click.prevent="resetCart()" class="empty-cart">Empty your cart</a>
                </div>
                <div class="col-2">
                    <h5>Total</h5>
                    <p>{{ total }} IDR</p>
                </div>
            </div>
        </div>
        <section v-else>
            Your cart is empty
        </section>
    </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
    transition: all .5s ease-in-out
}
.fade-enter, .fade-leave-active {
    opacity: 0.01
}
</style>

<script>
import mixin from '../mixins'
import cartHelper from '../helpers/cart'

export default {
    mixins: [mixin, cartHelper]
}
</script>
