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
                <button class="button primary" v-if="! isAdded" @click="showPopup(data)">
                    <i class="fa fa-fw fa-plus"></i> add to cart
                </button>
                <button class="button primary" v-else>
                    <i class="fa fa-fw fa-check"></i> already in cart
                </button>
            </div>
        </div>
        <template v-if="this.id != 7 && this.id != 3">
            <div class="food-wrap">
                <div class="row">
                    <div class="col-xs-12 col-md-8 flex">
                        <div class="food-description food-text">
                            <h4>{{ data.name }}</h4>
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
                <div class="row" v-if="data.id == 7">
                    <div class="col-xs-12">
                        <div class="page-subtitle">
                            <h2>Detox Details</h2>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <template v-if="data.id == 7">
                        <div class="col-xs food-menus">
                            <div class="food-menu food-text">
                                <h4>Juice Detox</h4>
                                <p>Our juice detox involves the short-term intake of raw vegetable and fruit juices, Coconut water, turmeric boost, herbal tea and water.</p>
                                <p>A juice fast is considered an extreme form of detoxification because no solid food is consumed. There should be a gradual start into this detox and then a return to solid foods.</p>
                                <p><b>CONTENT</b></p>
                                <p>2 bottles freshly blended raw veggie&fruit juices, 1 bottle Turmeric Boost, 1 bottle coconut water, 1 bottle herbal tea, 1x Epsom salts.<br>You will receive your daily package every morning.</p>
                                <p><b>TARGET</b></p>
                                <p>The benefit of juicing is that it gives your digestion system a break from working so hard to process a large meal therefore your body can work rapidly on detoxification. This leads to feeling joyful and light, and keeping slim and radiant.</p>
                            </div>
                        </div>
                        <div class="col-xs food-menus">
                            <div class="food-menu food-text">
                                <h4>Soup Detox</h4>
                                <p>The Soup Detox is based only on vegetables. These two tasty soups are freshly cooked and rounded off with spices that support your digestion. They are rich in minerals and vitamins to keep you nourished and healthy.</p>
                                <p><b>CONTENT</b></p>
                                <p>For one day: 1 coconut water for breakfast, 2 veggie soups for lunch and dinner, 2 blended vegetable soups as snacks between breakfast/lunch and lunch/dinner and1x Epsom salts. You will get the whole amount for 6 days on the beginning day of your detox.</p>
                                <p><b>TARGET</b></p>
                                <p>The purpose of following a six-day Soup Detox is to affect a rapid weight-loss by consuming mainly vegetable soup on each day of your diet. This method detoxifies your body naturally and makes you feel lighter and balanced.</p>
                            </div>
                        </div>
                        <div class="col-xs food-menus">
                            <div class="food-menu food-text">
                                <h4>Veggie & Fruit Detox</h4>
                                <p>The Veggie & Fruit Detox is our lightest version of all detox methods.<br>
                                This delicious plant-based menu will help you to get rid of the toxins in your body, feeling more energized and slim down.</p>
                                <p><b>CONTENT</b></p>
                                <p>This 6-day menu includes breakfast, lunch and dinner as well as 2 snacks in form of a drink as an extra energy kick in between the meals plus 1x Epsom salts. All meals are freshly cooked right before delivery and contain only high-quality ingredients.</p>
                                <p><b>TARGET</b></p>
                                <p>This diet with the high intake of veggies & fruits helps your body to detox naturally. At the same time, you resorb all the vitamins and minerals from the fresh veggies and fruits.</p>
                            </div>
                        </div>
                    </template>
                    <template v-if="data.id == 3">
                        <div class="col-xs food-menus" v-for="menu in menus">
                            <div class="food-menu food-text">
                                <h4>{{ menu.day }}</h4>
                                <div v-html="menu.content"></div>
                            </div>
                        </div>
                    </template>
                    <br>
                    <div class="col-xs food-menus">
                        <figure><img :src="`/images/foods/${data.id}_1.jpg`" alt=""></figure>
                    </div>
                    <div class="col-xs food-menus">
                        <figure><img :src="`/images/foods/${data.id}_2.jpg`" alt=""></figure>
                    </div>
                    <template v-if="data.id == 7 || data.id == 10">
                        <div class="col-xs food-menus">
                            <figure><img :src="`/images/foods/${data.id}_3.jpg`" alt=""></figure>
                        </div>
                        <div class="col-xs food-menus">
                            <figure><img :src="`/images/foods/${data.id}_4.jpg`" alt=""></figure>
                        </div>
                    </template>
                </div>
            </div>
        </template>
        <template v-if="this.id == 7">
            <detox-page :data="data"></detox-page>
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
                <button class="button primary" v-if="! isAdded" @click="showPopup(data)">
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
    },
    computed: {
        isAdded () {
            return _.find(this.$store.state.cart, (o) => {
                return o.id == this.id
            });
        }
    }
}
</script>
