webpackJsonp([1],{

/***/ "./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Food.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mixins = __webpack_require__("./resources/assets/js/mixins.js");

var _mixins2 = _interopRequireDefault(_mixins);

var _Detox = __webpack_require__("./resources/assets/js/components/Food/Detox.vue");

var _Detox2 = _interopRequireDefault(_Detox);

var _FitSlim = __webpack_require__("./resources/assets/js/components/Food/FitSlim.vue");

var _FitSlim2 = _interopRequireDefault(_FitSlim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    mixins: [_mixins2.default],
    components: { 'detox-page': _Detox2.default, 'fit-slim': _FitSlim2.default },
    name: 'Food',
    data: function data() {
        return {
            slug: this.$route.params.slug,
            id: this.$route.params.id,
            data: {},
            loading: true,
            date: new Date('Y-m-d')
        };
    },
    created: function created() {
        this.$http.get('/api/foods/' + this.id).then(function (res) {
            this.data = res.body;
            this.$Progress.finish();
            this.loading = false;
        });
    },

    methods: {
        formatPrice: function formatPrice(price) {
            return numeral(price).format('0,0');
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

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Food/Detox.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
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

exports.default = {
    name: 'food-detox',
    props: ['data'],
    methods: {
        formatPrice: function formatPrice(price) {
            return numeral(price).format('0,0');
        }
    }
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Food/FitSlim.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
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

var marked = __webpack_require__("./resources/assets/js/plugins/marked.js");
exports.default = {
	name: 'fit-slim',
	props: ['data'],
	data: function data() {
		return {
			menus: {}
		};
	},

	methods: {
		formatPrice: function formatPrice(price) {
			return numeral(price).format('0,0');
		},
		markdown: function markdown(string) {
			return marked(string, { sanitize: true });
		}
	},
	created: function created() {
		var _this = this;

		this.$http.get('/api/menus').then(function (res) {
			_this.menus = res.body;
		});
	}
};

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-602cc510\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Food.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "food-page container"
  }, [(_vm.loading) ? _c('div', {
    staticClass: "comp-loading"
  }, [_c('div', {
    staticClass: "el-loading-spinner"
  }, [_c('svg', {
    staticClass: "circular",
    attrs: {
      "viewBox": "25 25 50 50"
    }
  }, [_c('circle', {
    staticClass: "path",
    attrs: {
      "cx": "50",
      "cy": "50",
      "r": "20",
      "fill": "none"
    }
  })]), _vm._v(" "), _c('p', {
    staticClass: "el-loading-text"
  }, [_vm._v("Loading...")])])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "page-title"
  }, [_c('h2', [_vm._v("Menu details")]), _vm._v(" "), _c('div', {
    staticClass: "page-buttons"
  }, [_c('router-link', {
    staticClass: "button no-border",
    attrs: {
      "to": "/"
    }
  }, [_c('i', {
    staticClass: "fa fa-fw fa-angle-left"
  }), _vm._v(" back\n            ")]), _vm._v(" "), (!_vm.isAdded) ? _c('button', {
    staticClass: "button primary",
    on: {
      "click": function($event) {
        _vm.showPopup(_vm.data)
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-fw fa-plus"
  }), _vm._v(" add to cart\n            ")]) : _c('button', {
    staticClass: "button primary"
  }, [_c('i', {
    staticClass: "fa fa-fw fa-check"
  }), _vm._v(" already in cart\n            ")])], 1)]), _vm._v(" "), (this.id != 3) ? [_c('div', {
    staticClass: "food-wrap"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-xs-12 col-md-8 flex"
  }, [_c('div', {
    staticClass: "food-description food-text"
  }, [_c('h4', {
    staticClass: "food-name"
  }, [_vm._v(_vm._s(_vm.data.name))]), _vm._v(" "), _c('div', {
    domProps: {
      "innerHTML": _vm._s(_vm.data.description)
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-12 col-md-4 flex"
  }, [_c('div', {
    staticClass: "food-price food-text"
  }, [_vm._l((_vm.data.prices), function(price) {
    return [_c('div', {
      staticClass: "flex food-title"
    }, [_c('h5', [_vm._v(_vm._s(price.name))]), _vm._v(" "), _c('p', {
      staticClass: "price"
    }, [_vm._v(_vm._s(_vm.formatPrice(price.price)) + " IDR")])]), _vm._v(" "), (price.description) ? [_c('p', {
      staticClass: "desc"
    }, [_vm._v(_vm._s(price.description))])] : _vm._e(), _vm._v(" "), _c('hr')]
  }), _vm._v(" "), _c('p', [_vm._v("All prices include tax, service and delivery to Kuta/Seminyak/Canggu area.")]), _vm._v(" "), _c('p', [_vm._v("Delivery surcharge of 50,000 IDR/day applies for other areas (e.g. Sanur, Bukit, Ubud, Nusa Dua)")]), _vm._v(" "), _c('p', [_vm._v("All payments must be done on the first day of delivery.")]), _vm._v(" "), _c('p', [_vm._v("Payment options: cash to driver upon nota receipt, PayPal, bank transfer")])], 2)])]), _vm._v(" "), (_vm.data.id == 3) ? _c('div', {
    staticClass: "row"
  }, [_vm._m(0)]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [(_vm.data.id == 3) ? _vm._l((_vm.menus), function(menu) {
    return _c('div', {
      staticClass: "col-xs food-menus"
    }, [_c('div', {
      staticClass: "food-menu food-text"
    }, [_c('h4', [_vm._v(_vm._s(menu.day))]), _vm._v(" "), _c('div', {
      domProps: {
        "innerHTML": _vm._s(menu.content)
      }
    })])])
  }) : _vm._e(), _vm._v(" "), _c('br'), _vm._v(" "), _vm._l((_vm.data.pictures), function(file) {
    return [_c('div', {
      staticClass: "col-xs food-menus"
    }, [_c('figure', [_c('img', {
      attrs: {
        "src": ("/images/foods/" + file),
        "alt": ""
      }
    })])])]
  })], 2)])] : _vm._e(), _vm._v(" "), (this.id == 3) ? [_c('fit-slim', {
    attrs: {
      "data": _vm.data
    }
  })] : _vm._e(), _vm._v(" "), _c('br'), _vm._v(" "), _c('div', {
    staticClass: "page-title"
  }, [_c('router-link', {
    staticClass: "button yellow big",
    attrs: {
      "to": "/overview"
    }
  }, [_vm._v("\n            checkout "), _c('i', {
    staticClass: "fa fa-fw fa-angle-right"
  })]), _vm._v(" "), _c('div', {
    staticClass: "page-buttons"
  }, [_c('router-link', {
    staticClass: "button no-border",
    attrs: {
      "to": "/"
    }
  }, [_c('i', {
    staticClass: "fa fa-fw fa-angle-left"
  }), _vm._v(" back\n            ")]), _vm._v(" "), (!_vm.isAdded) ? _c('button', {
    staticClass: "button primary",
    on: {
      "click": function($event) {
        _vm.showPopup(_vm.data)
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-fw fa-plus"
  }), _vm._v(" add to cart\n            ")]) : _c('button', {
    staticClass: "button primary"
  }, [_c('i', {
    staticClass: "fa fa-fw fa-check"
  }), _vm._v(" already in cart\n            ")])], 1)], 1)], 2)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col-xs-12"
  }, [_c('div', {
    staticClass: "page-subtitle"
  }, [_c('h2', [_vm._v("fit&slim weekly menu")])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-602cc510", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-679acadd\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Food/Detox.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "food-wrap"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-xs-12 col-md-8 flex"
  }, [_c('div', {
    staticClass: "food-detox"
  }, [_c('h4', {
    staticClass: "food-name"
  }, [_vm._v("Juice Detox")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col-xs-12 col-md-6"
  }, [_c('figure', [_c('img', {
    attrs: {
      "src": ("/images/foods/" + (_vm.data.id) + "_1.jpg"),
      "alt": ""
    }
  })])])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('h4', {
    staticClass: "food-name"
  }, [_vm._v("Soup Detox")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "col-xs-12 col-md-6"
  }, [_c('figure', [_c('img', {
    attrs: {
      "src": ("/images/foods/" + (_vm.data.id) + "_3.jpg"),
      "alt": ""
    }
  })])])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('h4', {
    staticClass: "food-name"
  }, [_vm._v("VEGGIE & FRUIT DETOX")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "col-xs-12 col-md-6"
  }, [_c('figure', [_c('img', {
    attrs: {
      "src": ("/images/foods/" + (_vm.data.id) + "_5.jpg"),
      "alt": ""
    }
  })])])])])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-12 col-md-4 flex"
  }, [_c('div', {
    staticClass: "food-price food-text",
    staticStyle: {
      "align-self": "flex-start"
    }
  }, [_vm._l((_vm.data.prices), function(price) {
    return [_c('div', {
      staticClass: "flex food-title"
    }, [_c('h5', [_vm._v(_vm._s(price.name))]), _vm._v(" "), _c('p', {
      staticClass: "price"
    }, [_vm._v(_vm._s(_vm.formatPrice(price.price)) + " IDR")])]), _vm._v(" "), (price.description) ? [_c('p', {
      staticClass: "desc"
    }, [_vm._v(_vm._s(price.description))])] : _vm._e(), _vm._v(" "), _c('hr')]
  }), _vm._v(" "), _c('p', [_vm._v("All prices include tax, service and delivery to Kuta/Seminyak/Canggu area.")]), _vm._v(" "), _c('p', [_vm._v("Delivery surcharge of 50,000 IDR/day applies for other areas (e.g. Sanur, Bukit, Ubud, Nusa Dua)")]), _vm._v(" "), _c('p', [_vm._v("All payments must be done on the first day of delivery.")]), _vm._v(" "), _c('p', [_vm._v("Payment options: cash to driver upon nota receipt, PayPal, bank transfer")])], 2)])]), _vm._v(" "), (_vm.data.id == 3) ? _c('div', {
    staticClass: "row"
  }, [_vm._m(3)]) : _vm._e()])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col-xs-12 col-md-6"
  }, [_c('p', [_vm._v("Our juice detox involves the short-term intake of raw vegetable and fruit juices, Coconut water, turmeric boost, herbal tea and water.")]), _vm._v(" "), _c('p', [_vm._v("A juice fast is considered an extreme form of detoxification because no solid food is consumed. There should be a gradual start into this detox and then a return to solid foods.")]), _vm._v(" "), _c('p', [_c('b', [_vm._v("CONTENT")])]), _vm._v(" "), _c('p', [_vm._v("2 bottles freshly blended raw veggie&fruit juices, 1 bottle Turmeric Boost, 1 bottle coconut water, 2 herbal tea bags, 1x Epsom salts."), _c('br'), _vm._v("You will receive your daily package every morning.")]), _vm._v(" "), _c('p', [_c('b', [_vm._v("TARGET")])]), _vm._v(" "), _c('p', [_vm._v("The benefit of juicing is that it gives your digestion system a break from working so hard to process a large meal therefore your body can work rapidly on detoxification. This leads to feeling joyful and light, and keeping slim and radiant.")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col-xs-12 col-md-6"
  }, [_c('p', [_vm._v("The Soup Detox is based only on vegetables. These two tasty soups are freshly cooked and rounded off with spices that support your digestion. They are rich in minerals and vitamins to keep you nourished and healthy.")]), _vm._v(" "), _c('p', [_c('b', [_vm._v("CONTENT")])]), _vm._v(" "), _c('p', [_vm._v("For one day: 1 coconut water for breakfast, 2 veggie soups for lunch and dinner, 2 blended vegetable soups as snacks between breakfast/lunch and lunch/dinner and1x Epsom salts. You will get the whole amount for 6 days on the beginning day of your detox.")]), _vm._v(" "), _c('p', [_c('b', [_vm._v("TARGET")])]), _vm._v(" "), _c('p', [_vm._v("The purpose of following a six-day Soup Detox is to affect a rapid weight-loss by consuming mainly vegetable soup on each day of your diet. This method detoxifies your body naturally and makes you feel lighter and balanced.")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col-xs-12 col-md-6"
  }, [_c('p', [_vm._v("The Veggie & Fruit Detox is our lightest version of all detox methods."), _c('br'), _vm._v("\nThis delicious plant-based menu will help you to get rid of the toxins in your body, feeling more energized and slim down.")]), _vm._v(" "), _c('p', [_c('b', [_vm._v("CONTENT")])]), _vm._v(" "), _c('p', [_vm._v("This 6-day menu includes breakfast, lunch and dinner as well as 2 snacks in form of a drink as an extra energy kick in between the meals plus 1x Epsom salts. All meals are freshly cooked right before delivery and contain only high-quality ingredients.")]), _vm._v(" "), _c('p', [_c('b', [_vm._v("TARGET")])]), _vm._v(" "), _c('p', [_vm._v("This diet with the high intake of veggies & fruits helps your body to detox naturally. At the same time, you resorb all the vitamins and minerals from the fresh veggies and fruits.")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col-xs-12"
  }, [_c('div', {
    staticClass: "page-subtitle"
  }, [_c('h2', [_vm._v("fit&slim weekly menu")])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-679acadd", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-73a6234f\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Food/FitSlim.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "food-wrap"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-xs-12"
  }, [_c('div', {
    staticClass: "page-subtitle first"
  }, [_c('h2', [_vm._v(_vm._s(_vm.data.name) + " " + _vm._s(_vm.data.subname))])])])]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-xs-12 col-md-6 col-lg-8"
  }, [_c('div', {
    staticClass: "row fit"
  }, _vm._l((_vm.menus), function(menu) {
    return _c('div', {
      staticClass: "col-xs food-menus"
    }, [_c('div', {
      staticClass: "food-menu food-text"
    }, [_c('h4', [_vm._v(_vm._s(menu.day))]), _vm._v(" "), _c('div', {
      domProps: {
        "innerHTML": _vm._s(_vm.markdown(menu.content))
      }
    })])])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-12 col-md-6 col-lg-4"
  }, [_c('div', {
    staticClass: "food-price food-text"
  }, [_vm._l((_vm.data.prices), function(price) {
    return [_c('div', {
      staticClass: "flex food-title"
    }, [_c('h5', [_vm._v(_vm._s(price.name))]), _vm._v(" "), _c('p', {
      staticClass: "price"
    }, [_vm._v(_vm._s(_vm.formatPrice(price.price)) + " IDR")])]), _vm._v(" "), (price.description) ? [_c('p', {
      staticClass: "desc"
    }, [_vm._v(_vm._s(price.description))])] : _vm._e(), _vm._v(" "), _c('hr')]
  }), _vm._v(" "), _c('p', [_vm._v("All prices include tax, service and delivery to Kuta/Seminyak/Canggu area.")]), _vm._v(" "), _c('p', [_vm._v("Delivery surcharge of 50,000 IDR/day applies for other areas (e.g. Sanur, Bukit, Ubud, Nusa Dua)")]), _vm._v(" "), _c('p', [_vm._v("All payments must be done on the first day of delivery.")]), _vm._v(" "), _c('p', [_vm._v("Payment options: cash to driver upon nota receipt, PayPal, bank transfer")])], 2), _vm._v(" "), _c('div', {
    staticClass: "fitslim-pic"
  }, [_c('figure', [_c('img', {
    attrs: {
      "src": ("/images/foods/" + (_vm.data.id) + "_1.jpg"),
      "alt": ""
    }
  })])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-73a6234f", module.exports)
  }
}

/***/ }),

/***/ "./resources/assets/js/components/Food.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Food.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-602cc510\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Food.vue"),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/excalibur/Omega/food/resources/assets/js/components/Food.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Food.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-602cc510", Component.options)
  } else {
    hotAPI.reload("data-v-602cc510", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./resources/assets/js/components/Food/Detox.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Food/Detox.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-679acadd\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Food/Detox.vue"),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/excalibur/Omega/food/resources/assets/js/components/Food/Detox.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Detox.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-679acadd", Component.options)
  } else {
    hotAPI.reload("data-v-679acadd", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./resources/assets/js/components/Food/FitSlim.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Food/FitSlim.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-73a6234f\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Food/FitSlim.vue"),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/excalibur/Omega/food/resources/assets/js/components/Food/FitSlim.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] FitSlim.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-73a6234f", Component.options)
  } else {
    hotAPI.reload("data-v-73a6234f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});