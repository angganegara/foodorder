<template>
	<div class="food-wrap">
        <div class="row">
            <div class="col-xs-12 col-md-8 flex">
                <div class="food-detox">
                    <h4 class="food-name">Juice Detox</h4>
                    <div class="row">
	                    <div class="col-xs-12 col-md-6">
<p>Our juice detox involves the short-term intake of raw vegetable and fruit juices, Coconut water, turmeric boost, herbal tea and water.</p>
<p>A juice fast is considered an extreme form of detoxification because no solid food is consumed. There should be a gradual start into this detox and then a return to solid foods.</p>
<p><b>CONTENT</b></p>
<p>2 bottles freshly blended raw veggie&fruit juices, 1 bottle Turmeric Boost, 1 bottle coconut water, 2 herbal tea bags, 1x Epsom salts.<br>You will receive your daily package every morning.</p>
<p><b>TARGET</b></p>
<p>The benefit of juicing is that it gives your digestion system a break from working so hard to process a large meal therefore your body can work rapidly on detoxification. This leads to feeling joyful and light, and keeping slim and radiant.</p>
		                </div>
		                <div class="col-xs-12 col-md-6">
		                	<figure><img :src="`/images/foods/${data.id}_1.jpg`" alt=""></figure>
		                </div>
		            </div>
		            <hr>
		            <h4 class="food-name">Soup Detox</h4>
                    <div class="row">
	                    <div class="col-xs-12 col-md-6">
<p>The Soup Detox is based only on vegetables. These two tasty soups are freshly cooked and rounded off with spices that support your digestion. They are rich in minerals and vitamins to keep you nourished and healthy.</p>
<p><b>CONTENT</b></p>
<p>For one day: 1 coconut water for breakfast, 2 veggie soups for lunch and dinner, 2 blended vegetable soups as snacks between breakfast/lunch and lunch/dinner and1x Epsom salts. You will get the whole amount for 6 days on the beginning day of your detox.</p>
<p><b>TARGET</b></p>
<p>The purpose of following a six-day Soup Detox is to affect a rapid weight-loss by consuming mainly vegetable soup on each day of your diet. This method detoxifies your body naturally and makes you feel lighter and balanced.</p>
		                </div>
		                <div class="col-xs-12 col-md-6">
		                	<figure><img :src="`/images/foods/${data.id}_3.jpg`" alt=""></figure>
		                </div>
		            </div>
		            <hr>
		            <h4 class="food-name">VEGGIE & FRUIT DETOX</h4>
                    <div class="row">
	                    <div class="col-xs-12 col-md-6">
<p>The Veggie & Fruit Detox is our lightest version of all detox methods.<br>
This delicious plant-based menu will help you to get rid of the toxins in your body, feeling more energized and slim down.</p>
<p><b>CONTENT</b></p>
<p>This 6-day menu includes breakfast, lunch and dinner as well as 2 snacks in form of a drink as an extra energy kick in between the meals plus 1x Epsom salts. All meals are freshly cooked right before delivery and contain only high-quality ingredients.</p>
<p><b>TARGET</b></p>
<p>This diet with the high intake of veggies & fruits helps your body to detox naturally. At the same time, you resorb all the vitamins and minerals from the fresh veggies and fruits.</p>
		                </div>
		                <div class="col-xs-12 col-md-6">
		                	<figure><img :src="`/images/foods/${data.id}_5.jpg`" alt=""></figure>
		                </div>
		            </div>
                </div>
            </div>
            <div class="col-xs-12 col-md-4 flex">
                <div class="food-price food-text" style="align-self: flex-start">
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
    </div>
</template>

<script>
export default {
	name: 'food-detox',
	props: ['data'],
	methods: {
        formatPrice (price) {
            return numeral(price).format('0,0')
        }
    },
}
</script>
