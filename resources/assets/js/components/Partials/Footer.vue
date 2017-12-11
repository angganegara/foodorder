<template>
    <section v-if="!this.$root.isAdmin">
        <div class="footer-wrap">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-5 text-xs-center text-md-left">
                        <p><strong>CONTACT MOTION MEALS</strong></p>
                        <p>
                            <br>Phone/WA: <a href="tel:+6282144252606">+62 821 4425 2606</a> (Mon. - Fri. 08:00 - 17:00)
                            <br>Email: <a href="mailto:foodorder@motionfitnessbali.com">foodorder@motionfitnessbali.com</a>
                            <br>
                            <router-link to="/terms-and-conditions#privacy">Privacy Policy</router-link> &middot;
                            <router-link to="/terms-and-conditions#terms">Terms and Conditions</router-link>
                        </p>
                    </div>
                    <div class="col-xs-12 col-md-7 text-xs-center text-md-right">
                        <p><img src="/images/M.jpg" alt=""></p>
                        <p class="social">
                            <a href="https://www.facebook.com/motioncafebali" title=""><i class="fa fa-fw fa-2x fa-facebook"></i></a>
                            <a href="http://instagram.com/avocadocafebali" title=""><i class="fa fa-fw fa-2x fa-instagram"></i></a>
                            &nbsp;
                            <a href="http://www.tripadvisor.com/Restaurant_Review-g311298-d6903656-Reviews-Avocado_Cafe-Canggu_Bali.html" title="">
                                <i class="fa fa-fw fa-2x fa-tripadvisor"></i>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
  name: "app-footer"
};
</script>
