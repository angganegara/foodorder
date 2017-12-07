import { mount } from 'vue-test-utils'
import expect from 'expect'
import FoodPrompt from '../../resources/assets/js/components/Home.vue'

describe('Example', () => {
	it ('Says that it is an example component', () => {
		let v = mount(FoodPrompt)

		expect(v.html()).toContain('The best solution')
	})
})
