jest.setTimeout(6000000)

const path = require('path')
const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')
const { create } = require('./helper')

test('release generation', async () => {
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

  // check files
  const license = files['LICENSE']
  expect(license).toMatch(`The MIT License (MIT)`)
  const changelog = files['CHANGELOG.md']
  expect(changelog).toMatch(`// TODO: release log here ...`)
})