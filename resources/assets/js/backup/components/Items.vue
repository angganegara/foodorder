<template>
    <div class="item-wrap">
        <div class="page-title"><h2>Menu list</h2></div>
        <div class="row items fitslim">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 item-thumbs flex">
                <router-link :to="'/'+ fitslim.slug +'/'+ fitslim.id" class="figure diet-info">
                    <div class="item-meta">
                        <span class="item-name">
                            {{ fitslim.name }}
                        </span>
                        <span class="item-price">
                            {{ format(fitslim.weeklyprice) }} IDR / week
                        </span>
                    </div>
                    <img :src="'/images/foods/thumb_'+ fitslim.id +'.jpg?1'" :alt="fitslim.name" class="product-picture">
                </router-link>

                <div class="item-short-desc" v-html="fitslim.short_description"></div>
                <div class="item-buttons">
                    <router-link :to="'/'+ fitslim.slug +'/'+ fitslim.id" class="btn diet-info btn-sm btn-motion">
                        <i class="fa fa-fw fa-eye"></i> <span>DETAILS</span>
                    </router-link>
                    <a href="javascript:;" @click="showPopup(fitslim)" v-if="! isAdded(fitslim.id)" title="" class="btn-diet btn btn-sm btn-info pull-right">
                        <i class="fa fa-fw fa-plus"></i> <span>ADD TO CART</span>
                    </a>
                    <a href="javascript:;" class="btn-diet btn btn-sm btn-success pull-right" @click="removeItem(fitslim)" v-else>
                        <i class="fa fa-fw fa-check"></i> <span>ADDED</span>
                    </a>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-9 flex">
                <div class="fitslim-description">
                    <h4>{{ fitslim.name }}</h4>
                    <div v-html="fitslim.description"></div>
                </div>
            </div>
        </div>

        <div class="page-title"><h2>special diets</h2></div>
        <div class="row items" v-if="! loading">
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 item-thumbs" v-for="product in products" v-if="product.id != 3">
                <router-link :to="'/'+ product.slug +'/'+ product.id" class="figure diet-info">
                    <div class="item-meta">
                        <span class="item-name">
                            {{ product.name }}
                        </span>
                        <span class="item-price">
                            {{ format(product.price) }} IDR / week
                        </span>
                    </div>
                    <img :src="'/images/foods/thumb_'+ product.id +'.jpg?1'" :alt="product.name" class="product-picture">
                </router-link>

                <div class="item-short-desc" v-html="product.short_description"></div>
                <div class="item-buttons">
                    <router-link :to="'/'+ product.slug +'/'+ product.id" class="btn diet-info btn-sm btn-motion">
                        <i class="fa fa-fw fa-eye"></i> <span>DETAILS</span>
                    </router-link>
                    <a href="javascript:;" @click="showPopup(product)" v-if="! isAdded(product.id)" title="" class="btn-diet btn btn-sm btn-info pull-right">
                        <i class="fa fa-fw fa-plus"></i> <span>ADD TO CART</span>
                    </a>
                    <a href="javascript:;" class="btn-diet btn btn-sm btn-success pull-right" @click="removeItem(product)" v-else>
                        <i class="fa fa-fw fa-check"></i> <span>ADDED</span>
                    </a>
                </div>
            </div>
        </div>
        <div v-else>
            Loading ...
        </div>
    </div>
</template>

<script>
import mixin from '../mixins'
export default {
    name: 'Items',
    mixins: [mixin],
    data () {
        return {
            fitslim: {},
            products: [],
            loading: true
        }
    },
    created () {
        this.$http.get('/api/foods/3').then((res) => {
            this.fitslim = res.body
        })
        this.$http.get('/api/foods').then(function (res) {
            this.products = (res.body)
        }).then(function (res) {
            this.$Progress.finish()
            this.loading = false
        })
    },
    methods: {
        format(num) {
            return numeral(num).format('0,0')
        },
        isAdded(id) {
            return _.find(this.$store.state.cart, (o) => {
                return o.id == id
            });
        },
        removeItem(obj) {
            if (window.confirm('Remove item from shopping cart?')) {
                this.$store.dispatch('removeItem', obj)
                this.$root.itemAdded = true
                setTimeout(() => {
                    this.$root.itemAdded = false
                }, 100)
            }
        }
    }
}
</script>
