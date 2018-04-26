<template>
  <span>
    <label v-if="isWanderlust">
      <input type="radio" :name="`location-${id}-${index}`" v-model="mc" value="wanderlust" @click="update('e')">
      Wanderlust Gym
    </label>
    <label v-if="isNirvanaGym">
      <input type="radio" :name="`location-${id}-${index}`" v-model="mc" value="nirvana" @click="update('f')">
      Nirvana Strength
    </label>
    &nbsp;&middot;&nbsp;
    <label v-if="!isWanderlist && !isNirvanaGym">
      <input type="radio" :name="`location-${id}-${index}`" v-model="mc" value="f45" @click="update('g')">
      F45 Bali
    </label>
    &nbsp;&middot;&nbsp;
    <label>
      <input type="radio" :name="`location-${id}-${index}`" v-model="mc" value="pickup1" @click="update('a')">
      Motion Cafe
    </label>
    &nbsp;&middot;&nbsp;
    <label>
      <input type="radio" :name="`location-${id}-${index}`" v-model="mc" value="pickup2" @click="update('b')">
      Motion Studio
    </label>
    <template v-if="this.address.address1 != undefined && this.address.address1.length > 0">
      &nbsp;&middot;&nbsp;
      <label>
        <input type="radio" :name="`location-${id}-${index}`" v-model="mc" value="address1" @click="update('c')">
        Address A
      </label>
    </template>
    <template v-if="this.address.address2 != undefined && this.address.address2.length > 0">
      &nbsp;&middot;&nbsp;
      <label>
        <input type="radio" :name="`location-${id}-${index}`" v-model="mc" value="address2" @click="update('d')">
        Address B
      </label>
    </template>

  </span>
</template>

<script>
import mixin from '../mixins.js'
export default {
  name: 'LocationPicker',
  props: ['id', 'index', 'addressA', 'addressB', 'value', 'model', 'itemid', 'type', 'category'],
  mixins: [mixin],
  created() {
    bus.$on('updateLocation', ({location, id}) => {
      if (this.itemid == id) {
        this.mc = location
        this.$emit('input', location)
      }
    })
  },
  data() {
    return {
      mc: this.model
    }
  },
  computed: {
    modelComp() {
      return this.model;
    },
    domain() {
      return this.$root.domain;
    },
    isWanderlust() {
      return this.domain === 'wanderlust.motionfitnessbali.com';
    },
    isNirvanaGym() {
      return this.domain === 'nirvanagym.motionfitnessbali.com';
    }
  },
  watch: {
    modelComp: function(val, old) {
      var schedule = this.schedule,
        itemid   = this.itemid,
        index    = this.index,
        type     = this.type,
        time     = ''
      if (schedule[itemid] != undefined) {
        if (val == 'pickup1' || val == 'pickup2') {
          if (type == 'breakfast') {
            time = '07:30'
          } else if (type == 'lunch') {
            time = '13:00'
          } else {
            time = '17:30'
          }
          schedule[itemid][index][type] = time

        }
      }
    }
  },
  methods: {
    update(type) {
      let value = ''
      switch (type) {
        case 'a':
          value = 'pickup1'
        break
        case 'b':
          value = 'pickup2'
        break
        case 'c':
          value = 'address1'
        break
        case 'd':
          value = 'address2'
        break
        case 'e':
          value = 'wanderlust'
        break
        case 'f':
          value = 'nirvanagym';
        break;
        case 'g':
          value = 'f45';
        break;
      }
      this.$emit('input', value)
    }
  }
}
</script>
