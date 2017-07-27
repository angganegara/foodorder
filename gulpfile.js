const elixir = require('laravel-elixir');
require('laravel-elixir-vue-2');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(mix => {
    mix.sass('app.scss', 'public/css/app.css')
        .sass('backend.scss', 'public/css/backend.css')
        .styles([
            'font-awesome.min.css',
            'tether.min.css',
            'pickadate/themes/classic.css',
            'pickadate/themes/classic.date.css',
            'fancybox/jquery.fancybox.css',
            'fancybox/helpers/jquery.fancybox-thumbs.css',
            './node_modules/nprogress/nprogress.css'
        ], 'public/css/plugins.css')
        .version([
            'css/plugins.css'
        ])
        .webpack('main.js', 'public/js/main.js')
        .browserSync({
        	proxy: 'food.dev'
        });
});
