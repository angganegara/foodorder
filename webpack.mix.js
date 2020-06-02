let mix = require("laravel-mix");
const CompressionPlugin = require('compression-webpack-plugin');
const zopfli = require('@gfx/zopfli');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix
  .react("resources/assets/js/app.js", "public/js/app.js")
  .js("resources/assets/js/admin.js", "public/js/admin.js")
  .react("resources/assets/js/backend/report.js", "public/js/report.js")
  .react("resources/assets/js/backend/mealplans.js", "public/js/mealplans.js")
  .react("resources/assets/js/backend/mealpreset.js", "public/js/mealpreset.js")
  .react("resources/assets/js/backend/neworder.js", "public/js/neworder.js")
  .react("resources/assets/js/backend/coupon.js", "public/js/coupon.js")
  .react("resources/assets/js/backend/recommendation.js", "public/js/recommendation.js")
  .sass("resources/assets/sass/app.scss", "public/css/app.css")
  .sass("resources/assets/sass/print.scss", "public/css/print.css")
  .sass("resources/assets/sass/backend.scss", "public/css/backend.css")
  .combine(
    [
      "resources/assets/css/pickadate/themes/classic.css",
      "resources/assets/css/pickadate/themes/classic.date.css",
      "./node_modules/nprogress/nprogress.css"
    ],
    "public/css/plugins.css"
  )
  .version(["public/css/plugins.css"])
  .webpackConfig({
    output: {
      chunkFilename: "js/[name].js"
    },
  })
  .browserSync({
    proxy: "mealplans.test"
  });