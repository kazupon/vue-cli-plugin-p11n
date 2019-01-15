jest.setTimeout(6000000)

const path = require('path')
const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')
const { create } = require('./helper')

test('docs generation', async () => {
  const projectName = 'vue-i18n'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: 'p11n',
    apply: require('../generator'),
    options: {}
  }])

  // check pkg
  expect(pkg.scripts['docs:dev']).toMatch('vue-cli-service docs --mode dev')
  expect(pkg.scripts['docs:build']).toMatch('vue-cli-service docs --mode build')

  // check files
  const installation = files['docs/installation.md']
  expect(installation).toMatch(`# Installation`)
  const readme = files['docs/README.md']
  expect(readme).toMatch(`# Introduction`)
  const started = files['docs/started.md']
  expect(started).toMatch(`# Getting Started`)
  const config = files['docs/.vuepress/config.js']
  expect(config).toMatch(`module.exports = {`)
})

test('docs command', async () => {
  const projectName = 'vue-i18n-docs'
  const project = await create(projectName, {
    plugins: {
      '@vue/cli-plugin-babel': {}
    }
  })
})
