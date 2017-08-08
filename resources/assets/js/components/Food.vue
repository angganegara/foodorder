<template>
    <div class="food-page container">
        <div class="comp-loading" v-if="loading">
            <div class="el-loading-spinner">
                <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
                <p class="el-loading-text">Loading...</p>
            </div>
        </div>
        <div class="page-title">
            <h2>Menu details</h2>
            <div class="page-buttons">
                <router-link to="/" class="button no-border">
                    <i class="fa fa-fw fa-angle-left"></i> back
                </router-link>
                <button class="button primary" v-if="! isAdded(this.id)" @click="showPopup(data)">
                    <i class="fa fa-fw fa-plus"></i> add to cart
                </button>
                <button class="button primary" v-else>
                    <i class="fa fa-fw fa-check"></i> already in cart
                </button>
            </div>
        </div>
        <template v-if="this.id != 3">
            <div class="food-wrap">
                <div class="row">
                    <div class="col-xs-12 col-md-8 flex">
                        <div class="food-description food-text">
                            <h4 class="food-name">{{ data.name }}</h4>
                            <div v-html="data.description"></div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-4 flex">
                        <div class="food-price food-text">
                            <template v-for="price in data.prices">
                                <div class="flex food-title">
                                    <h5>{{ price.name }}</h5>
                                    <p class="price">{{ formatPrice(price.price) }} IDR</p>
                                </div>
                                <template v-if="price.description"><p class="desc">{{ price.description }}</p></template>
                                <hr>
                            </template>
                            <p>All prices include tax, service and delivery to Kuta/Seminyak/Canggu area.</p>
                            <p>Delivery surcharge of 50,000 IDR/day applies for other areas (e.g. Sanur, Bukit, Ubud, Nusa Dua)</p>
                            <p>All payments must be done on the first day of delivery.</p>
                            <p>Payment options: cash to driver upon nota receipt, PayPal, bank transfer</p>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="data.id == 3">
                    <div class="col-xs-12">
                        <div class="page-subtitle">
                            <h2>fit&slim weekly menu</h2>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <template v-if="data.id == 3">
                        <div class="col-xs food-menus" v-for="menu in menus">
                            <div class="food-menu food-text">
                                <h4>{{ menu.day }}</h4>
                                <div v-html="menu.content"></div>
                            </div>
                        </div>
                    </template>
                    <br>
                    <template v-for="file in data.pictures">
                        <div class="col-xs food-menus">
                            <figure><img :src="`/images/foods/${file}`" alt=""></figure>
                        </div>
                    </template>
                </div>
            </div>
        </template>
        <template v-if="this.id == 3">
            <fit-slim :data="data"></fit-slim>
        </template>
        <br>
        <div class="page-title">
            <router-link to="/overview" class="button yellow big">
                checkout <i class="fa fa-fw fa-angle-right"></i>
            </router-link>
            <div class="page-buttons">
                <router-link to="/" class="button no-border">
                    <i class="fa fa-fw fa-angle-left"></i> back
                </router-link>
                <button class="button primary" v-if="! isAdded(this.id)" @click="showPopup(data)">
                    <i class="fa fa-fw fa-plus"></i> add to cart
                </button>
                <button class="button primary" v-else>
                    <i class="fa fa-fw fa-check"></i> already in cart
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import mixin from '../mixins'
import Detox from './Food/Detox.vue'
import FitSlim from './Food/FitSlim.vue'

export default {
    mixins: [mixin],
    components: { 'detox-page': Detox, 'fit-slim': FitSlim },
    name: 'Food',
    data () {
        return {
            slug: this.$route.params.slug,
            id: this.$route.params.id,
            data: {},
            loading: true,
            date: new Date('Y-m-d')
        }
    },
    created () {
        this.$http.get('/api/foods/'+ this.id).then(function (res) {
            this.data = res.body
            this.$Progress.finish()
            this.loading = false
		})		
    },
    methods: {
        formatPrice (price) {
            return numeral(price).format('0,0')
        }
    }
}
</script>
