const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')

test('basic', async () => {
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

  expect(pkg.sideeffects).toBe(false)
  expect(pkg.main).toBe(`dist/${projectName}.common.js`)
  expect(pkg.jsdelivr).toBe(`dist/${projectName}.umd.min.js`)
  expect(pkg.module).toBe(`dist/${projectName}.esm.js`)
  expect(pkg.unpkg).toBe(`dist/${projectName}.umd.min.js`)

  const distFiles = [
    `dist/${projectName}.common.js`,
    `dist/${projectName}.umd.min.js`,
    `dist/${projectName}.umd.js`,
    `dist/${projectName}.esm.js`,
    'src'
  ]
  distFiles.forEach(file => { expect(pkg.files).toContain(file) })

  const spec = files['src/lib.js']
  expect(spec).toMatch(`Vue.prototype.$add = (a, b) => {`)
})