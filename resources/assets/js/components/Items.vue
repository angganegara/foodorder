<template>
    <div class="item-wrap">
		<wanderlust></wanderlust>

        <template v-if="products" v-for="(c, i) in products">
            <div class="page-title" :key="`title-${i}`">
                <h2>{{ c.title }}</h2>
                <a href="/pdf/FAQ-about-Detox.pdf" target="_blank" class="detox-pdf" v-if="c.id == 3"><i class="fa fa-file-pdf-o"></i> &nbsp; FAQ about Detox</a>
            </div>
            <div class="row items" v-if="! loading" :key="i">
                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 item-thumbs" v-for="product in c.diets" :key="product.id">
                    <router-link :to="'/'+ product.slug +'/'+ product.id" class="figure diet-info">
                        <div class="item-meta">
                            <span class="item-name">
                                {{ product.name }}
                            </span>
                            <span class="item-price">
                                {{ format(product.price) }} IDR / week
                            </span>
                        </div>
                        <img :src="'/images/foods/thumb_'+ product.id +'.jpg?'+ date" :alt="product.name" class="product-picture">
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
        </template>
    </div>
</template>

<script>
import mixin from '../mixins'
import WeeklyMenu from './Home/WeeklyMenu.vue'
import Wanderlust from './Home/Wanderlust.vue'

let date = new Date()
export default {
    name: 'Items',
    mixins: [mixin],
	components: { 'weekly': WeeklyMenu, 'wanderlust' : Wanderlust },

    data () {
        return {
            products: [],
            loading: true,
            date: date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString(),
        }
    },

    created () {
        this.$http.get('/api/foods/categorize').then(function (res) {
            this.products = (res.body)
        }).then(function () {
            this.$Progress.finish()
            this.loading = false
        })
    }
}
</script>
