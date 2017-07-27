<template>
    <div>
        <h2>Schedule Overview {{ today }}</h2>
        <div class="switcher">
            <a href="#" @click="change('breakfast')" :class="{ 'active': type == 'breakfast' }">Breakfast</a>
            <a href="#" @click="change('lunch')" :class="{ 'active': type == 'lunch' }">Lunch</a>
            <a href="#" @click="change('dinner')" :class="{ 'active': type == 'dinner' }">Dinner</a>
        </div>
        <div class="schedule">
            <table class="sch">
                <tr>
                    <th width="3%">ID</th>
                    <th width="12%">name</th>
                    <th width="5%">time</th>
                    <th width="15%">menu</th>
                    <th width="20%">address</th>
                    <th width="15%">allergies</th>
                    <th width="15%">avoid</th>
                    <th width="15%">dislike</th>
                </tr>
                <tr v-for="(s,i) in schedule" v-if="s[typeAddress] != ''">
                    <td>{{ s.id }}</td>
                    <td><router-link :to="`/admin/orders/${s.id}`">{{ s.name }}</router></td>
                    <td>{{ s[typeTime] }}</td>
                    <td>{{ s.menu }}</td>
                    <td v-html="s[typeAddress]"></td>
                    <td>{{ s.allergies == '' ? '-' : s.allergies }}</td>
                    <td>{{ s.intolerance == '' ? '-' : s.intolerance }}</td>
                    <td>{{ s.dislike == '' ? '-' : s.dislike }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    data() {
        return {
            schedule: [],
            type: 'breakfast',
            loading: true
        }
    },
    computed: {
        today() {
            return moment().format('dddd, DD MMM YYYY')
        },
        typeAddress() {
            return this.type +'_address'
        },
        typeTime() {
            return this.type +'_time'
        }
    },
    mounted() {
        this.fetchSchedule();
    },
    methods: {
        change(type) {
            this.type = type
        },
        fetchSchedule() {
            this.$http.get('/api/admin/schedule').then((res) => {
                this.schedule = res.body
            })
        }
    }
}
</script>
