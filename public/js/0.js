webpackJsonp([0],{

/***/ "./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/LocationPicker.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mixins = __webpack_require__("./resources/assets/js/mixins.js");

var _mixins2 = _interopRequireDefault(_mixins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    name: 'LocationPicker',
    props: ['id', 'index', 'addressA', 'addressB', 'value', 'model', 'itemid', 'type', 'category'],
    mixins: [_mixins2.default],
    data: function data() {
        return {
            mc: this.model
        };
    },

    computed: {
        modelComp: function modelComp() {
            return this.model;
        }
    },
    watch: {
        modelComp: function modelComp(val, old) {
            var schedule = this.schedule,
                itemid = this.itemid,
                index = this.index,
                type = this.type,
                time = '';
            if (schedule[itemid] != undefined) {
                if (val == 'pickup1' || val == 'pickup2') {
                    if (type == 'breakfast') {
                        time = '07:30';
                    } else if (type == 'lunch') {
                        time = '13:00';
                    } else {
                        time = '17:30';
                    }
                    schedule[itemid][index][type] = time;
                }
            }
        }
    },
    methods: {
        update: function update(type) {
            var value = '';
            switch (type) {
                case 'a':
                    value = 'pickup1';
                    break;
                case 'b':
                    value = 'pickup2';
                    break;
                case 'c':
                    value = 'address1';
                    break;
                case 'd':
                    value = 'address2';
                    break;
                case 'e':
                    value = 'wanderlust';
                    break;
            }
            this.$emit('input', value);
        }
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Overview.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Scheduler = __webpack_require__("./resources/assets/js/components/Scheduler.vue");

var _Scheduler2 = _interopRequireDefault(_Scheduler);

var _mixins = __webpack_require__("./resources/assets/js/mixins.js");

var _mixins2 = _interopRequireDefault(_mixins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    name: 'Overview',
    props: ['cart'],
    components: { scheduler: _Scheduler2.default },
    mixins: [_mixins2.default],
    created: function created() {
        this.$Progress.finish();
        // sync address here?
    },

    methods: {
        checkSchedule: function checkSchedule() {
            var missing = 0;
            var check = this.schedule;
            var cartState = this.cartState;

            check.forEach(function (index, i) {
                if (index != null) {
                    missing = 0;
                    index.forEach(function (schedule) {
                        var delivery = _.find(cartState, ['id', schedule.itemid]);

                        if (delivery.meal != 'singlemeal') {
                            if (delivery.id != 7 && delivery.id != 15 && delivery.id != 19 && delivery.id != 20) {
                                // rules for all items but detox
                                if (schedule.breakfastLocation == '' && delivery.id != 10 || schedule.lunchLocation == '' || schedule.dinnerLocation == '') {
                                    missing += 1;
                                }
                            } else {
                                // rules for detox
                                if (schedule.allowed.breakfast && schedule.breakfastLocation == '') {
                                    missing += 1;
                                }
                                if (schedule.allowed.lunch && schedule.lunchLocation == '') {
                                    missing += 1;
                                }
                                if (schedule.allowed.dinner && schedule.dinnerLocation == '') {
                                    missing += 1;
                                }
                            }
                        } else {
                            if (delivery.singleMeal.breakfast && schedule.breakfastLocation == '') {
                                missing += 1;
                            }
                            if (delivery.singleMeal.lunch && schedule.lunchLocation == '') {
                                missing += 1;
                            }
                            if (delivery.singleMeal.dinner && schedule.dinnerLocation == '') {
                                missing += 1;
                            }
                        }
                    });
                } else {
                    missing += 1;
                }
            });

            if (missing > 0) {
                alert('Please complete your food delivery schedule');
            } else {
                this.$router.push('/checkout');
            }
        }
    }
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Scheduler.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mixins = __webpack_require__("./resources/assets/js/mixins.js");

var _mixins2 = _interopRequireDefault(_mixins);

var _scheduler = __webpack_require__("./resources/assets/js/helpers/scheduler.js");

var _scheduler2 = _interopRequireDefault(_scheduler);

var _TimePicker = __webpack_require__("./resources/assets/js/components/TimePicker.vue");

var _TimePicker2 = _interopRequireDefault(_TimePicker);

var _LocationPicker = __webpack_require__("./resources/assets/js/components/LocationPicker.vue");

var _LocationPicker2 = _interopRequireDefault(_LocationPicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var $ = __webpack_require__("./node_modules/jquery/dist/jquery.js");

exports.default = {
    mixins: [_mixins2.default, _scheduler2.default],
    components: {
        'time-picker': _TimePicker2.default,
        'location-picker': _LocationPicker2.default
    }
};

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-35f12e55\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/LocationPicker.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', [_c('label', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.mc),
      expression: "mc"
    }],
    attrs: {
      "type": "radio",
      "name": ("location-" + _vm.id + "-" + _vm.index),
      "value": "pickup1"
    },
    domProps: {
      "checked": _vm._q(_vm.mc, "pickup1")
    },
    on: {
      "click": function($event) {
        _vm.update('a')
      },
      "__c": function($event) {
        _vm.mc = "pickup1"
      }
    }
  }), _vm._v("\n            Motion Cafe\n        ")]), _vm._v("\n         · \n        "), (this.category != 6) ? _c('label', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.mc),
      expression: "mc"
    }],
    attrs: {
      "type": "radio",
      "name": ("location-" + _vm.id + "-" + _vm.index),
      "value": "pickup2"
    },
    domProps: {
      "checked": _vm._q(_vm.mc, "pickup2")
    },
    on: {
      "click": function($event) {
        _vm.update('b')
      },
      "__c": function($event) {
        _vm.mc = "pickup2"
      }
    }
  }), _vm._v("\n            Motion Studio\n        ")]) : _c('label', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.mc),
      expression: "mc"
    }],
    attrs: {
      "type": "radio",
      "name": ("location-" + _vm.id + "-" + _vm.index),
      "value": "wanderlust"
    },
    domProps: {
      "checked": _vm._q(_vm.mc, "wanderlust")
    },
    on: {
      "click": function($event) {
        _vm.update('e')
      },
      "__c": function($event) {
        _vm.mc = "wanderlust"
      }
    }
  }), _vm._v("\n            Wanderlust Gym\n\t\t")]), _vm._v(" "), (this.address.address1 != undefined && this.address.address1.length > 0) ? [_vm._v("\n             · \n            "), _c('label', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.mc),
      expression: "mc"
    }],
    attrs: {
      "type": "radio",
      "name": ("location-" + _vm.id + "-" + _vm.index),
      "value": "address1"
    },
    domProps: {
      "checked": _vm._q(_vm.mc, "address1")
    },
    on: {
      "click": function($event) {
        _vm.update('c')
      },
      "__c": function($event) {
        _vm.mc = "address1"
      }
    }
  }), _vm._v("\n                Address A\n            ")])] : _vm._e(), _vm._v(" "), (this.address.address2 != undefined && this.address.address2.length > 0) ? [_vm._v("\n             · \n            "), _c('label', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.mc),
      expression: "mc"
    }],
    attrs: {
      "type": "radio",
      "name": ("location-" + _vm.id + "-" + _vm.index),
      "value": "address2"
    },
    domProps: {
      "checked": _vm._q(_vm.mc, "address2")
    },
    on: {
      "click": function($event) {
        _vm.update('d')
      },
      "__c": function($event) {
        _vm.mc = "address2"
      }
    }
  }), _vm._v("\n                Address B\n            ")])] : _vm._e()], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-35f12e55", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-66f94e0e\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Scheduler.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.cartState.length > 0) ? _c('section', {
    staticClass: "overview-cart"
  }, [_c('div', {
    staticClass: "row delivery-section"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col-md-3"
  }, [_vm._m(1), _vm._v(" "), _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.address.address1),
      expression: "address.address1"
    }],
    staticClass: "form-control form-control-sm",
    attrs: {
      "rows": "12"
    },
    domProps: {
      "value": (_vm.address.address1)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.address.address1 = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    staticClass: "hidden"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.address.address1_outside),
      expression: "address.address1_outside"
    }],
    attrs: {
      "type": "checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.address.address1_outside) ? _vm._i(_vm.address.address1_outside, null) > -1 : (_vm.address.address1_outside)
    },
    on: {
      "__c": function($event) {
        var $$a = _vm.address.address1_outside,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.address.address1_outside = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.address.address1_outside = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.address.address1_outside = $$c
        }
      }
    }
  }), _vm._v(" This address is outside of Canggu, Seminyak, and Kuta\n                    ")])]), _vm._v(" "), _c('div', {
    staticClass: "col-md-3"
  }, [_vm._m(2), _vm._v(" "), _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.address.address2),
      expression: "address.address2"
    }],
    staticClass: "form-control form-control-sm",
    attrs: {
      "rows": "12"
    },
    domProps: {
      "value": (_vm.address.address2)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.address.address2 = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    staticClass: "hidden"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.address.address2_outside),
      expression: "address.address2_outside"
    }],
    attrs: {
      "type": "checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.address.address2_outside) ? _vm._i(_vm.address.address2_outside, null) > -1 : (_vm.address.address2_outside)
    },
    on: {
      "__c": function($event) {
        var $$a = _vm.address.address2_outside,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.address.address2_outside = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.address.address2_outside = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.address.address2_outside = $$c
        }
      }
    }
  }), _vm._v(" This address is outside of Canggu, Seminyak, and Kuta\n                    ")])]), _vm._v(" "), _c('div', {
    staticClass: "col-md-3"
  }, [_vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "map"
  }, [_c('a', {
    staticClass: "map-inner",
    attrs: {
      "href": "javascript:;"
    },
    on: {
      "click": function($event) {
        _vm.openMap()
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-2x fa-search"
  }), _vm._v("\n                            click to enlarge\n                        ")]), _vm._v(" "), _c('img', {
    staticClass: "responsive",
    attrs: {
      "src": "/images/map-thumbs.jpg?1"
    }
  })]), _vm._v(" "), _vm._m(4)])]), _vm._v(" "), _c('br'), _vm._v(" "), _vm._l((_vm.cart), function(product, i) {
    return (product.qty > 0) ? [_c('div', {
      staticClass: "delivery"
    }, [_c('div', {
      staticClass: "delivery-title"
    }, [_c('h2', [_vm._v("\n                            " + _vm._s(product.name) + " " + _vm._s(product.subname) + "\n                            "), (product.typeraw == 'fullday' || product.typeraw == 'singlemeal') ? _c('span', [_vm._v("for " + _vm._s(product.totaldays) + " day(s)")]) : _vm._e()]), _vm._v(" "), _c('span', [_vm._v(_vm._s(product.type))])]), _vm._v(" "), _c('div', {
      staticClass: "delivery-body"
    }, [_vm._l((product.schedule), function(s, key) {
      return (product.schedule) ? [_c('div', {
        staticClass: "delivery-days"
      }, [_c('span', [_vm._v(_vm._s(s.date))])]), _vm._v(" "), [_c('div', {
        staticClass: "delivery-type"
      }, [(_vm.isSpecialDetox(product)) ? _c('div', {
        staticClass: "cell"
      }, [_c('span', [_vm._v("Select your delivery time")]), _vm._v(" "), _c('span'), _vm._v(" "), _c('span', [_c('select', {
        on: {
          "input": function($event) {
            _vm.updateAllowedTime(i, key, $event)
          }
        }
      }, [_c('option', {
        attrs: {
          "value": "breakfast"
        }
      }, [_vm._v("Breakfast")]), _vm._v(" "), _c('option', {
        attrs: {
          "value": "lunch"
        }
      }, [_vm._v("Lunch")]), _vm._v(" "), _c('option', {
        attrs: {
          "value": "dinner"
        }
      }, [_vm._v("Dinner")])])])]) : _vm._e(), _vm._v(" "), (product.singlemeal.breakfast && product.id != 10 && s.allowed.breakfast) ? _c('div', {
        staticClass: "cell"
      }, [_c('span', [_vm._v("Breakfast :")]), _vm._v(" "), _c('time-picker', {
        attrs: {
          "product": product.id,
          "index": key,
          "type": "breakfast"
        },
        model: {
          value: (s.breakfast),
          callback: function($$v) {
            s.breakfast = $$v
          },
          expression: "s.breakfast"
        }
      }), _vm._v(" "), _c('location-picker', {
        attrs: {
          "model": s.breakfastLocation,
          "addressA": _vm.address.address1,
          "addressB": _vm.address.address2,
          "category": product.category_id,
          "id": ("b-" + (product.id)),
          "itemid": product.id,
          "type": "breakfast",
          "index": key
        },
        model: {
          value: (s.breakfastLocation),
          callback: function($$v) {
            s.breakfastLocation = $$v
          },
          expression: "s.breakfastLocation"
        }
      })], 1) : _vm._e(), _vm._v(" "), (product.singlemeal.lunch && s.allowed.lunch) ? _c('div', {
        staticClass: "cell"
      }, [_c('span', [_vm._v("Lunch :")]), _vm._v(" "), _c('time-picker', {
        attrs: {
          "product": product.id,
          "index": key,
          "type": "lunch"
        },
        model: {
          value: (s.lunch),
          callback: function($$v) {
            s.lunch = $$v
          },
          expression: "s.lunch"
        }
      }), _vm._v(" "), _c('location-picker', {
        attrs: {
          "model": s.lunchLocation,
          "addressA": _vm.address.address1,
          "addressB": _vm.address.address2,
          "category": product.category_id,
          "id": ("l-" + (product.id)),
          "itemid": product.id,
          "type": "lunch",
          "index": key
        },
        model: {
          value: (s.lunchLocation),
          callback: function($$v) {
            s.lunchLocation = $$v
          },
          expression: "s.lunchLocation"
        }
      })], 1) : _vm._e(), _vm._v(" "), (product.singlemeal.dinner && s.allowed.dinner) ? _c('div', {
        staticClass: "cell"
      }, [_c('span', [_vm._v("Dinner :")]), _vm._v(" "), _c('time-picker', {
        attrs: {
          "product": product.id,
          "index": key,
          "type": "dinner"
        },
        model: {
          value: (s.dinner),
          callback: function($$v) {
            s.dinner = $$v
          },
          expression: "s.dinner"
        }
      }), _vm._v(" "), _c('location-picker', {
        attrs: {
          "model": s.dinnerLocation,
          "addressA": _vm.address.address1,
          "addressB": _vm.address.address2,
          "category": product.category_id,
          "id": ("d-" + (product.id)),
          "itemid": product.id,
          "type": "dinner",
          "index": key
        },
        model: {
          value: (s.dinnerLocation),
          callback: function($$v) {
            s.dinnerLocation = $$v
          },
          expression: "s.dinnerLocation"
        }
      })], 1) : _vm._e()])]] : _vm._e()
    }), _vm._v(" "), (product.typeraw == 'weekly' && product.id == 3 && product.easysunday) ? [_vm._m(5, true), _vm._v(" "), _vm._m(6, true)] : _vm._e()], 2)])] : _vm._e()
  })], 2) : _c('section', [_vm._v("\n            Your cart is empty\n        ")])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col-md-3"
  }, [_c('div', {
    staticClass: "page-title"
  }, [_c('h3', [_vm._v("delivery info")])]), _vm._v(" "), _c('ul', [_c('li', [_vm._v("Please insert desired delivery address in the fields on the right. We give a choice of 2 different addresses")]), _vm._v(" "), _c('li', [_vm._v("get a discount of 100,000 IDR on your weekly menu if you solely choose our pick up stations at Avocado Cafe or Motion Studio (fix pick-up times)")]), _vm._v(" "), _c('li', [_vm._v("Delivery Times: 07:30 - 21:45, allow a margin of +/- 15 min.")]), _vm._v(" "), _c('li', [_vm._v("Delivery Days: Mondays to Saturdays. No delivery service on Sundays")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "page-title"
  }, [_c('h3', [_vm._v("Address A")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "page-title"
  }, [_c('h3', [_vm._v("Address B")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "page-title"
  }, [_c('h3', [_vm._v("free delivery area")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "outside"
  }, [_vm._v("\n                        Need to get your food delivered outside of this area? Please drop us a line to\n                        "), _c('a', {
    attrs: {
      "href": "mailto:foodorder@avocadocafebali.com"
    }
  }, [_vm._v("foodorder@avocadocafebali.com")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "delivery-days"
  }, [_c('span', [_vm._v("Easy Sunday")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "delivery-type"
  }, [_c('div', {
    staticClass: "cell"
  }, [_vm._v("\n                                    The Easy Sunday food items will be delivered on Saturday, together with your Fit & Slim dishes\n                                ")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-66f94e0e", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-ce24f8aa\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Overview.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "overview container"
  }, [_vm._m(0), _vm._v(" "), _c('scheduler', {
    attrs: {
      "cart": _vm.cart
    }
  }), _vm._v(" "), _c('br'), _vm._v(" "), _c('div', {
    staticClass: "text-xs-center"
  }, [_c('router-link', {
    staticClass: "button primary big",
    attrs: {
      "to": "/"
    }
  }, [_vm._v("\n            back\n        ")]), _vm._v("\n         \n        "), (this.cartState.length > 0) ? _c('button', {
    staticClass: "button yellow big",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.checkSchedule()
      }
    }
  }, [_vm._v("\n            continue "), _c('i', {
    staticClass: "fa fa-fw fa-angle-right"
  })]) : _vm._e()], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "page-title"
  }, [_c('h2', [_vm._v("your personalized delivery schedule")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ce24f8aa", module.exports)
  }
}

/***/ }),

/***/ "./resources/assets/js/components/LocationPicker.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/LocationPicker.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-35f12e55\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/LocationPicker.vue"),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/excalibur/Omega/food/resources/assets/js/components/LocationPicker.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] LocationPicker.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-35f12e55", Component.options)
  } else {
    hotAPI.reload("data-v-35f12e55", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./resources/assets/js/components/Overview.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Overview.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-ce24f8aa\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Overview.vue"),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/excalibur/Omega/food/resources/assets/js/components/Overview.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Overview.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ce24f8aa", Component.options)
  } else {
    hotAPI.reload("data-v-ce24f8aa", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./resources/assets/js/components/Scheduler.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Scheduler.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-66f94e0e\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Scheduler.vue"),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/excalibur/Omega/food/resources/assets/js/components/Scheduler.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Scheduler.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-66f94e0e", Component.options)
  } else {
    hotAPI.reload("data-v-66f94e0e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./resources/assets/js/helpers/scheduler.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _moment = __webpack_require__("./node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    name: 'Scheduler',
    props: ['cart'],
    watch: {
        cart: {
            handler: _.debounce(function (val, old) {
                this.scheduledata = val;
                this.$store.dispatch('syncSchedule', val);
            }, 1000),
            deep: true
        },
        'address.address1': {
            handler: _.debounce(function (val, old) {
                if (val == '') {
                    this.removeAddress('address1');
                }
                this.$store.dispatch('syncAddress', {
                    address1: val,
                    address1_outside: this.address.address1_outside,
                    address2: this.address.address2,
                    address2_outside: this.address.address2_outside
                });
            }, 1000)
        },
        'address.address2': {
            handler: _.debounce(function (val, old) {
                if (val == '') {
                    this.removeAddress('address2');
                }
                this.$store.dispatch('syncAddress', {
                    address1: this.address.address1,
                    address1_outside: this.address.address1_outside,
                    address2: val,
                    address2_outside: this.address.address2_outside
                });
            }, 1000)
        },
        'address.address1_outside': {
            handler: function handler(val, old) {
                this.$store.dispatch('syncAddress', {
                    address1: this.address.address1,
                    address1_outside: val,
                    address2: this.address.address2,
                    address2_outside: this.address.address2_outside
                });
            }
        },
        'address.address2_outside': {
            handler: function handler(val, old) {
                this.$store.dispatch('syncAddress', {
                    address1: this.address.address1,
                    address1_outside: this.address.address1_outside,
                    address2: this.address.address2,
                    address2_outside: val
                });
            }
        }
    },
    created: function created() {
        // we tell root that this comp is ready
        bus.$emit('schedulerReady');
        // load saved schedule
        this.$store.dispatch('loadSchedule');
        // load saved address
        this.$store.dispatch('loadAddress');
    },

    methods: {
        erase: function erase(model, i, key) {
            this.cart[i].schedule[key].location = '';
            return true;
        },
        openMap: function openMap() {
            this.$parent.$parent.popupMap = true;
        },
        updateAllowedTime: function updateAllowedTime(cart, schedule, e) {
            var val = e.target.value;
            var pointer = this.cart[cart].schedule[schedule];
            pointer.allowed.breakfast = false;
            pointer.breakfastLocation = '';
            pointer.allowed.lunch = false;
            pointer.lunchLocation = '';
            pointer.allowed.dinner = false;
            pointer.dinnerLocation = '';
            pointer.allowed[val] = true;
        },
        removeAddress: function removeAddress(type) {
            var start = 1;
            this.cart.forEach(function (data) {
                var s = data.schedule;
                s.forEach(function (day) {

                    day.breakfastLocation = day.breakfastLocation != 'pickup1' && day.breakfastLocation != 'pickup2' && day.breakfastLocation == type ? '' : day.breakfastLocation;

                    day.lunchLocation = day.lunchLocation != 'pickup1' && day.lunchLocation != 'pickup2' && day.lunchLocation == type ? '' : day.lunchLocation;

                    day.dinnerLocation = day.dinnerLocation != 'pickup1' && day.dinnerLocation != 'pickup2' && day.dinnerLocation == type ? '' : day.dinnerLocation;
                });
            });
        }
    }
};

/***/ })

});