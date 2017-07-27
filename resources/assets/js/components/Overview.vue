<template>
    <div class="overview container">
        <div class="page-title">
            <h2>your personalized delivery schedule</h2>
        </div>
        <scheduler :cart="cart"></scheduler>
        <br>
        <div class="text-xs-center">
            <router-link to="/" class="button primary big">
                back
            </router-link>
            &nbsp;
            <button class="button yellow big" v-if="this.cartState.length > 0" @click.prevent="checkSchedule()">
                continue <i class="fa fa-fw fa-angle-right"></i>
            </button>
        </div>
    </div>
</template>

<script>
import scheduler from './Scheduler.vue'
import mixin from '../mixins'

export default {
    name: 'Overview',
    props: ['cart'],
    components: { scheduler },
    mixins: [mixin],
    created() {
        this.$Progress.finish()
        // sync address here?
    },
    methods: {
        checkSchedule() {
            var missing = 0
            var check = this.schedule
            var cartState = this.cartState

            check.forEach((index, i) => {
                if (index != null) {
                    missing = 0
                    index.forEach((schedule) => {
                        let delivery = _.find(cartState, ['id', schedule.itemid])

                        if (delivery.meal != 'singlemeal') {
                            if (delivery.id != 7 && delivery.id != 15 && delivery.id != 19 && delivery.id != 20) {
                                // rules for all items but detox
                                if((schedule.breakfastLocation == '' &&  delivery.id != 10)
                                    || schedule.lunchLocation == ''
                                    || schedule.dinnerLocation == '') {
                                    missing += 1
                                }
                            } else {
                                // rules for detox
                                if (schedule.allowed.breakfast && schedule.breakfastLocation == '') {
                                    missing += 1
                                }
                                if (schedule.allowed.lunch && schedule.lunchLocation == '') {
                                    missing += 1
                                }
                                if (schedule.allowed.dinner && schedule.dinnerLocation == '') {
                                    missing += 1
                                }
                            }

                        } else {
                            if(delivery.singleMeal.breakfast && schedule.breakfastLocation == '') {
                                missing += 1
                            }
                            if(delivery.singleMeal.lunch && schedule.lunchLocation == '') {
                                missing += 1
                            }
                            if(delivery.singleMeal.dinner && schedule.dinnerLocation == '') {
                                missing += 1
                            }
                        }
                    })
                } else {
                    missing += 1
                }
            })

            if (missing > 0) {
                alert('Please complete your food delivery schedule')
            } else {
                this.$router.push('/checkout')
            }
        }
    }
}
</script>
