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

test('release', async () => {
  const projectName = 'vue-i18n-gen-release'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: 'p11n',
    apply: require('../../../generator'),
    options: {}
  }])

  // check files
  const license = files['LICENSE']
  expect(license).toMatch(`The MIT License (MIT)`)
  const changelog = files['CHANGELOG.md']
  expect(changelog).toMatch(`// TODO: release log here ...`)
})
