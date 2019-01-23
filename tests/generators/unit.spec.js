jest.mock('/package.json', () => () => {}, { virtual: true })
const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')

test('jest', async () => {
  const projectName = 'vue-i18n-gen-jest'
  const { files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: '@vue/cli-plugin-unit-jest',
    apply: () => {},
    options: { }
  }, {
    id: 'p11n',
    apply: require('../../generator'),
    options: {}
  }])

  const tdd = files['tests/unit/plugin.spec.js']
  expect(tdd).toMatch(`expect(wrapper.vm.$add(1, 1)).toBe(2)`)
})

test('mocha', async () => {
  const projectName = 'vue-i18n-gen-mocha'
  const { files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: '@vue/cli-plugin-unit-mocha',
    apply: () => {},
    options: { }
  }, {
    id: 'p11n',
    apply: require('../../generator'),
    options: {}
  }])

  const tdd = files['tests/unit/plugin.spec.js']
  expect(tdd).toMatch(`expect(wrapper.vm.$add(1, 1)).to.equal(2)`)
})
