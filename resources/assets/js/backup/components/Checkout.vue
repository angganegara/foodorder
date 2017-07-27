<template>
    <div class="checkout container">
        <div class="comp-loading" v-if="loading">
            <div class="el-loading-spinner">
                <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
                <p class="el-loading-text">Loading...</p>
            </div>
        </div>
        <template v-if="finish">
            <div class="page-title">
                <h2>thank you</h2>
            </div>
            <p>Your food order has been submitted successfully.</p>
            <p>Your Avocado Cafe Team</p>
            <p><router-link class="button primary" to="/"><i class="fa fa-fw fa-angle-left"></i> back to home</router-link></p>
            <figure>
                <img src="/images/bg.jpg" alt="" class="responsive">
            </figure>
        </template>
        <template v-else>
            <div class="page-title">
                <h2>checkout</h2>
            </div>
            <div class="info">
                You are almost done<br>
                Please check again all details and fill in your personal data below.
            </div>
            <br>
            <form action="/checkout" method="post" id="form">

                <h4 class="no-pad">PERSONAL DATA</h4>
                <div class="row section">
                    <div class="hidden-md-down col-md-4">
                        <p class="lp">
                            Enter your details here. Fields marked with <span class="required">*</span> are required.
                        </p>
                    </div>
                    <div class="col-xs-6 col-md-4">
                        <fieldset class="form-group">
                            <label for="fname">First name <span class="required">*</span></label>
                            <input type="text" v-validate.initial="form.fname" data-rules="required" data-as="First name"
                            :class="{'form-control': true, 'is-danger': errors.has('form.fname') }" placeholder="First name" v-model="form.fname">
                            <p class="text-danger" v-if="errors.has('form.fname')">{{ errors.first('form.fname') }}</p>
                        </fieldset>
                    </div>
                    <div class="col-xs-6 col-md-4">
                        <fieldset class="form-group">
                            <label for="surname">Surname <span class="required">*</span></label>
                            <input type="text" v-validate.initial="form.lname" data-rules="required" data-as="Surname"
                            :class="{'form-control': true, 'is-danger': errors.has('form.lname') }" placeholder="Surname" v-model="form.lname">
                            <p class="text-danger" v-if="errors.has('form.lname')">{{ errors.first('form.lname') }}</p>
                        </fieldset>
                    </div>
                    <!--
                    <div class="col-xs-12 offset-md-4 col-md-8">
                        <fieldset class="form-group">
                            <label for="address">Address details <span class="required">*</span></label>
                            <textarea v-validate.initial="form.address" data-rules="required" data-as="Address" rows="7"
                            :class="{'form-control': true, 'is-danger': errors.has('form.address') }" placeholder="Please enter your address details" v-model="form.address"></textarea>
                            <p class="text-danger" v-if="errors.has('form.address')">{{ errors.first('form.address') }}</p>
                        </fieldset>
                    </div>-->
                    <div class="col-xs-6 offset-md-4 col-md-4">
                        <fieldset class="form-group">
                            <label for="date">Email address <span class="required">*</span></label>
                            <input type="text" v-validate.initial="form.email" data-rules="required|email" data-as="Email"
                            :class="{'form-control': true, 'is-danger': errors.has('form.email') }" placeholder="Email" v-model="form.email">
                            <p class="text-danger" v-if="errors.has('form.email')">{{ errors.first('form.email') }}</p>
                        </fieldset>
                    </div>
                    <div class="col-xs-6 col-md-4">
                        <fieldset class="form-group">
                            <label for="phone">Phone number <span class="required">*</span></label>
                            <input type="text" v-validate.initial="form.phone" data-rules="required" data-as="Phone number"
                            :class="{'form-control': true, 'is-danger': errors.has('form.phone') }" placeholder="Phone number" v-model="form.phone">
                            <p class="text-danger" v-if="errors.has('form.phone')">{{ errors.first('form.phone') }}</p>
                        </fieldset>
                    </div>
                    <div class="col-xs-6 offset-md-4 col-md-4">
                        <fieldset class="form-group radio-only">
                            <label class="single">Food Intolerances <span class="required">*</span></label>
                            <label for="intolerances-yes">
                                <input id="intolerances-yes" type="radio" v-validate data-rules="required|in:Yes,No" v-model="form.intolerances" name="intolerances" data-as="selection" value="Yes">
                                &nbsp;&nbsp;Yes
                            </label>
                            &nbsp;&nbsp;
                            <label for="intolerances-no">
                                <input id="intolerances-no" type="radio" v-model="form.intolerances" name="intolerances" value="No">&nbsp;&nbsp;No
                            </label>
                            <p class="text-danger" v-if="errors.has('intolerances')">{{ errors.first('intolerances') }}</p>
                            <div v-if="form.intolerances == 'Yes'" class="extra-field">
                                <input type="text" v-validate.initial="form.intolerancesText" data-rules="required" data-as="Field"
                                :class="{'form-control': true, 'is-danger': errors.has('form.intolerancesText') }" placeholder="Please enter" v-model="form.intolerancesText">
                                <p class="text-danger" v-if="errors.has('form.intolerancesText')">{{ errors.first('form.intolerancesText') }}</p>
                            </div>
                        </fieldset>
                    </div>
                    <div class="col-xs-6 col-md-4">
                       <fieldset class="form-group radio-only">
                            <label class="single">Food Allergies <span class="required">*</span></label>
                            <label for="allergies-yes">
                                <input id="allergies-yes" type="radio" v-validate data-rules="required|in:Yes,No" v-model="form.allergies" data-as="selection" name="allergies" value="Yes">
                                &nbsp;&nbsp;Yes
                            </label>
                            &nbsp;&nbsp;
                            <label for="allergies-no">
                                <input id="allergies-no" type="radio" v-model="form.allergies" name="allergies" value="No">&nbsp;&nbsp;No
                            </label>
                            <p class="text-danger" v-if="errors.has('allergies')">{{ errors.first('allergies') }}</p>
                            <div v-if="form.allergies == 'Yes'" class="extra-field">
                                <input type="text" v-validate.initial="form.allergiesText" data-rules="required" data-as="Field"
                                :class="{'form-control': true, 'is-danger': errors.has('form.allergiesText') }" placeholder="Please enter" v-model="form.allergiesText">
                                <p class="text-danger" v-if="errors.has('form.allergiesText')">{{ errors.first('form.allergiesText') }}</p>
                            </div>
                        </fieldset>
                    </div>
                    <div class="col-xs-12 offset-md-4 col-md-8">
                        <fieldset class="form-group">
                            <label for="dislikefood">Food I don't like</label>
                            <input type="text" v-validate.initial="form.dislikefood" data-rules="required" data-as="Field"
                            :class="{'form-control': true, 'is-danger': errors.has('form.dislikefood') }" placeholder="Please enter" v-model="form.dislikefood">
                            <p class="text-danger" v-if="errors.has('form.dislikefood')">{{ errors.first('form.dislikefood') }}</p>
                        </fieldset>
                    </div>
                    <div class="col-xs-12 offset-md-4 col-md-8">
                        <fieldset class="form-group radio-only">
                            <label class="single">Delivery Area</label>
                            <label class="normal">
                                <input type="checkbox" v-model="form.deliveryarea"> &nbsp; My area is not in Canggu, Seminyak or Kuta. I want my food and pay 50,000 IDR delivery fee / day
                            </label>
                        </fieldset>
                    </div>
                </div>

                <h4 class="no-pad">CART OVERVIEW</h4>
                <div class="row section">
                    <div class="hidden-md-down col-md-4">
                        <p class="lp">
                            Review your selected items and press SEND ORDER to proceed.
                        </p>
                    </div>
                    <div class="col-xs-12 col-md-8">
                        <cart :emit="true" :extradelivery="form.deliveryarea"></cart>
                    </div>
                </div>

                <h4 class="no-pad">DELIVERY SCHEDULE</h4>
                <div class="row section">
                    <div class="hidden-md-down col-md-4">
                        <p class="lp">
                            Review your food delivery schedule.
                        </p>
                    </div>
                    <div class="col-xs-12 col-md-8">
                        <schedule></schedule>
                    </div>
                </div>

                <h4 class="no-pad">COMMENTS</h4>
                <div class="row section">
                    <div class="hidden-md-down col-md-4">
                        <p class="lp">
                            Any special request we should be aware of?
                            Feel free to write some comments here.
                        </p>
                    </div>
                    <div class="col-xs-12 col-md-8">
                        <textarea name="comments" class="form-control" rows="10" v-model="form.comments"></textarea>
                    </div>
                </div>
                <!--
                <div class="row section">
                    <div class="col-xs-12 offset-md-4 col-md-8">
                        <p class="text-xs-center text-md-left">
                        <br>
                            <label for="terms">
                                <input type="checkbox" name="terms" id="terms" v-model="form.terms" v-validate data-rules="required" data-as="terms and conditions">
                                &nbsp;
                                I agree to the <a href="javascript:;" class="terms" title="">Terms &amp; Conditions</a>
                            </label>
                        </p>
                        <p class="text-danger" v-show="errors.has('terms')">{{ errors.first('terms') }}</p>
                    </div>
                </div>-->
                <br><br>
                <div class="text-xs-center">
                    <router-link to="/overview" class="button primary big">
                        back to food schedule
                    </router-link>
                    &nbsp;
                    <a href="#" @click.prevent="checkout" class="button yellow big" v-if="this.cartState.length > 0">
                        send order <i class="fa fa-fw fa-angle-right"></i>
                    </a>
                </div>
            </form>
        </template>
    </div>
</template>

<script>
import mixin from '../mixins'
import cart from './Cart.vue'
import schedule from './ScheduleList.vue'

export default {
    name: 'Checkout',
    mixins: [mixin],
    components: { cart, schedule },
    created() {
        this.$Progress.finish()
    },
    methods: {
        checkout() {
            this.loading = true
            this.$validator.validateAll()

            if (this.errors.any()) {
                this.scroll('#form', 750, -140)
                this.loading = false
                return false
            }

            // sudah tidak ada masalah
            if (window.confirm('You are about to send a binding food order. Do you want to submit?')) {
                this.$http.post('/api/send-order', {cart: this.postCart, form: this.form})
                .then((res) => {
                    this.loading = false
                    this.finish = true
                    this.$store.state.cart = []
                    localStorage.setItem('cart', JSON.stringify(this.$store.state.cart))
                    this.scroll('.checkout', 750)
                }).catch((err) => {
                    this.loading = false
                })
            }
            return false
        }
    },
    data () {
        return {
            postCart: {},
            loading: false,
            finish: false,
            form: {
                fname: '',
                lname: '',
                email: '',
                phone: '',
                comments: '',
                terms: false,
                intolerances: '',
                intolerancesText: '',
                allergies: '',
                allergiesText: '',
                dislikefood: '',
                deliveryarea: false
            }
        }
    }
}
</script>
