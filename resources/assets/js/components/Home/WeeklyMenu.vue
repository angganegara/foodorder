<<template>
	<div class="food-wrapper">
		<div class="page-title"><h2>WEEKLY MENU</h2></div>
        <div class="row items fitslim">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 item-thumbs flex">
                <router-link :to="'/'+ fitslim.slug +'/'+ fitslim.id" class="figure diet-info">
                    <div class="item-meta">
                        <span class="item-name">
                            {{ fitslim.name }}
                        </span>
                        <span class="item-price">
                            {{ format(fitslim.weeklyprice) }} IDR / week
                        </span>
                    </div>
                    <img :src="'/images/foods/thumb_'+ fitslim.id +'.jpg?'+ date" :alt="fitslim.name" class="product-picture">
                </router-link>

                <div class="item-short-desc" v-html="fitslim.short_description"></div>
                <div class="item-buttons">
                    <router-link :to="'/'+ fitslim.slug +'/'+ fitslim.id" class="btn diet-info btn-sm btn-motion">
                        <i class="fa fa-fw fa-eye"></i> <span>DETAILS</span>
                    </router-link>
                    <a href="javascript:;" @click="showPopup(fitslim)" v-if="! isAdded(fitslim.id)" title="" class="btn-diet btn btn-sm btn-info pull-right">
                        <i class="fa fa-fw fa-plus"></i> <span>ADD TO CART</span>
                    </a>
                    <a href="javascript:;" class="btn-diet btn btn-sm btn-success pull-right" @click="removeItem(fitslim)" v-else>
                        <i class="fa fa-fw fa-check"></i> <span>ADDED</span>
                    </a>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-9">
                <div class="fitslim-description">
                    <h4>{{ fitslim.name }} {{ fitslim.subname }}</h4>
                    <div v-html="fitslim.description"></div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
import mixin from '../../mixins'
let date = new Date()

export default {
	name: 'WeeklyMenu',
	mixins: [mixin],

	data() {
		return {
			fitslim: {},
			date: date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString()
		}
	},

	created() {
		this.$http.get('/api/foods/3').then((res) => {
            this.fitslim = res.body
        })
	}
}
</script>