<template>
	<section class="home">
		<div class="container intro">
			<div class="inner">
				<figure><img src="/images/bg.jpg" alt=""></figure>
				<p>
					The best solution for an overall healthy body is the combination of fitness and nutrition. We need to be
					active and eat the right food. Preparing and cooking can be stressful and needs a lot of time. With our food
					delivery service you not only save your valid time, but also get the best nutrition for your body.
				</p>
				<p>
					Choose your preferred diet, our weekly changing menu or even get a customised diet, personally tailored for you.
					All our dishes are rich in vitamins and minerals and balanced in their combination of ingredients. Fresh, organic,
					high quality food, easy delivered wherever you are.
				</p>
				<div class="drop-down">
					<a href="#" @click.prevent="openDropdown()" class="title">
						<h1>DELIVERY & ORDER INFO</h1>
						<span v-if="dropdown"><i class="fa fa-2x fa-angle-up"></i></span>
						<span v-else><i class="fa fa-2x fa-angle-down"></i></span>
					</a>
					<div class="body" v-show="dropdown">
						<p><b>Order times: Monday to Saturday from 8:00 to 17:00</b> (closed on Sundays).<br>Please notice that you need to order 24 hrs in advance to give us time to prepare your food</p>
						<p>Our drivers will deliver your food between 07:30 and 21:30 Mondays to Saturdays to your home, office or wherever you like to eat. We try to deliver your food as close to your preferred delivery time as possible but please allow us a +/- 15 min. time margin. You know how traffic in Bali is like :-)</p>
						<p>To keep Bali clean and green we try to avoid as much waste as possible and therefore deliver our food & drinks in re-usable boxes, glasses and bottles for all orders start from 3 days. Please help us to maintain this environmental effort and <b>return all re-usable containers to our drivers</b>.</p>
					</div>
				</div>
			</div>
		</div>
		<div class="container">
			<items></items>
			<hr>
			<div class="text-xs-center">
				<router-link to="/overview" class="button yellow big">
					checkout <i class="fa fa-fw fa-angle-right"></i>
				</router-link>
			</div>
		</div>
	</section>
</template>

<script>
import Items from './Items.vue'
import Cart from './Cart.vue'

export default {
	name: 'Home',
	components: { Items, Cart },
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
