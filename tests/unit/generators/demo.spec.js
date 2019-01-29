const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')

let spy
beforeEach(() => {
  const utils = require('../../../lib/utils')
  spy = jest.spyOn(utils, 'loadPackage')
  spy.mockImplementation(api => ({
    name: 'vue-i18n',
    author: 'kazuya kawaguchi',
    version: '0.0.1',
    license: 'MIT'
  }))
})

afterEach(() => {
  spy.mockClear()
})

test('demo', async () => {
  const projectName = 'vue-i18n-gen-demo'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: 'p11n',
    apply: require('../../../generator'),
    options: {}
  }])

  // check pkg
  expect(pkg.scripts.demo).toMatch('vue-cli-service demo')

  // check files
  const demo = files['demo/Demo.vue']
  expect(demo).toMatch(`<h1>Plugin Demo</h1>`)
  const main = files['demo/main.js']
  expect(main).toMatch(`import Vue from 'vue'`)
  const index = files['demo/index.html']
  expect(index).toMatch(`<title>Vue Plugin Demo</title>`)
})
