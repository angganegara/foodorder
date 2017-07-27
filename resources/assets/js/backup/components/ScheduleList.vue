<template>
    <div>
        <template v-for="(product, i) in cart" v-if="product.qty > 0">
            <div class="delivery-compact">
                <div class="delivery-title">
                    <h2>
                        {{ product.name }} {{ product.subname }}
                        <span v-if="product.typeraw == 'fullday' || product.typeraw == 'singlemeal'">for {{ product.totaldays }} day(s)</span>
                    </h2>
                    <span>{{ product.type }}</span>
                </div>
                <div class="delivery-body">
                    <div class="delivery-day" v-for="s in schedule[product.id]">
                        <div>{{ s.date }} - {{ s.type }} <span v-if="s.type == 'pickup'">at {{ s.location }}</span></div>
                        <div>breakfast: {{ s.breakfast }}. lunch: {{ s.lunch }}. dinner: {{ s.dinner }}</div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import mixin from '../mixins'
import cartHelper from '../helpers/cart'

export default {
    mixins: [mixin, cartHelper],
    created() {
        this.$store.dispatch('loadSchedule')
        this.schedule = this.$store.state.schedule
    }
}
</script>
