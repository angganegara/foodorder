<template>
    <div>
        <section class="overview-cart" v-if="cartState.length > 0">
            <table class="table-cart">
                <tr>
                    <th width="50%">Name</th>
                    <th width="15%" class="hidden-md-down">Type</th>
                    <th width="15%" class="text-xs-center">Qty</th>
                    <th width="15%">Subtotal</th>
                    <th width="5%">&nbsp;</th>
                </tr>
                <tr v-for="product in cart" v-if="product.qty > 0">
                    <td>
                        <strong>
                            {{ product.name }}
                            <span v-if="product.subname"><br>{{ product.subname }}</span>
                            <span v-if="product.typeraw == 'fullday' || product.typeraw == 'singlemeal'"> for {{ product.totaldays }} day(s)</span>
                        </strong>
                        <br>
                        <template v-if="product.typeraw == 'fullday' || product.typeraw == 'singlemeal'">
                            Delivery starting date:<br>{{ generateConsecutiveDate(product.deliverydate, product.totaldays) }}
                        </template>
                        <template v-else>
                            Delivery starting date: {{ product.deliverydate }}
                        </template>
                    </td>
                    <td class="hidden-md-down">{{ product.type }}</td>
                    <td class="text-xs-center">
                        <div class="qty-number">
                            <a href="#" @click.prevent="decrement(product)" class="qty left"><i class="fa fa-fw fa-minus"></i></a>
                            <span>{{ qty(product) }}</span>
                            <a href="#" @click.prevent="increment(product)" class="qty right"><i class="fa fa-fw fa-plus"></i></a>
                        </div>
                    </td>
                    <td>{{ subtotal(product) }} IDR</td>
                    <td class="text-xs-center">
                        <a href="#" @click.prevent="remove(product)" class="qty"><i class="fa fa-fw fa-times"></i></a>
                    </td>
                </tr>
                <tr v-if="extradelivery" class="total">
                    <td colspan="3" class="text-xs-right">Extra delivery</td>
                    <td colspan="2">{{ extraprice }} IDR</td>
                </tr>
                <tr class="total hidden-md-down">
                    <td colspan="3" class="text-xs-right" style="border-bottom: 0">TOTAL</td>
                    <td colspan="2" style="border-bottom: 0">{{ total }} IDR</td>
                </tr>
                <tr class="total hidden-md-up">
                    <td colspan="2" class="text-xs-right">TOTAL</td>
                    <td colspan="2">{{ total }} IDR</td>
                </tr>
            </table>
        </section>
        <section v-else>
            Your cart is empty
        </section>
    </div>
</template>

<script>
import mixin from '../mixins'
import cartHelper from '../helpers/cart'

export default {
    mixins: [mixin, cartHelper]
}
</script>
