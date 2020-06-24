module.exports = {
	purge: [
		'./resources/assets/js/*.js',
		'./resources/assets/js/payment/*.svelte',
	],
	heme: {
		extend: {},
	},
	variants: {},
	plugins: [
		require('@tailwindcss/custom-forms')
	],
}
