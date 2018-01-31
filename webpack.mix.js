let mix = require('laravel-mix');
var ZopfliPlugin = require("zopfli-webpack-plugin");

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

mix.js('resources/assets/js/main.js', 'public/js/app.js')
	//.copy('public/js/app.js', 'public/bundle.js')
	.sass('resources/assets/sass/app.scss', 'public/css/app.css')
    .sass('resources/assets/sass/backend.scss', 'public/css/backend.css')
    .combine([
        'resources/assets/css/font-awesome.min.css',
        'resources/assets/css/tether.min.css',
        'resources/assets/css/pickadate/themes/classic.css',
        'resources/assets/css/pickadate/themes/classic.date.css',
        'resources/assets/css/fancybox/jquery.fancybox.css',
        'resources/assets/css/fancybox/helpers/jquery.fancybox-thumbs.css',
        './node_modules/nprogress/nprogress.css'
    ], 'public/css/plugins.css')
    .version([
    	'public/css/plugins.css'
	])
	.webpackConfig({
		output: {
			//chunkFilename: 'js/[name].[chunkhash].js',
			chunkFilename: 'js/[name].js',
    },
    /*
    plugins: [
      new ZopfliPlugin({
        asset: '[path].gz[query]',
        algorithm: 'zopfli',
        test: /\.(js)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]*/
	})
    .browserSync({
    	proxy: 'food.test'
    });

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.standaloneSass('src', output); <-- Faster, but isolated from Webpack.
// mix.fastSass('src', output); <-- Alias for mix.standaloneSass().
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.dev');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
