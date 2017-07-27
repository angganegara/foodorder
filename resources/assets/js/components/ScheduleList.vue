<template>
	<div>
		<template v-for="(product, i) in cart" v-if="product">
			<div class="delivery-compact">
				<div class="delivery-title">
					<h2>
						{{ product.name }} {{ product.subname }}
						<span v-if="product.typeraw == 'fullday' || product.typeraw == 'singlemeal'">for {{ product.totaldays }} day(s)</span>
					</h2>
					<span class="delivery-type">{{ product.type }}</span>
				</div>
				<div class="delivery-body">
					<table class="table-schedule" width="100%">
						<template v-for="s in schedule[product.id]">
							<tr class="day">
								<td colspan="2"><b>{{ s.date }}</b></td>
							</tr>
							<tr v-if="s.breakfastLocation != ''">
								<td width="65%" class="type">
									<div class="type">Breakfast</div>
									<div v-html="getLocation(s.breakfastLocation)"></div>
								</td>
								<td width="10%" class="text-xs-right">
									{{ s.breakfast }}
								</td>
							</tr>
							<tr v-if="s.lunchLocation != ''">
								<td width="65%" class="type">
									<div class="type">Lunch</div>
									<div v-html="getLocation(s.lunchLocation)"></div>
								</td>
								<td width="10%" class="text-xs-right">
									{{ s.lunch }}
								</td>
							</tr>
							<tr v-if="s.dinnerLocation != ''">
								<td width="65%" class="type">
									<div class="type">Dinner</div>
									<div v-html="getLocation(s.dinnerLocation)"></div>
								</td>
								<td width="10%" class="text-xs-right">
									{{ s.dinner }}
								</td>
							</tr>
						</template>
						<template v-if="product.typeraw == 'weekly' && product.id == 3 && product.easysunday">
							<tr class="day">
								<td colspan="2"><b>Easy Sunday</b></td>
							</tr>
							<tr>
								<td class="type">
									The Easy Sunday food items will be delivered on Saturday, together with your Fit & Slim dishes
								</td>
								<td>&nbsp;</td>
							</tr>
						</template>
					</table>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import mixin from '../mixins'

export default {
	name: 'ScheduleList',
	mixins: [mixin],
	props: ['cart'],
	created() {
		this.$store.dispatch('loadSchedule').then(() => {
			// tell Cart to calculate discount now that we got the schedule
			bus.$emit('scheduleIsReady')
		})
		this.$store.dispatch('loadAddress')
	},
	methods: {
		getLocation(type) {
			if (type != 'pickup1' && type != 'pickup2') {
				var outside = `${type}_outside`
				var extra = ''
				if (this.address[outside]) {
					extra = '<br><span class="extra"><i class="fa fa-fw fa-bus"></i> extra delivery</span>'
				}
				return this.address[type] + extra
			} else {
				return type == 'pickup1' ? 'Avocado Cafe' : 'Motion Fitness'
			}
		}
	}
}
</script>
