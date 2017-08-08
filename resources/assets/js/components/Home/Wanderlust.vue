<template>
	<div class="wanderlust">
		<div class="page-title"><h2>WANDERLUST CROSS FIT MENUS</h2></div>
        <div class="row items fitslim">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 item-thumbs flex">
                <a href="#" class="figure no-overlay diet-info"><img src="/images/wanderlust-logo.jpg" alt="Wanderlust Cross Fit Menus" class="product-picture"></a>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-9">
                <div class="fitslim-description">
                    <div>
						<h4>WANDERLUST CROSS FIT MENUS</h4>
						<p>Crossfit Wanderlust Bali and Motion Café have designed meal plans specific for CrossFitters.</p>
						<p>Depending on your training and general fitness goals, you can choose between 3 menus:</p>
						<p>Gainer: 2500 – 3000cal per day / Balanced: 2000 – 2500 cal per day / Shredding: 1500 – 2000 cal per day.</p>
						<p>All those menus will support your training routine, elevates your energy level and increase lean muscle mass. All our menus are created by a professional nutritionist and fitness trainer.</p>
						<p>Macro-nutrients have been broken down to ensure you will get the right amount of protein, carbs and good fat. Our CrossFit menus are also available in vegetarian and vegan options.</p>
					</div>
                </div>
            </div>
        </div>

		<template v-if="items" v-for="(c, i) in items">
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
import mixin from '../../mixins'
let date = new Date()

export default {
	name: 'Wanderlust',
	mixins: [mixin],

	data() {
		return {
			items: null,
			loading: true,
			date: date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString()
		}
	},

	created() {
		this.$http.get('/api/foods/category/6').then((res) => {
            this.items = res.body
        }).then(function () {
            this.$Progress.finish()
            this.loading = false
        })
	}
}
</script>