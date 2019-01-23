jest.mock('/package.json', () => () => {}, { virtual: true })
const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')

test('demo', async () => {
  const projectName = 'vue-i18n-gen-demo'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: 'p11n',
    apply: require('../../generator'),
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
