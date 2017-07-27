<template>
    <span>
        <select :value="time.hours" v-on:input="updateHour">
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
        </select>
        <select :value="time.minutes" v-on:input="updateMinute">
            <option value="00">00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
        </select>
    </span>
</template>

<script>
export default {
    props: ['value'],
    data () {
        return {
            time: {
                hours: this.hours,
                minutes: this.minutes
            }
        }
    },
    created () {
        this.time.hours = this.hours
        this.time.minutes = this.minutes
    },
    methods: {
        updateHour (e) {
            if (e.target.value == "07" && (this.time.minutes == "00" || this.time.minutes == "15")) {
                this.time.minutes = "30"
            }
            this.time.hours = e.target.value
            this.$emit('input', e.target.value +':'+ this.time.minutes)
        },
        updateMinute (e) {
            if (this.time.hours == "07" && (e.target.value == "00" || e.target.value == "15")) {
                e.target.value = "30"
            }
            this.time.minutes = e.target.value
            this.$emit('input', this.time.hours +':'+ e.target.value)
        }
    },
    computed: {
        hours () {
            return this.value.split(':')[0]
        },
        minutes () {
            return this.value.split(':')[1]
        }
    }
}
</script>
