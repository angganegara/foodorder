<template>
    <div class="popup">
        <div class="popup-flex">
            <div class="popup-body">
                <a href="#" @click.prevent="close" class="popup-close"><i class="fa fa-fw fa-times"></i></a>
                <template v-if="product.id == 7 && !selectDetox">
                    <div class="page-title"><h3>select detox</h3></div>
                    <table>
                        <tr>
                            <td width="10%"><input type="radio" v-model="form.detox" name="detox" value="Juice Detox" id="detox-juice"></td>
                            <td width="65%"><label for="detox-juice">Juice Detox</label></td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td><input type="radio" v-model="form.detox" name="detox" value="Soup Detox" id="detox-soup"></td>
                            <td><label for="detox-soup">Soup Detox</label></td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td><input type="radio" v-model="form.detox" name="detox" value="Veggie & Fruit Detox" id="detox-veggie"></td>
                            <td><label for="detox-veggie">Veggie & Fruit Detox</label></td>
                            <td>&nbsp;</td>
                        </tr>
                    </table>
                    <br>
                    <button class="button yellow" @click.prevent="saveDetox(product)" v-if="form.detox">next</button>
                </template>
                <template v-else>
                    <div class="page-title"><h3>select meal options</h3></div>
                    <div v-if="product.id == 7"><b>{{ form.detox }}<b/><br><Br></div>
                    <transition name="fade">
                        <div class="food-info warning" v-if="warning.length > 0" v-html="warning"></div>
                    </transition>
                    <div class="food-info">
                        <p><i class="fa fa-fw fa-lightbulb-o"></i> want to order for more than 1 person? No problem, you can change quantity in the shopping cart</p>
                    </div>
                    <transition name="fade">
                        <div class="food-info" v-if="form.easySunday">
                            <p>The Easy Sunday food items will be delivered on Saturday, together with your Fit & Slim dishes</p>
                        </div>
                    </transition>
                </template>
                <template v-if="(product.id == 7 && selectDetox) || (product.id != 7)">
                    <table>
                        <template v-for="price in product.prices">
                            <tr v-if="! isSingleMeal(price) && price.type != 'sunday'">
                                <td width="10%"><input v-model="form.mealOpt" type="radio" name="meal-opt" :value="price.type" :id="`opt-${price.id}`"></td>
                                <td width="65%"><label :for="`opt-${price.id}`">{{ price.name }}</label></td>
                                <td width="25%">{{ formatNumber(price.price) }} IDR</td>
                            </tr>
                            <tr v-if="product.id == 3 && price.type == 'sunday' && form.mealOpt == 'weekly'">
                                <td><input type="checkbox" name="sunday" id="sundaypackage" v-model="form.easySunday"></td>
                                <td><label for="sundaypackage">Add Easy Sunday</label></td>
                                <td>+ {{ formatNumber(price.price) }} IDR</td>
                            </tr>
                        </template>
                        <tr v-if="product.id == 3">
                            <td><input type="radio" name="meal-opt" v-model="form.mealOpt" value="singlemeal" id="opt-singlemeal"></td>
                            <td><label for="opt-singlemeal">Single Meal</label></td>
                            <td>110,000 IDR</td>
                        </tr>
                        <template v-if="form.mealOpt == 'singlemeal'" v-for="price in product.prices">
                            <tr v-if="isSingleMeal(price)">
                                <td width="10%">
                                    <input
                                        v-model="form.singleMealOpt[price.type]"
                                        type="checkbox"
                                        :name="price.type"
                                        :id="`opt-${price.id}`"
                                        @click="addSingleMeal(price.type)"
                                    >
                                </td>
                                <td width="65%"><label :for="`opt-${price.id}`">{{ price.name }}</label></td>
                                <td width="25%">{{ formatNumber(price.price) }} IDR</td>
                            </tr>
                        </template>
                    </table>
                    <div v-if="form.mealOpt.length > 0">
                        <br>
                        <template v-if="form.mealOpt == 'fullday' || form.mealOpt == 'singlemeal'">
                            <div class="page-title"><h3>Number of days</h3></div>
                            <select v-model="form.numberOfDays" :value="form.numberOfDays" class="form-control-sm form-control">
                                <option value="1">1 day</option>
                                <option value="2">2 days</option>
                                <option value="3">3 days</option>
                                <option value="4">4 days</option>
                                <option value="5">5 days</option>
                                <option value="6">6 days</option>
                            </select>
                            <br>
                            <div class="food-info"><p>Please understand that we can deliver daily menus on consecutive days only</p></div>
                            <br>
                        </template>
                        <div class="page-title"><h3>delivery starting date</h3></div>
                        <template v-if="form.mealOpt == 'weekly' || form.mealOpt == 'sunday'">
                            <select v-model="form.deliveryDates" class="form-control-sm form-control block">
                                <option value="">Select date</option>
                                <option v-for="date in weeklyDates" :value="date" :selected="weeklyDates.date1 == date ? 'true' : 'false'">{{ date }}</option>
                            </select>
                            <br>
                        </template>
                        <template v-else>
                            <input type="text" v-model="form.deliveryDates" class="date-ui form-control-sm form-control" data-language="en" placeholder="click to select date" readonly>
                            <br>
                            <div class="food-info"><p>Please note that you need to order 24hrs in advance to ensure the best quality and service. The last possible order for the following week must be place before 17:00 on Saturdays.</p></div>
                            <br>
                        </template>
                        <div class="page-title" v-if="form.mealOpt != 'sunday'"><h3>delivery times</h3></div>
                        <table>
                            <tr v-if="form.mealOpt == 'weekly' || form.mealOpt == 'fullday' || form.singleMealOpt.breakfast">
                                <td width="1%">&nbsp;</td>
                                <td width="34%">Breakfast time:</td>
                                <td width="65%">
                                    <time-picker v-model="form.breakfast_times"></time-picker>
                                </td>
                            </tr>
                            <tr v-if="form.mealOpt == 'weekly' || form.mealOpt == 'fullday' || form.singleMealOpt.lunch">
                                <td width="1%">&nbsp;</td>
                                <td width="34%">Lunch time:</td>
                                <td width="65%">
                                    <time-picker v-model="form.lunchdinner_times"></time-picker>
                                </td>
                            </tr>
                            <tr v-if="form.mealOpt == 'weekly' || form.mealOpt == 'fullday' || form.singleMealOpt.dinner">
                                <td width="1%">&nbsp;</td>
                                <td width="34%">Dinner time:</td>
                                <td width="65%">
                                    <time-picker v-model="form.dinner_times"></time-picker>
                                </td>
                            </tr>
                        </table>
                        <br>
                        <div style="display: flex; justify-content: space-between">
                            <button class="button primary" @click.prevent="previousDetox()" v-show="product.id == 7">select detox</button>
                            <button class="button yellow" @click.prevent="addItem(product)">save</button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import mixin from '../mixins'
import moment from 'moment'
import TimePicker from './TimePicker.vue'
var $ = require('jquery')

export default {
    mixins: [mixin],
    components: {
        'time-picker': TimePicker
    },
    props: ['popup'],
    watch: {
        popup: function () {
            // if popup is closing, reset the data
            if ( ! this.popup ) {
                setTimeout(() => {
                    this.form.mealOpt = false
                    this.form.easySunday = false
                    this.form.numberOfDays = 1
                    this.form.detox = ''
                    this.selectDetox = false
                }, 500)
            }
        },
        'form.mealOpt': function () {
            // reset deliveryDates
            this.warning = ''
            this.form.deliveryDates = ''

            if (this.form.mealOpt == 'fullday' || this.form.mealOpt == 'singlemeal') {
                this.$nextTick(() => {
                    $(document).ready(($) => {
                        var disabledDays = [0];
                        var today = new Date()
                        today.setDate(today.getDate() + 2)
                        this.datepicker = $('.date-ui').datepicker({
                            minDate: today,
                            autoClose: true,
                            onRenderCell: function (date, cellType) {
                                if (cellType == 'day') {
                                    var day = date.getDay(),
                                        isDisabled = disabledDays.indexOf(day) != -1;
                                    return {
                                        disabled: isDisabled
                                    }
                                }
                            },
                            onSelect: (formattedDate, date, inst) => {
                                this.form.deliveryDates = moment(date).format('dddd, DD MMM YYYY')
                            }
                        })
                    })
                })
            }

            if (this.form.mealOpt == 'sunday') {
                // if sunday, generate 3 sundays dates
                this.generateDate(0)
            }

            if (this.form.mealOpt == 'weekly') {
                // if sunday, generate 3 sundays dates
                this.generateDate(1)
            }
        } // end watch form.mealopt
    },
    created () {
        // set default to monday
        this.generateDate(1)
    },
    computed: {
        totalSingleMeal () {
            return _.size(_.keys(_.pickBy(this.form.singleMealOpt)))
        }
    },
    methods: {
        saveDetox(product) {
            this.selectDetox = true
            this.$store.dispatch('setActiveDetox', this.form.detox)
        },
        previousDetox() {
            this.selectDetox = false
        },
        generateDate(dateIndex) {
            // dateIndex : 0 - sunday, 1 - monday, 2 - tuesday and so on
            var today = moment()
            var date1 = moment().day(dateIndex)
            if (today.valueOf() >= date1.valueOf()) {
                dateIndex += 7
            }
            date1 = moment().day(dateIndex)
            var date2 = moment().day(dateIndex + 7)   // +1 week
            var date3 = moment().day(dateIndex + 14)  // +2 weeks
            this.weeklyDates = {
                date1: date1.format('dddd, DD MMM YYYY'),
                date2: date2.format('dddd, DD MMM YYYY'),
                date3: date3.format('dddd, DD MMM YYYY')
            }
        },
        addSingleMeal (key) {
            setTimeout(() => {
                var check = _.get(this.form.singleMealOpt, key)
                if (this.totalSingleMeal > 2) {
                    // already 2, set to false to cancel
                    this.form.singleMealOpt[key] = false
                    // show error
                    this.warning = '<i class="fa fa-fw fa-times"></i> You can only select two single meal options.'
                    setTimeout(() => {
                        this.warning = ''
                    }, 5000)
                }
            }, 0)
        },
        checkSingleMeal () {
            return false
        },
        isSingleMeal(price) {
            return price.type == 'breakfast' || price.type == 'lunch' || price.type == 'dinner'
        },
        close () {
            this.$store.state.popup = false
        },
        formatNumber (price) {
            return numeral(price).format('0,0')
        },
        addItem(product) {
            var error = '';
            if (this.form.deliveryDates == '' && this.form.mealOpt != 'singlemeal') {
                error += `<i class="fa fa-fw fa-times"></i> Select your delivery starting date`
            }
            if (this.form.deliveryDates == '' && this.form.mealOpt == 'singlemeal') {
                error += `<i class="fa fa-fw fa-times"></i> Select your delivery starting date other`
            }
            if (this.form.mealOpt == 'singlemeal') {
                if (this.totalSingleMeal < 1) {
                    error += error.length > 0 ? `<br>` : ''
                    error += `<i class="fa fa-fw fa-times"></i> Select 1 or more single meal`
                }
            }
            if (error.length > 0) {
                this.warning = error
                return false;
            }

            this.warning = ''

            var newObject = {
                id: product.id,
                meal: this.form.mealOpt,
                singleMeal: {
                    breakfast: this.form.singleMealOpt.breakfast,
                    lunch: this.form.singleMealOpt.lunch,
                    dinner: this.form.singleMealOpt.dinner
                },
                deliverydates: {
                    date: this.form.deliveryDates,
                    breakfast_times: this.form.breakfast_times,
                    lunchdinner_times: this.form.lunchdinner_times,
                    dinner_times: this.form.dinner_times
                },
                easySunday: this.form.easySunday,
                totalDays: this.form.numberOfDays,
                detox: this.form.detox,
                qty: 1
            }

            this.$store.dispatch('addItem', newObject)
            this.$root.itemAdded = true
            setTimeout(() => {
                this.$root.itemAdded = false
                var cartBtn = $('.cart-title')
                var parent = cartBtn.parent()
                setTimeout(() => {
                    parent.addClass('hovered')
                    setTimeout(() => {
                        parent.removeClass('hovered')
                    }, 4000)
                }, 100)
            }, 100)
            //$('.cart-btn').addClass('hovered')
        }
    },
    data () {
        return {
            datepicker: {},
            weeklyDates: {},
            warning: '',
            selectDetox: false,
            form: {
                mealOpt: false,
                singleMealOpt: {
                    breakfast: false,
                    lunch: false,
                    dinner: false
                },
                numberOfDays: 1,
                easySunday: false,
                deliveryDates: '',
                breakfast_times: '07:30',
                lunchdinner_times: '13:00',
                dinner_times: '19:00',
                checked: 'checked',
                detox: ''
            }
        }
    }
}
</script>
<style>
.cov-vue-date {
    display: block !important
}
</style>
