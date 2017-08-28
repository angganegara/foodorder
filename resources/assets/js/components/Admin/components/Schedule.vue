<template>
    <div>
        <div class="switcher">
			<h2>Schedule Overview {{ today }}</h2>
			<div class="links">
				<a href="#" @click="change('breakfast')" :class="{ 'active': type == 'breakfast' }">Breakfast</a>
				<a href="#" @click="change('lunch')" :class="{ 'active': type == 'lunch' }">Lunch</a>
				<a href="#" @click="change('dinner')" :class="{ 'active': type == 'dinner' }">Dinner</a>
			</div>
        </div>
        <div class="schedule">
            <table class="sch">
                <tr>
					<th>ID</th>
                    <th width="20%">name</th>
                    <th width="10%">time</th>
                    <th width="15%">menu</th>
                    <th width="45%">address</th>
					<th width="10%"></th>
                </tr>
                <tr v-for="(s,i) in schedule" v-if="s[typeAddress] != ''" :key="i">
					<td>{{ s.id }}</td>
                    <td><router-link :to="`/admin/orders/${s.id}`">{{ s.name }}</router-link></td>
                    <td>{{ s[typeTime] }}</td>
                    <td>{{ s.menu }}</td>
                    <td v-html="s[typeAddress]"></td>
					<td class="text-right"><router-link :to="`/admin/orders/${s.id}`"><i class="fa fa-fw fa-eye"></i> View</router-link></td>
                </tr>
				<tr v-if="schedule.length <= 0">
					<td colspan="6">No schedule for today</td>
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
