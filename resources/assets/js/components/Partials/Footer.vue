<template>
    <section v-if="!this.$root.isAdmin">
        <div class="footer-wrap">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-5 text-xs-center text-md-left">
                        <p><strong>MOTION CAFE</strong></p>
                        <p>
                            Jl. Raya Batu Bolong 69B, Canggu, Bali
                            <br>Phone Cafe: <a href="tel:+628113999411">+62 811 3999 411</a>
                            <br>Phone Meal Plans: <a href="tel:+6281337629983">+62 813 3762 9983</a> (Mon - Sat 08:00 - 17:00)
                            <br>Email Meal Plans: <a href="mailto:foodorder@motionfitnessbali.com">foodorder@motionfitnessbali.com</a>
                            <br><a href="http://cafe.motionfitnessbali.com" title="" target="_blank">http://cafe.motionfitnessbali.com</a>
                        </p>
                        <p class="social">
                            <a href="https://www.facebook.com/motioncafebali" title=""><i class="fa fa-fw fa-2x fa-facebook"></i></a>
                            <a href="http://instagram.com/avocadocafebali" title=""><i class="fa fa-fw fa-2x fa-instagram"></i></a>
                            &nbsp;
                            <a href="http://www.tripadvisor.com/Restaurant_Review-g311298-d6903656-Reviews-Avocado_Cafe-Canggu_Bali.html" title="">
                                <i class="fa fa-fw fa-2x fa-tripadvisor"></i>
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