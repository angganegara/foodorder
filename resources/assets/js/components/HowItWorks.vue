<template>
    <div class="hiw">
        <a v-if="popup" class="hiw-close" @click="closePopup()" href="javascript:"><i class="fa fa-fw fa-times"></i></a>
        <h2>HOW IT WORKS</h2>
        <div class="box">
            <h3>Order Info</h3>
            <ul>
                <li>Order must be placed 24hrs in advance</li>
                <li>We are closed on Sundays</li>
                <li>Latest order for Monday until Friday midnight</li>
                <li>Weekly package = 6 days of food (Sundays closed)</li>
                <li>Use our pick-up stations and safe money (weekly package only)</li>
                <li>Office times for possible queries: Mon. - Fri. 08:00 - 17:00</li>
            </ul>
        </div>
        <div class="box">
            <h3>Delivery Info</h3>
            <ul>
                <li>Choose up to 2 different delivery addresses</li>
                <li>Change of delivery address: minimum 24hrs in advance</li>
                <li>Delivery days: Monday to Saturday</li>
                <li>Delivery times: 07:30 to 20:30</li>
                <li>Allow time margin <b>+/-</b> 15 min. (you know how Bali traffic is ;-)</li>
                <li>Green Bali: pls return all our re-usable glasses/bottles to our drivers</li>
            </ul>
        </div>
        <div class="box">
            <h3>Payment Info</h3>
            <ul>
                <li>Free delivery to Kuta/Seminyak/Canggu area (<a href="javascript:" @click.prevent="openMap()">see map</a>)</li>
                <li>Delivery surcharge of 50,000 IDR/day for other areas (e.g. Sanur/Ubud/Bukit)</li>
                <li>Cash payment: on first day of delivery to driver upon acceptance</li>
                <li>Online payment: by bank transfer / credit card / Paypal</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HowItWorks',
    props: ['level', 'popup'],
    methods: {
        openMap() {
            this.level == '1' ? this.$parent.popupMap = true : this.$parent.$parent.popupMap = true
        },
        closePopup() {
            this.$parent.popupHIW = false
        }
    }
}
</script>
