webpackJsonp([5],{

/***/ "./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Checkout.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mixins = __webpack_require__("./resources/assets/js/mixins.js");

var _mixins2 = _interopRequireDefault(_mixins);

var _Cart = __webpack_require__("./resources/assets/js/components/Cart.vue");

var _Cart2 = _interopRequireDefault(_Cart);

var _ScheduleList = __webpack_require__("./resources/assets/js/components/ScheduleList.vue");

var _ScheduleList2 = _interopRequireDefault(_ScheduleList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	name: 'Checkout',
	mixins: [_mixins2.default],
	components: { cart: _Cart2.default, schedule: _ScheduleList2.default },
	props: ['cart'],
	created: function created() {
		this.$Progress.finish();
	},

	methods: {
		checkout: function checkout() {
			var _this = this;

			this.loading = true;
			this.$validator.validateAll();

			if (this.errors.any()) {
				this.scroll('#form', 750, -140);
				this.loading = false;
				return false;
			}

			// sudah tidak ada masalah
			if (window.confirm('You are about to send a binding food order. Do you want to submit?')) {
				this.$http.post('/api/send-order', { cart: this.cart, form: this.form, schedule: this.schedule, address: this.address }).then(function (res) {
					_this.loading = false;
					_this.finish = true;
					_this.$store.state.cart = [];
					_this.$store.state.schedule = [];
					_this.$store.state.address = {
						address1: '',
						address1_outside: false,
						address2: '',
						address2_outside: false
					};
					localStorage.removeItem('cart', '');
					localStorage.removeItem('schedule', '');
					localStorage.setItem('address', JSON.stringify(_this.$store.state.address));
					_this.scroll('.checkout', 750);
				}).catch(function (err) {
					_this.loading = false;
					_this.error = true;
					_this.scroll('.checkout', 750);
				});
			} else {
				this.loading = false;
			}
			return false;
		}
	},
	data: function data() {
		return {
			loading: false,
			finish: false,
			error: false,
			form: {
				fname: '',
				lname: '',
				email: '',
				phone: '',
				comments: '',
				terms: false,
				intolerances: '',
				intolerancesText: '',
				allergies: '',
				allergiesText: '',
				dislikefood: '',
				deliveryprice: 0,
				totaldays: 0,
				discount: 0
			}
		};
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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

/***/ "./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/ScheduleList.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mixins = __webpack_require__("./resources/assets/js/mixins.js");

var _mixins2 = _interopRequireDefault(_mixins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	name: 'ScheduleList',
	mixins: [_mixins2.default],
	props: ['cart'],
	created: function created() {
		this.$store.dispatch('loadSchedule').then(function () {
			// tell Cart to calculate discount now that we got the schedule
			bus.$emit('scheduleIsReady');
		});
		this.$store.dispatch('loadAddress');
	},

	methods: {
		getLocation: function getLocation(type) {
			if (type != 'pickup1' && type != 'pickup2' && type != 'wanderlust') {
				var outside = type + '_outside';
				var extra = '';
				if (this.address[outside]) {
					extra = '<br><span class="extra"><i class="fa fa-fw fa-bus"></i> extra delivery</span>';
				}
				return this.address[type] + extra;
			} else {
				return type == 'pickup1' ? 'Motion Cafe' : type == 'wanderlust' ? 'Wanderlust Gym' : 'Motion Studio';
			}
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

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-296dff07\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/ScheduleList.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._l((_vm.cart), function(product, i) {
    return (product) ? [_c('div', {
      staticClass: "delivery-compact"
    }, [_c('div', {
      staticClass: "delivery-title"
    }, [_c('h2', [_vm._v("\n\t\t\t\t\t" + _vm._s(product.name) + " " + _vm._s(product.subname) + "\n\t\t\t\t\t"), (product.typeraw == 'fullday' || product.typeraw == 'singlemeal') ? _c('span', [_vm._v("for " + _vm._s(product.totaldays) + " day(s)")]) : _vm._e()]), _vm._v(" "), _c('span', {
      staticClass: "delivery-type"
    }, [_vm._v(_vm._s(product.type))])]), _vm._v(" "), _c('div', {
      staticClass: "delivery-body"
    }, [_c('table', {
      staticClass: "table-schedule",
      attrs: {
        "width": "100%"
      }
    }, [_vm._l((_vm.schedule[product.id]), function(s) {
      return [_c('tr', {
        staticClass: "day"
      }, [_c('td', {
        attrs: {
          "colspan": "2"
        }
      }, [_c('b', [_vm._v(_vm._s(s.date))])])]), _vm._v(" "), (s.breakfastLocation != '') ? _c('tr', [_c('td', {
        staticClass: "type",
        attrs: {
          "width": "65%"
        }
      }, [_c('div', {
        staticClass: "type"
      }, [_vm._v("Breakfast")]), _vm._v(" "), _c('div', {
        domProps: {
          "innerHTML": _vm._s(_vm.getLocation(s.breakfastLocation))
        }
      })]), _vm._v(" "), _c('td', {
        staticClass: "text-xs-right",
        attrs: {
          "width": "10%"
        }
      }, [_vm._v("\n\t\t\t\t\t\t\t\t" + _vm._s(s.breakfast) + "\n\t\t\t\t\t\t\t")])]) : _vm._e(), _vm._v(" "), (s.lunchLocation != '') ? _c('tr', [_c('td', {
        staticClass: "type",
        attrs: {
          "width": "65%"
        }
      }, [_c('div', {
        staticClass: "type"
      }, [_vm._v("Lunch")]), _vm._v(" "), _c('div', {
        domProps: {
          "innerHTML": _vm._s(_vm.getLocation(s.lunchLocation))
        }
      })]), _vm._v(" "), _c('td', {
        staticClass: "text-xs-right",
        attrs: {
          "width": "10%"
        }
      }, [_vm._v("\n\t\t\t\t\t\t\t\t" + _vm._s(s.lunch) + "\n\t\t\t\t\t\t\t")])]) : _vm._e(), _vm._v(" "), (s.dinnerLocation != '') ? _c('tr', [_c('td', {
        staticClass: "type",
        attrs: {
          "width": "65%"
        }
      }, [_c('div', {
        staticClass: "type"
      }, [_vm._v("Dinner")]), _vm._v(" "), _c('div', {
        domProps: {
          "innerHTML": _vm._s(_vm.getLocation(s.dinnerLocation))
        }
      })]), _vm._v(" "), _c('td', {
        staticClass: "text-xs-right",
        attrs: {
          "width": "10%"
        }
      }, [_vm._v("\n\t\t\t\t\t\t\t\t" + _vm._s(s.dinner) + "\n\t\t\t\t\t\t\t")])]) : _vm._e()]
    }), _vm._v(" "), (product.typeraw == 'weekly' && product.id == 3 && product.easysunday) ? [_vm._m(0, true), _vm._v(" "), _vm._m(1, true)] : _vm._e()], 2)])])] : _vm._e()
  })], 2)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('tr', {
    staticClass: "day"
  }, [_c('td', {
    attrs: {
      "colspan": "2"
    }
  }, [_c('b', [_vm._v("Easy Sunday")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('tr', [_c('td', {
    staticClass: "type"
  }, [_vm._v("\n\t\t\t\t\t\t\t\tThe Easy Sunday food items will be delivered on Saturday, together with your Fit & Slim dishes\n\t\t\t\t\t\t\t")]), _vm._v(" "), _c('td', [_vm._v(" ")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-296dff07", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-49f134f8\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Checkout.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "checkout container"
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
  }, [_vm._v("Loading...")])])]) : _vm._e(), _vm._v(" "), (_vm.finish) ? [_vm._m(0), _vm._v(" "), _c('p', [_vm._v("Your food order has been submitted successfully.")]), _vm._v(" "), _c('p', [_vm._v("Your Avocado Cafe Team")]), _vm._v(" "), _c('p', [_c('router-link', {
    staticClass: "button primary",
    attrs: {
      "to": "/"
    }
  }, [_c('i', {
    staticClass: "fa fa-fw fa-angle-left"
  }), _vm._v(" back to home")])], 1), _vm._v(" "), _vm._m(1)] : [_vm._m(2), _vm._v(" "), _vm._m(3), _vm._v(" "), _c('br'), _vm._v(" "), (_vm.error) ? _c('div', {
    staticClass: "alert alert-danger"
  }, [_c('strong', [_vm._v("Sorry")]), _vm._v(", but the confirmation email could not be delivered. Check/change your email address\n\t\t")]) : _vm._e(), _vm._v(" "), _c('form', {
    attrs: {
      "action": "/checkout",
      "method": "post",
      "id": "form"
    }
  }, [_c('h4', {
    staticClass: "no-pad"
  }, [_vm._v("PERSONAL DATA")]), _vm._v(" "), _c('div', {
    staticClass: "row section"
  }, [_vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "col-xs-6 col-md-4"
  }, [_c('fieldset', {
    staticClass: "form-group"
  }, [_vm._m(5), _vm._v(" "), _c('input', {
    directives: [{
      name: "validate",
      rawName: "v-validate.initial",
      value: (_vm.form.fname),
      expression: "form.fname",
      modifiers: {
        "initial": true
      }
    }, {
      name: "model",
      rawName: "v-model",
      value: (_vm.form.fname),
      expression: "form.fname"
    }],
    class: {
      'form-control': true, 'is-danger': _vm.errors.has('form.fname')
    },
    attrs: {
      "type": "text",
      "data-vv-rules": "required",
      "data-vv-as": "First name",
      "name": "fname",
      "placeholder": "First name"
    },
    domProps: {
      "value": (_vm.form.fname)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.form.fname = $event.target.value
      }
    }
  }), _vm._v(" "), (_vm.errors.has('fname')) ? _c('p', {
    staticClass: "text-danger"
  }, [_vm._v(_vm._s(_vm.errors.first('fname')))]) : _vm._e()])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-6 col-md-4"
  }, [_c('fieldset', {
    staticClass: "form-group"
  }, [_vm._m(6), _vm._v(" "), _c('input', {
    directives: [{
      name: "validate",
      rawName: "v-validate.initial",
      value: (_vm.form.lname),
      expression: "form.lname",
      modifiers: {
        "initial": true
      }
    }, {
      name: "model",
      rawName: "v-model",
      value: (_vm.form.lname),
      expression: "form.lname"
    }],
    class: {
      'form-control': true, 'is-danger': _vm.errors.has('form.lname')
    },
    attrs: {
      "type": "text",
      "data-vv-rules": "required",
      "data-vv-as": "Surname",
      "name": "lname",
      "placeholder": "Surname"
    },
    domProps: {
      "value": (_vm.form.lname)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.form.lname = $event.target.value
      }
    }
  }), _vm._v(" "), (_vm.errors.has('lname')) ? _c('p', {
    staticClass: "text-danger"
  }, [_vm._v(_vm._s(_vm.errors.first('lname')))]) : _vm._e()])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-6 offset-md-4 col-md-4"
  }, [_c('fieldset', {
    staticClass: "form-group"
  }, [_vm._m(7), _vm._v(" "), _c('input', {
    directives: [{
      name: "validate",
      rawName: "v-validate.initial",
      value: (_vm.form.email),
      expression: "form.email",
      modifiers: {
        "initial": true
      }
    }, {
      name: "model",
      rawName: "v-model.trim",
      value: (_vm.form.email),
      expression: "form.email",
      modifiers: {
        "trim": true
      }
    }],
    class: {
      'form-control': true, 'is-danger': _vm.errors.has('form.email')
    },
    attrs: {
      "type": "text",
      "data-vv-rules": "required|email",
      "data-vv-as": "Email",
      "name": "email",
      "placeholder": "Email"
    },
    domProps: {
      "value": (_vm.form.email)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.form.email = $event.target.value.trim()
      },
      "blur": function($event) {
        _vm.$forceUpdate()
      }
    }
  }), _vm._v(" "), (_vm.errors.has('email')) ? _c('p', {
    staticClass: "text-danger"
  }, [_vm._v(_vm._s(_vm.errors.first('email')))]) : _vm._e()])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-6 col-md-4"
  }, [_c('fieldset', {
    staticClass: "form-group"
  }, [_vm._m(8), _vm._v(" "), _c('input', {
    directives: [{
      name: "validate",
      rawName: "v-validate.initial",
      value: (_vm.form.phone),
      expression: "form.phone",
      modifiers: {
        "initial": true
      }
    }, {
      name: "model",
      rawName: "v-model",
      value: (_vm.form.phone),
      expression: "form.phone"
    }],
    class: {
      'form-control': true, 'is-danger': _vm.errors.has('form.phone')
    },
    attrs: {
      "type": "text",
      "data-vv-rules": "required",
      "data-vv-as": "Phone number",
      "name": "phone",
      "placeholder": "Phone number"
    },
    domProps: {
      "value": (_vm.form.phone)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.form.phone = $event.target.value
      }
    }
  }), _vm._v(" "), (_vm.errors.has('phone')) ? _c('p', {
    staticClass: "text-danger"
  }, [_vm._v(_vm._s(_vm.errors.first('phone')))]) : _vm._e()])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-6 offset-md-4 col-md-4"
  }, [_c('fieldset', {
    staticClass: "form-group radio-only"
  }, [_vm._m(9), _vm._v(" "), _c('label', {
    attrs: {
      "for": "intolerances-yes"
    }
  }, [_c('input', {
    directives: [{
      name: "validate",
      rawName: "v-validate"
    }, {
      name: "model",
      rawName: "v-model",
      value: (_vm.form.intolerances),
      expression: "form.intolerances"
    }],
    attrs: {
      "id": "intolerances-yes",
      "type": "radio",
      "data-vv-rules": "required|in:Yes,No",
      "name": "intolerances",
      "data-vv-as": "selection",
      "value": "Yes"
    },
    domProps: {
      "checked": _vm._q(_vm.form.intolerances, "Yes")
    },
    on: {
      "__c": function($event) {
        _vm.form.intolerances = "Yes"
      }
    }
  }), _vm._v("\n\t\t\t\t\t\t\t  Yes\n\t\t\t\t\t\t")]), _vm._v("\n\t\t\t\t\t\t  \n\t\t\t\t\t\t"), _c('label', {
    attrs: {
      "for": "intolerances-no"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.form.intolerances),
      expression: "form.intolerances"
    }],
    attrs: {
      "id": "intolerances-no",
      "type": "radio",
      "name": "intolerances",
      "value": "No"
    },
    domProps: {
      "checked": _vm._q(_vm.form.intolerances, "No")
    },
    on: {
      "__c": function($event) {
        _vm.form.intolerances = "No"
      }
    }
  }), _vm._v("  No\n\t\t\t\t\t\t")]), _vm._v(" "), (_vm.errors.has('intolerances')) ? _c('p', {
    staticClass: "text-danger"
  }, [_vm._v(_vm._s(_vm.errors.first('intolerances')))]) : _vm._e(), _vm._v(" "), (_vm.form.intolerances == 'Yes') ? _c('div', {
    staticClass: "extra-field"
  }, [_c('textarea', {
    directives: [{
      name: "validate",
      rawName: "v-validate.initial",
      value: (_vm.form.intolerancesText),
      expression: "form.intolerancesText",
      modifiers: {
        "initial": true
      }
    }, {
      name: "model",
      rawName: "v-model",
      value: (_vm.form.intolerancesText),
      expression: "form.intolerancesText"
    }],
    class: {
      'form-control': true, 'is-danger': _vm.errors.has('form.intolerancesText')
    },
    attrs: {
      "type": "text",
      "data-vv-rules": "required",
      "data-vv-as": "Field",
      "placeholder": "Please enter",
      "rows": "5"
    },
    domProps: {
      "value": (_vm.form.intolerancesText)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.form.intolerancesText = $event.target.value
      }
    }
  }), _vm._v(" "), (_vm.errors.has('form.intolerancesText')) ? _c('p', {
    staticClass: "text-danger"
  }, [_vm._v(_vm._s(_vm.errors.first('form.intolerancesText')))]) : _vm._e()]) : _vm._e()])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-6 col-md-4"
  }, [_c('fieldset', {
    staticClass: "form-group radio-only"
  }, [_vm._m(10), _vm._v(" "), _c('label', {
    attrs: {
      "for": "allergies-yes"
    }
  }, [_c('input', {
    directives: [{
      name: "validate",
      rawName: "v-validate"
    }, {
      name: "model",
      rawName: "v-model",
      value: (_vm.form.allergies),
      expression: "form.allergies"
    }],
    attrs: {
      "id": "allergies-yes",
      "type": "radio",
      "data-vv-rules": "required|in:Yes,No",
      "data-vv-as": "selection",
      "name": "allergies",
      "value": "Yes"
    },
    domProps: {
      "checked": _vm._q(_vm.form.allergies, "Yes")
    },
    on: {
      "__c": function($event) {
        _vm.form.allergies = "Yes"
      }
    }
  }), _vm._v("\n\t\t\t\t\t\t\t  Yes\n\t\t\t\t\t\t")]), _vm._v("\n\t\t\t\t\t\t  \n\t\t\t\t\t\t"), _c('label', {
    attrs: {
      "for": "allergies-no"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.form.allergies),
      expression: "form.allergies"
    }],
    attrs: {
      "id": "allergies-no",
      "type": "radio",
      "name": "allergies",
      "value": "No"
    },
    domProps: {
      "checked": _vm._q(_vm.form.allergies, "No")
    },
    on: {
      "__c": function($event) {
        _vm.form.allergies = "No"
      }
    }
  }), _vm._v("  No\n\t\t\t\t\t\t")]), _vm._v(" "), (_vm.errors.has('allergies')) ? _c('p', {
    staticClass: "text-danger"
  }, [_vm._v(_vm._s(_vm.errors.first('allergies')))]) : _vm._e(), _vm._v(" "), (_vm.form.allergies == 'Yes') ? _c('div', {
    staticClass: "extra-field"
  }, [_c('textarea', {
    directives: [{
      name: "validate",
      rawName: "v-validate.initial",
      value: (_vm.form.allergiesText),
      expression: "form.allergiesText",
      modifiers: {
        "initial": true
      }
    }, {
      name: "model",
      rawName: "v-model",
      value: (_vm.form.allergiesText),
      expression: "form.allergiesText"
    }],
    class: {
      'form-control': true, 'is-danger': _vm.errors.has('form.allergiesText')
    },
    attrs: {
      "type": "text",
      "data-vv-rules": "required",
      "data-vv-as": "Field",
      "placeholder": "Please enter",
      "rows": "5"
    },
    domProps: {
      "value": (_vm.form.allergiesText)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.form.allergiesText = $event.target.value
      }
    }
  }), _vm._v(" "), (_vm.errors.has('form.allergiesText')) ? _c('p', {
    staticClass: "text-danger"
  }, [_vm._v(_vm._s(_vm.errors.first('form.allergiesText')))]) : _vm._e()]) : _vm._e()])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-12 offset-md-4 col-md-8"
  }, [_c('fieldset', {
    staticClass: "form-group"
  }, [_c('label', {
    attrs: {
      "for": "dislikefood"
    }
  }, [_vm._v("Food I don't like")]), _vm._v(" "), _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.form.dislikefood),
      expression: "form.dislikefood"
    }],
    staticClass: "form-control",
    attrs: {
      "placeholder": "Please enter",
      "rows": "5"
    },
    domProps: {
      "value": (_vm.form.dislikefood)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.form.dislikefood = $event.target.value
      }
    }
  })])])]), _vm._v(" "), _c('h4', {
    staticClass: "no-pad"
  }, [_vm._v("CART OVERVIEW")]), _vm._v(" "), _c('div', {
    staticClass: "row section"
  }, [_vm._m(11), _vm._v(" "), _c('div', {
    staticClass: "col-xs-12 col-md-8"
  }, [_c('cart', {
    attrs: {
      "cart": _vm.cart,
      "extradelivery": _vm.form.deliveryarea
    }
  })], 1)]), _vm._v(" "), _c('h4', {
    staticClass: "no-pad"
  }, [_vm._v("DELIVERY INFO")]), _vm._v(" "), _c('div', {
    staticClass: "row section"
  }, [_vm._m(12), _vm._v(" "), _c('div', {
    staticClass: "col-xs-12 col-md-8"
  }, [_c('schedule', {
    attrs: {
      "cart": _vm.cart
    }
  })], 1)]), _vm._v(" "), _c('h4', {
    staticClass: "no-pad"
  }, [_vm._v("COMMENTS")]), _vm._v(" "), _c('div', {
    staticClass: "row section"
  }, [_vm._m(13), _vm._v(" "), _c('div', {
    staticClass: "col-xs-12 col-md-8"
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.form.comments),
      expression: "form.comments"
    }],
    staticClass: "form-control",
    attrs: {
      "name": "comments",
      "rows": "10"
    },
    domProps: {
      "value": (_vm.form.comments)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.form.comments = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('br'), _c('br'), _vm._v(" "), _c('div', {
    staticClass: "text-xs-center"
  }, [_c('router-link', {
    staticClass: "button primary big",
    attrs: {
      "to": "/overview"
    }
  }, [_vm._v("\n\t\t\t\t\tback\n\t\t\t\t")]), _vm._v("\n\t\t\t\t \n\t\t\t\t"), (this.cartState.length > 0) ? _c('a', {
    staticClass: "button yellow big",
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.checkout($event)
      }
    }
  }, [_vm._v("\n\t\t\t\t\tsend order "), _c('i', {
    staticClass: "fa fa-fw fa-angle-right"
  })]) : _vm._e()], 1)])]], 2)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "page-title"
  }, [_c('h2', [_vm._v("thank you")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('figure', [_c('img', {
    staticClass: "responsive",
    attrs: {
      "src": "/images/thankyou.jpg?v=1",
      "alt": ""
    }
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "page-title"
  }, [_c('h2', [_vm._v("checkout")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "info"
  }, [_vm._v("\n\t\t\tYou are almost done"), _c('br'), _vm._v("\n\t\t\tPlease check again all details and fill in your personal data below.\n\t\t")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "hidden-md-down col-md-4"
  }, [_c('p', {
    staticClass: "lp"
  }, [_vm._v("\n\t\t\t\t\t\tEnter your details here. Fields marked with "), _c('span', {
    staticClass: "required"
  }, [_vm._v("*")]), _vm._v(" are required.\n\t\t\t\t\t")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    attrs: {
      "for": "fname"
    }
  }, [_vm._v("First name "), _c('span', {
    staticClass: "required"
  }, [_vm._v("*")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    attrs: {
      "for": "surname"
    }
  }, [_vm._v("Surname "), _c('span', {
    staticClass: "required"
  }, [_vm._v("*")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    attrs: {
      "for": "date"
    }
  }, [_vm._v("Email address "), _c('span', {
    staticClass: "required"
  }, [_vm._v("*")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    attrs: {
      "for": "phone"
    }
  }, [_vm._v("Phone number "), _c('span', {
    staticClass: "required"
  }, [_vm._v("*")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "single"
  }, [_vm._v("Food Intolerances "), _c('span', {
    staticClass: "required"
  }, [_vm._v("*")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "single"
  }, [_vm._v("Food Allergies "), _c('span', {
    staticClass: "required"
  }, [_vm._v("*")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "hidden-md-down col-md-4"
  }, [_c('p', {
    staticClass: "lp"
  }, [_vm._v("\n\t\t\t\t\t\tReview your selected items and press SEND ORDER to proceed.\n\t\t\t\t\t")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "hidden-md-down col-md-4"
  }, [_c('p', {
    staticClass: "lp"
  }, [_vm._v("\n\t\t\t\t\t\tReview your food delivery schedule.\n\t\t\t\t\t")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "hidden-md-down col-md-4"
  }, [_c('p', {
    staticClass: "lp"
  }, [_vm._v("\n\t\t\t\t\t\tAny special request we should be aware of?\n\t\t\t\t\t\tFeel free to write some comments here.\n\t\t\t\t\t")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-49f134f8", module.exports)
  }
}

/***/ }),

/***/ "./resources/assets/js/components/Checkout.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/Checkout.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-49f134f8\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/Checkout.vue"),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/excalibur/Omega/food/resources/assets/js/components/Checkout.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Checkout.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-49f134f8", Component.options)
  } else {
    hotAPI.reload("data-v-49f134f8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./resources/assets/js/components/ScheduleList.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}],\"es2015\"],\"plugins\":[\"transform-object-rest-spread\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/assets/js/components/ScheduleList.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-296dff07\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/assets/js/components/ScheduleList.vue"),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/excalibur/Omega/food/resources/assets/js/components/ScheduleList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ScheduleList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-296dff07", Component.options)
  } else {
    hotAPI.reload("data-v-296dff07", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});