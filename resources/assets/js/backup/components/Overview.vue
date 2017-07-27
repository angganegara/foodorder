<template>
    <div class="overview container">
        <div class="page-title">
            <h2>your personalized delivery schedule</h2>
        </div>
        <scheduler></scheduler>
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
    components: { scheduler },
    mixins: [mixin],
    created() {
        this.$Progress.finish()
    },
    methods: {
        checkSchedule() {
            var missing = 0
            var check = this.$store.state.schedule
            
            check.forEach((index) => {
                index.forEach((schedule) => {
                    if(schedule.location == '') {
                        // blank location
                        missing += 1
                    }
                })
            })

            if (missing > 0) {
                // halt
                alert('Please enter your food delivery schedule')
            } else {
                // boleh la ....
                this.$router.push('/checkout')
            }
        }
    }
}
</script>
