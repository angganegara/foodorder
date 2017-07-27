<template>
    <section v-if="!this.$root.isAdmin">
        <div class="footer-wrap">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-5 text-xs-center text-md-left">
                        <p><strong>AVOCADO CAFE BALI</strong></p>
                        <p>
                            Jl. Raya Batu Bolong 69B, Canggu, Bali
                            <br>Phone/WhatsApp: <a href="tel:+6281246479668">+62 812 4647 9668</a> (Mon - Sat 08:00 - 17:00)
                            <br><a href="mailto:foodorder@avocadocafebali.com">foodorder@avocadocafebali.com</a>
                            <br><a href="http://www.avocadocafebali.com" title="" target="_blank">http://www.avocadocafebali.com</a>
                        </p>
                        <p class="social">
                            <a href="https://www.facebook.com/avocadocafebali" title=""><img src="/images/icons/fb.png" alt="Facebook"></a>
                            <a href="http://instagram.com/avocadocafebali" title=""><img src="/images/icons/in.png" alt="Instagram"></a>
                            <a href="http://www.tripadvisor.com/Restaurant_Review-g311298-d6903656-Reviews-Avocado_Cafe-Canggu_Bali.html" title="">
                                <img src="/images/icons/trip.png" alt="Trip advisor">
                            </a>
                        </p>
                    </div>
                    <div class="col-xs-12 col-md-7 text-xs-center text-md-right">
                        <p><strong>PAYMENT INFORMATION</strong></p>
                        <p>
                            All prices include tax, service and delivery to Kuta/Seminyak/Canggu area.<br>
                            Delivery surcharge of 50,000 IDR/day applies for other areas (e.g. Sanur, Bukit, Ubud, Nusa Dua)<br>
                            All payments must be done on the first day of delivery.<br>
                            Payment options: cash to driver upon nota receipt, PayPal, bank transfer 
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'app-footer'
}
</script>