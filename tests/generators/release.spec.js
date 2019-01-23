jest.mock('/package.json', () => () => {}, { virtual: true })
const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')

test('release', async () => {
  const projectName = 'vue-i18n-gen-release'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: 'p11n',
    apply: require('../../generator'),
    options: {}
  }])

  // check files
  const license = files['LICENSE']
  expect(license).toMatch(`The MIT License (MIT)`)
  const changelog = files['CHANGELOG.md']
  expect(changelog).toMatch(`// TODO: release log here ...`)
})
