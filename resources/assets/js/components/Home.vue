<template>
	<section class="home">
		<div class="container intro">
			<div class="inner">
                <agile :infinite="true" :autoplay="true" :speed="750" :dots="false" :fade="true">
                    <div class="slide"><img src="/images/slide.jpg"></div>
                    <div class="slide"><img src="/images/slide2.jpg"></div>
                    <div class="slide"><img src="/images/slide3.jpg"></div>
                </agile>
				<h1 class="intro-title">FITNESS FOOD & MORE</h1>
				<div class="intro-subtitle">
					Clean eating, designed for optimal nutrition delivered to your home or office.<br>
					100% Homemade & Fresh - Whole Foods - Organic - No Refined Sugar.<br>
					All Motion Meals are available as Vegan / Vegetarian / Gluten-Free / Dairy-Free option upon request.
				</div>
			</div>
		</div>
		<div class="container">
			<items/>
            <how-it-works level="2" :popup="false"></how-it-works>
		</div>
	</section>
</template>

<script>
import Items from './Items.vue'
import HowItWorks from './HowItWorks.vue'
import Cart from './Cart.vue'

export default {
	name: 'Home',
	components: { Items, Cart, HowItWorks },
	data () {
		return {
			dropdown: false
		}
	},
	methods: {
		openDropdown() {
			this.dropdown = ! this.dropdown
        }
	}
}
</script>
