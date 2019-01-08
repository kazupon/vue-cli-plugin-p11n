const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')

test('basic', async () => {
  const { pkg, files } = await generateWithPlugin([{
    id: 'p11n',
    apply: require('../generator'),
    options: {}
  }])
  expect(false).toBe(false)
})