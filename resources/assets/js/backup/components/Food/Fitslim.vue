<template>
	<div class="food-wrap">
		<div class="row">
			<div class="col-xs-12 col-md-6 col-lg-8">
				<div class="row fit">
					<div class="col-xs food-menus" v-for="menu in menus">
						<div class="food-menu food-text">
							<h4>{{ menu.day }}</h4>
							<div v-html="menu.content"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-md-6 col-lg-4">
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
				<div class="fitslim-pic">
					<figure><img :src="`/images/foods/${data.id}_1.jpg`" alt=""></figure>
				</div>
				<div class="fitslim-pic">
					<figure><img :src="`/images/foods/${data.id}_2.jpg`" alt=""></figure>
				</div>
			</div>
		</div>
		<!--
		<div class="row">
			<div class="col-xs-12">
				<div class="page-subtitle">
					<h2>fit&slim weekly menu</h2>
				</div>
			</div>
		</div>
		-->

	</div>
</template>

<script>
export default {
	name: 'fit-slim',
	props: ['data'],
	data() {
		return {
			menus: {}
		}
	},
	methods: {
        formatPrice (price) {
            return numeral(price).format('0,0')
        }
    },
	created() {
		this.$http.get('/api/menus').then((res) => {
			this.menus = res.body
		})
	}
}
</script>
