<%_ if (unit === 'mocha') { _%>
import { expect } from 'chai'
<%_ } _%>
import { shallowMount, createLocalVue } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import plugin from '../../src/index'

describe('Plugin', () => {
  it('should be 2', () => {
    const msg = 'new message'
    const localVue = createLocalVue()
    localVue.use(plugin)
    const wrapper = shallowMount(HelloWorld, {
      localVue,
      propsData: { msg }
    })
  <%_ if (unit === 'jest') { _%>
    expect(wrapper.vm.$add(1, 1)).toBe(2)
  <%_ } else if (unit === 'mocha') { _%>
    expect(wrapper.vm.$add(1, 1)).to.equal(2)
  <%_ } _%>
  })
})
