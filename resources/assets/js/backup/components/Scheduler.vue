<template>
    <div>
        <section class="overview-cart" v-if="cartState.length > 0">

            <div class="info">
                <p>Sentence about IDR 100,000 discount if customer choose pick-up</p>
            </div>
            <br>

            <template v-for="(product, i) in cart" v-if="product.qty > 0">
                <div class="delivery">
                    <div class="delivery-title">
                        <h2>
                            {{ product.name }} {{ product.subname }}
                            <span v-if="product.typeraw == 'fullday' || product.typeraw == 'singlemeal'">for {{ product.totaldays }} day(s)</span>
                        </h2>
                        <span>{{ product.type }}</span>
                    </div>
                    <div class="delivery-body">
                        <template v-for="(s, key) in product.schedule">
                            <div class="delivery-days">
                                <span>{{ s.date }}</span>
                                <span>
                                    <label>
                                        <input type="radio" v-model="s.type" :name="`type-${product.id}-${key}`" value="pickup">
                                        Pickup <i class="fa fa-fw fa-shopping-bag"></i>
                                    </label>
                                </span>
                                <span>
                                    <label>
                                        <input type="radio" v-model="s.type" :name="`type-${product.id}-${key}`" value="delivery">
                                        Delivery <i class="fa fa-fw fa-bus"></i>
                                    </label>
                                </span>
                            </div>
                            <template v-if="s.type == 'pickup' || s.type == 'delivery'">
                                <div class="delivery-type">
                                    <div class="cell" v-if="s.type == 'pickup'">
                                        <span>Pickup location :</span>
                                        <span>
                                            <label>
                                                <input type="radio" v-model="s.location" :name="`location-${product.id}-${key}`" value="Avocado Cafe">
                                                Avocado Cafe Bali
                                            </label>
                                        </span>
                                        <span>
                                            <label>
                                                <input type="radio" v-model="s.location" :name="`location-${product.id}-${key}`" value="Motion Fitness">
                                                Motion Fitness Bali
                                            </label>
                                        </span>
                                    </div>
                                    <div class="cell" v-else>
                                        <span>Your Address :</span>
                                        <span>&nbsp;</span>
                                        <span>
                                            <textarea v-model="s.location" rows="5" cols="60" class="form-control"></textarea>
                                        </span>
                                    </div>
                                    <div class="cell">
                                        <span>Breakfast :</span>
                                        <span>&nbsp;</span>
                                        <time-picker v-model="s.breakfast"></time-picker>
                                    </div>
                                    <div class="cell">
                                        <span>Lunch :</span>
                                        <span>&nbsp;</span>
                                        <time-picker v-model="s.lunch"></time-picker>
                                    </div>
                                    <div class="cell">
                                        <span>Dinner :</span>
                                        <span>&nbsp;</span>
                                        <time-picker v-model="s.dinner"></time-picker>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </template>

        </section>
        <section v-else>
            Your cart is empty
        </section>
    </div>
</template>

<script>
import mixin from '../mixins'
import schedulerHelper from '../helpers/scheduler.js'
import timepicker from './TimePicker.vue'

export default {
    mixins: [mixin, schedulerHelper],
    components: { 'time-picker': timepicker },
    methods: {
        erase(model, i, key) {
            this.cart[i].schedule[key].location = ''
            return true
        }
    }
}
</script>
