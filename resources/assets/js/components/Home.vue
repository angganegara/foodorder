<template>
  <section class="home">
    <div class="container intro">
      <div class="inner">
        <agile :infinite="true" :autoplay="true" :speed="750" :dots="false" :fade="true">
          <div class="slide"><img src="/images/slide.jpg"></div>
          <div class="slide"><img src="/images/slide2.jpg"></div>
          <div class="slide"><img src="/images/slide3.jpg"></div>
        </agile>
        <h1 class="intro-title">FITNESS FOOD & MORE</h1>
        <div class="intro-subtitle">
          <p class="intro-big">Clean eating, designed for optimal nutrition delivered to your home or office.</p>
          <p class="intro-big">100% Homemade & Fresh - Whole Foods - Organic - No Refined Sugar.</p>
          <p class="intro-box">All Motion Meals are available as Vegan / Vegetarian / Gluten-Free / Dairy-Free option upon request.</p>
        </div>
      </div>
    </div>
    <div class="container">
      <items/>
      <div class="text-xs-center checkout-box" v-if="cartState.length > 0">
        <router-link to="/overview" class="button yellow big">
          <b>checkout <i class="fa fa-fw fa-angle-right"></i></b>
        </router-link>
      </div>
      <how-it-works level="2" :popup="false"></how-it-works>
    </div>
  </section>
</template>

<script>
import {mapState} from 'vuex'
import Items from './Items.vue'
import HowItWorks from './HowItWorks.vue'
import Cart from './Cart.vue'

export default {
  name: 'Home',
  components: { Items, Cart, HowItWorks },
  data () {
    return {
      dropdown: false
    }
  },
  computed: {
    ...mapState({
      cartState: state => state.cart
    })
  },
  methods: {
    openDropdown() {
      this.dropdown = ! this.dropdown
    }
  }
}
</script>
