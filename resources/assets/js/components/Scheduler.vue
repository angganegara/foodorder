<template>
  <div>
    <section class="overview-cart" v-if="cartState.length > 0">

      <div class="row delivery-section">
        <div class="col-md-3">
          <div class="page-title">
            <h3>delivery info</h3>
          </div>
          <ul>
            <li>Please insert desired delivery address in the fields on the right. We give a choice of 2 different addresses</li>
            <li>get a discount of 100,000 IDR on your weekly menu if you solely choose our pick up stations at Motion Cafe or Motion Studio (fix pick-up times)</li>
            <li>Delivery Times: 07:30 - 20:30, allow a margin of +/- 15 min.</li>
            <li>Delivery Days: Mondays to Saturdays. No delivery service on Sundays</li>
          </ul>
        </div>
        <div class="col-md-3">
          <div class="page-title">
            <h3>Address A</h3>
          </div>
          <textarea v-model="address.address1" class="form-control form-control-sm" rows="12"></textarea>
          <label class="hidden">
            <input type="checkbox" v-model="address.address1_outside"> This address is outside of Canggu, Seminyak, and Kuta
          </label>
        </div>
        <div class="col-md-3">
          <div class="page-title">
            <h3>Address B</h3>
          </div>
          <textarea v-model="address.address2" class="form-control form-control-sm" rows="12"></textarea>
          <label class="hidden">
            <input type="checkbox" v-model="address.address2_outside"> This address is outside of Canggu, Seminyak, and Kuta
          </label>
        </div>
        <div class="col-md-3">
          <div class="page-title">
            <h3>free delivery area</h3>
          </div>
          <div class="map">
            <a class="map-inner" href="javascript:;" @click="openMap()">
              <i class="fa fa-2x fa-search"></i>
              click to enlarge
            </a>
            <img src="/images/map-thumbs.jpg?1" class="responsive">
          </div>
          <div class="outside">
            Need to get your food delivered outside of this area? Please drop us a line to
            <a href="mailto:foodorder@motioncafebali.com">foodorder@motioncafebali.com</a>
          </div>
        </div>
      </div>

      <br>

      <template v-for="(product, i) in cart" v-if="product.qty > 0">
        <div class="delivery" :key="product.id">
          <div class="delivery-title">
            <h2>
              {{ product.name }} {{ product.subname }}
            </h2>
            <span>{{ subtitle(product) }}</span>
          </div>
          <br class="mobile-hide">
          <div class="delivery-title delivery-station">
            <p>Set all pickup location for this meal to: </p>
            <div>
              <label v-if="isWanderlust"><a @click.prevent="selectAll('wanderlust', product.id)" href="#"><i class="fa fa-fw fa-check"></i> Wanderlust Gym</a></label>
              <label v-if="isNirvanaGym"><a @click.prevent="selectAll('nirvana', product.id)" href="#"><i class="fa fa-fw fa-check"></i> Nirvana Strength</a></label>
              &nbsp;&middot;&nbsp;
              <label><a @click.prevent="selectAll('pickup1', product.id)" href="#"><i class="fa fa-fw fa-check"></i> Motion Cafe</a></label>
              &nbsp;&middot;&nbsp;
              <label><a @click.prevent="selectAll('pickup2', product.id)" href="#"><i class="fa fa-fw fa-check"></i> Motion Studio</a></label>

              <template v-if="address.address1">
                &nbsp;&middot;&nbsp;
                <label><a @click.prevent="selectAll('address1', product.id)" href="#"><i class="fa fa-fw fa-check"></i> Address A</a></label>
              </template>
              <template v-if="address.address2">
                &nbsp;&middot;&nbsp;
                <label><a @click.prevent="selectAll('address2', product.id)" href="#"><i class="fa fa-fw fa-check"></i> Address B</a></label>
              </template>
            </div>
          </div>
          <div class="delivery-body">

            <template v-if="product.schedule" v-for="(s, key) in product.schedule">
              <div class="delivery-days" :key="s.id">
                <span>{{ s.date }}</span>
              </div>
              <template>
                <div class="delivery-type" :key="s.id">
                  <div class="cell" v-if="isSpecialDetox(product)">
                    <span>Select your delivery time</span>
                    <span></span>
                    <span>
                      <select @input="updateAllowedTime(i, key, $event)">
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                      </select>
                    </span>
                  </div>
                  <div class="cell" v-if="product.singlemeal.breakfast && product.id != 10 && s.allowed.breakfast">
                    <span>Breakfast :</span>
                    <time-picker v-model="s.breakfast" :product="product.id" :index="key" type="breakfast"></time-picker>
                    <location-picker
                      v-model="s.breakfastLocation"
                      :model="s.breakfastLocation"
                      :addressA="address.address1"
                      :addressB="address.address2"
                      :category="product.category_id"
                      :id="`b-${product.id}`"
                      :itemid="product.id"
                      type="breakfast"
                      :index="key">
                    </location-picker>
                  </div>
                  <div class="cell" v-if="product.singlemeal.lunch && s.allowed.lunch">
                    <span>Lunch :</span>
                    <time-picker v-model="s.lunch" :product="product.id" :index="key" type="lunch"></time-picker>
                    <location-picker
                      v-model="s.lunchLocation"
                      :model="s.lunchLocation"
                      :addressA="address.address1"
                      :addressB="address.address2"
                      :category="product.category_id"
                      :id="`l-${product.id}`"
                      :itemid="product.id"
                      type="lunch"
                      :index="key"
                      :key="`l-${product.id}`">
                    </location-picker>
                  </div>
                  <div class="cell" v-if="product.singlemeal.dinner && s.allowed.dinner">
                    <span>Dinner :</span>
                    <time-picker v-model="s.dinner" :product="product.id" :index="key" type="dinner"></time-picker>
                    <location-picker
                      v-model="s.dinnerLocation"
                      :model="s.dinnerLocation"
                      :addressA="address.address1"
                      :addressB="address.address2"
                      :category="product.category_id"
                      :id="`d-${product.id}`"
                      :itemid="product.id"
                      type="dinner"
                      :index="key">
                    </location-picker>
                  </div>
                </div>
              </template>
            </template>
            <template v-if="product.typeraw == 'weekly' && product.id == 3 && product.easysunday">
              <div class="delivery-days">
                <span>Easy Sunday</span>
              </div>
              <div class="delivery-type">
                <div class="cell">
                  The Easy Sunday food items will be delivered on Saturday, together with your Fit & Slim dishes
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>

    </section>
    <section v-else>
      Your cart is empty
    </section>
  </div>
</template>

<script>
import mixin from '../mixins'
import schedulerHelper from '../helpers/scheduler.js'
import timepicker from './TimePicker.vue'
import locationpicker from './LocationPicker.vue'
var $ = require('jquery')

export default {
  mixins: [mixin, schedulerHelper],
  components: {
    'time-picker': timepicker,
    'location-picker': locationpicker
  },
  computed: {
    domain() {
      return this.$root.domain;
    },
    isWanderlust() {
      return this.domain === 'wanderlust.motionfitnessbali.com';
    },
    isNirvanaGym() {
      return this.domain === 'nirvanagym.motionfitnessbali.com';
    }
  }
}
</script>
