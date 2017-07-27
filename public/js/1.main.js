webpackJsonp([1],{211:function(t,a,s){"use strict";var e=s(3),i=s(219),o=s.n(i),n=s(220),r=s.n(n);a["default"]={mixins:[e.a],components:{"detox-page":o.a,"fit-slim":r.a},name:"Food",data:function(){return{slug:this.$route.params.slug,id:this.$route.params.id,data:{},loading:!0,date:new Date("Y-m-d")}},created:function(){this.$http.get("/api/foods/"+this.id).then(function(t){this.data=t.body,this.$Progress.finish(),this.loading=!1})},methods:{formatPrice:function(t){return numeral(t).format("0,0")}},computed:{isAdded:function(){var t=this;return _.find(this.$store.state.cart,function(a){return a.id==t.id})}}}},212:function(t,a,s){"use strict";a["default"]={name:"food-detox",props:["data"],methods:{formatPrice:function(t){return numeral(t).format("0,0")}}}},213:function(t,a,s){"use strict";var e=s(138);a["default"]={name:"fit-slim",props:["data"],data:function(){return{menus:{}}},methods:{formatPrice:function(t){return numeral(t).format("0,0")},markdown:function(t){return e(t,{sanitize:!0})}},created:function(){var t=this;this.$http.get("/api/menus").then(function(a){t.menus=a.body})}}},219:function(t,a,s){var e,i;e=s(212);var o=s(224);i=e=e||{},"object"!=typeof e["default"]&&"function"!=typeof e["default"]||(i=e=e["default"]),"function"==typeof i&&(i=i.options),i.render=o.render,i.staticRenderFns=o.staticRenderFns,t.exports=e},220:function(t,a,s){var e,i;e=s(213);var o=s(226);i=e=e||{},"object"!=typeof e["default"]&&"function"!=typeof e["default"]||(i=e=e["default"]),"function"==typeof i&&(i=i.options),i.render=o.render,i.staticRenderFns=o.staticRenderFns,t.exports=e},224:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"food-wrap"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-xs-12 col-md-8 flex"},[s("div",{staticClass:"food-detox"},[s("h4",{staticClass:"food-name"},[t._v("Juice Detox")]),t._v(" "),s("div",{staticClass:"row"},[t._m(0),t._v(" "),s("div",{staticClass:"col-xs-12 col-md-6"},[s("figure",[s("img",{attrs:{src:"/images/foods/"+t.data.id+"_1.jpg",alt:""}})])])]),t._v(" "),s("hr"),t._v(" "),s("h4",{staticClass:"food-name"},[t._v("Soup Detox")]),t._v(" "),s("div",{staticClass:"row"},[t._m(1),t._v(" "),s("div",{staticClass:"col-xs-12 col-md-6"},[s("figure",[s("img",{attrs:{src:"/images/foods/"+t.data.id+"_3.jpg",alt:""}})])])]),t._v(" "),s("hr"),t._v(" "),s("h4",{staticClass:"food-name"},[t._v("VEGGIE & FRUIT DETOX")]),t._v(" "),s("div",{staticClass:"row"},[t._m(2),t._v(" "),s("div",{staticClass:"col-xs-12 col-md-6"},[s("figure",[s("img",{attrs:{src:"/images/foods/"+t.data.id+"_5.jpg",alt:""}})])])])])]),t._v(" "),s("div",{staticClass:"col-xs-12 col-md-4 flex"},[s("div",{staticClass:"food-price food-text",staticStyle:{"align-self":"flex-start"}},[t._l(t.data.prices,function(a){return[s("div",{staticClass:"flex food-title"},[s("h5",[t._v(t._s(a.name))]),t._v(" "),s("p",{staticClass:"price"},[t._v(t._s(t.formatPrice(a.price))+" IDR")])]),t._v(" "),a.description?[s("p",{staticClass:"desc"},[t._v(t._s(a.description))])]:t._e(),t._v(" "),s("hr")]}),t._v(" "),s("p",[t._v("All prices include tax, service and delivery to Kuta/Seminyak/Canggu area.")]),t._v(" "),s("p",[t._v("Delivery surcharge of 50,000 IDR/day applies for other areas (e.g. Sanur, Bukit, Ubud, Nusa Dua)")]),t._v(" "),s("p",[t._v("All payments must be done on the first day of delivery.")]),t._v(" "),s("p",[t._v("Payment options: cash to driver upon nota receipt, PayPal, bank transfer")])],2)])]),t._v(" "),3==t.data.id?s("div",{staticClass:"row"},[t._m(3)]):t._e()])},staticRenderFns:[function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"col-xs-12 col-md-6"},[s("p",[t._v("Our juice detox involves the short-term intake of raw vegetable and fruit juices, Coconut water, turmeric boost, herbal tea and water.")]),t._v(" "),s("p",[t._v("A juice fast is considered an extreme form of detoxification because no solid food is consumed. There should be a gradual start into this detox and then a return to solid foods.")]),t._v(" "),s("p",[s("b",[t._v("CONTENT")])]),t._v(" "),s("p",[t._v("2 bottles freshly blended raw veggie&fruit juices, 1 bottle Turmeric Boost, 1 bottle coconut water, 2 herbal tea bags, 1x Epsom salts."),s("br"),t._v("You will receive your daily package every morning.")]),t._v(" "),s("p",[s("b",[t._v("TARGET")])]),t._v(" "),s("p",[t._v("The benefit of juicing is that it gives your digestion system a break from working so hard to process a large meal therefore your body can work rapidly on detoxification. This leads to feeling joyful and light, and keeping slim and radiant.")])])},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"col-xs-12 col-md-6"},[s("p",[t._v("The Soup Detox is based only on vegetables. These two tasty soups are freshly cooked and rounded off with spices that support your digestion. They are rich in minerals and vitamins to keep you nourished and healthy.")]),t._v(" "),s("p",[s("b",[t._v("CONTENT")])]),t._v(" "),s("p",[t._v("For one day: 1 coconut water for breakfast, 2 veggie soups for lunch and dinner, 2 blended vegetable soups as snacks between breakfast/lunch and lunch/dinner and1x Epsom salts. You will get the whole amount for 6 days on the beginning day of your detox.")]),t._v(" "),s("p",[s("b",[t._v("TARGET")])]),t._v(" "),s("p",[t._v("The purpose of following a six-day Soup Detox is to affect a rapid weight-loss by consuming mainly vegetable soup on each day of your diet. This method detoxifies your body naturally and makes you feel lighter and balanced.")])])},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"col-xs-12 col-md-6"},[s("p",[t._v("The Veggie & Fruit Detox is our lightest version of all detox methods."),s("br"),t._v("\nThis delicious plant-based menu will help you to get rid of the toxins in your body, feeling more energized and slim down.")]),t._v(" "),s("p",[s("b",[t._v("CONTENT")])]),t._v(" "),s("p",[t._v("This 6-day menu includes breakfast, lunch and dinner as well as 2 snacks in form of a drink as an extra energy kick in between the meals plus 1x Epsom salts. All meals are freshly cooked right before delivery and contain only high-quality ingredients.")]),t._v(" "),s("p",[s("b",[t._v("TARGET")])]),t._v(" "),s("p",[t._v("This diet with the high intake of veggies & fruits helps your body to detox naturally. At the same time, you resorb all the vitamins and minerals from the fresh veggies and fruits.")])])},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"col-xs-12"},[s("div",{staticClass:"page-subtitle"},[s("h2",[t._v("fit&slim weekly menu")])])])}]}},226:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"food-wrap"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-xs-12"},[s("div",{staticClass:"page-subtitle first"},[s("h2",[t._v(t._s(t.data.name)+" "+t._s(t.data.subname))])])])]),t._v(" "),s("div",{staticClass:"row"},[s("div",{staticClass:"col-xs-12 col-md-6 col-lg-8"},[s("div",{staticClass:"row fit"},t._l(t.menus,function(a){return s("div",{staticClass:"col-xs food-menus"},[s("div",{staticClass:"food-menu food-text"},[s("h4",[t._v(t._s(a.day))]),t._v(" "),s("div",{domProps:{innerHTML:t._s(t.markdown(a.content))}})])])}))]),t._v(" "),s("div",{staticClass:"col-xs-12 col-md-6 col-lg-4"},[s("div",{staticClass:"food-price food-text"},[t._l(t.data.prices,function(a){return[s("div",{staticClass:"flex food-title"},[s("h5",[t._v(t._s(a.name))]),t._v(" "),s("p",{staticClass:"price"},[t._v(t._s(t.formatPrice(a.price))+" IDR")])]),t._v(" "),a.description?[s("p",{staticClass:"desc"},[t._v(t._s(a.description))])]:t._e(),t._v(" "),s("hr")]}),t._v(" "),s("p",[t._v("All prices include tax, service and delivery to Kuta/Seminyak/Canggu area.")]),t._v(" "),s("p",[t._v("Delivery surcharge of 50,000 IDR/day applies for other areas (e.g. Sanur, Bukit, Ubud, Nusa Dua)")]),t._v(" "),s("p",[t._v("All payments must be done on the first day of delivery.")]),t._v(" "),s("p",[t._v("Payment options: cash to driver upon nota receipt, PayPal, bank transfer")])],2),t._v(" "),s("div",{staticClass:"fitslim-pic"},[s("figure",[s("img",{attrs:{src:"/images/foods/"+t.data.id+"_1.jpg",alt:""}})])])])])])},staticRenderFns:[]}},229:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"food-page container"},[t.loading?s("div",{staticClass:"comp-loading"},[s("div",{staticClass:"el-loading-spinner"},[s("svg",{staticClass:"circular",attrs:{viewBox:"25 25 50 50"}},[s("circle",{staticClass:"path",attrs:{cx:"50",cy:"50",r:"20",fill:"none"}})]),t._v(" "),s("p",{staticClass:"el-loading-text"},[t._v("Loading...")])])]):t._e(),t._v(" "),s("div",{staticClass:"page-title"},[s("h2",[t._v("Menu details")]),t._v(" "),s("div",{staticClass:"page-buttons"},[s("router-link",{staticClass:"button no-border",attrs:{to:"/"}},[s("i",{staticClass:"fa fa-fw fa-angle-left"}),t._v(" back\n            ")]),t._v(" "),t.isAdded?s("button",{staticClass:"button primary"},[s("i",{staticClass:"fa fa-fw fa-check"}),t._v(" already in cart\n            ")]):s("button",{staticClass:"button primary",on:{click:function(a){t.showPopup(t.data)}}},[s("i",{staticClass:"fa fa-fw fa-plus"}),t._v(" add to cart\n            ")])],1)]),t._v(" "),3!=this.id?[s("div",{staticClass:"food-wrap"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-xs-12 col-md-8 flex"},[s("div",{staticClass:"food-description food-text"},[s("h4",{staticClass:"food-name"},[t._v(t._s(t.data.name))]),t._v(" "),s("div",{domProps:{innerHTML:t._s(t.data.description)}})])]),t._v(" "),s("div",{staticClass:"col-xs-12 col-md-4 flex"},[s("div",{staticClass:"food-price food-text"},[t._l(t.data.prices,function(a){return[s("div",{staticClass:"flex food-title"},[s("h5",[t._v(t._s(a.name))]),t._v(" "),s("p",{staticClass:"price"},[t._v(t._s(t.formatPrice(a.price))+" IDR")])]),t._v(" "),a.description?[s("p",{staticClass:"desc"},[t._v(t._s(a.description))])]:t._e(),t._v(" "),s("hr")]}),t._v(" "),s("p",[t._v("All prices include tax, service and delivery to Kuta/Seminyak/Canggu area.")]),t._v(" "),s("p",[t._v("Delivery surcharge of 50,000 IDR/day applies for other areas (e.g. Sanur, Bukit, Ubud, Nusa Dua)")]),t._v(" "),s("p",[t._v("All payments must be done on the first day of delivery.")]),t._v(" "),s("p",[t._v("Payment options: cash to driver upon nota receipt, PayPal, bank transfer")])],2)])]),t._v(" "),3==t.data.id?s("div",{staticClass:"row"},[t._m(0)]):t._e(),t._v(" "),s("div",{staticClass:"row"},[3==t.data.id?t._l(t.menus,function(a){return s("div",{staticClass:"col-xs food-menus"},[s("div",{staticClass:"food-menu food-text"},[s("h4",[t._v(t._s(a.day))]),t._v(" "),s("div",{domProps:{innerHTML:t._s(a.content)}})])])}):t._e(),t._v(" "),s("br"),t._v(" "),t._l(t.data.pictures,function(t){return[s("div",{staticClass:"col-xs food-menus"},[s("figure",[s("img",{attrs:{src:"/images/foods/"+t,alt:""}})])])]})],2)])]:t._e(),t._v(" "),3==this.id?[s("fit-slim",{attrs:{data:t.data}})]:t._e(),t._v(" "),s("br"),t._v(" "),s("div",{staticClass:"page-title"},[s("router-link",{staticClass:"button yellow big",attrs:{to:"/overview"}},[t._v("\n            checkout "),s("i",{staticClass:"fa fa-fw fa-angle-right"})]),t._v(" "),s("div",{staticClass:"page-buttons"},[s("router-link",{staticClass:"button no-border",attrs:{to:"/"}},[s("i",{staticClass:"fa fa-fw fa-angle-left"}),t._v(" back\n            ")]),t._v(" "),t.isAdded?s("button",{staticClass:"button primary"},[s("i",{staticClass:"fa fa-fw fa-check"}),t._v(" already in cart\n            ")]):s("button",{staticClass:"button primary",on:{click:function(a){t.showPopup(t.data)}}},[s("i",{staticClass:"fa fa-fw fa-plus"}),t._v(" add to cart\n            ")])],1)],1)],2)},staticRenderFns:[function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"col-xs-12"},[s("div",{staticClass:"page-subtitle"},[s("h2",[t._v("fit&slim weekly menu")])])])}]}},8:function(t,a,s){var e,i;e=s(211);var o=s(229);i=e=e||{},"object"!=typeof e["default"]&&"function"!=typeof e["default"]||(i=e=e["default"]),"function"==typeof i&&(i=i.options),i.render=o.render,i.staticRenderFns=o.staticRenderFns,t.exports=e}});