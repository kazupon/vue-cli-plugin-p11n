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

  // check pkg
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

  // check files
  const plugin = files['src/plugin.js']
  expect(plugin).toMatch(`Vue.prototype.$add = (a, b) => {`)
})

test('typescript', async () => {
  const projectName = 'vue-i18n'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-plugin-typescript',
    apply: () => {},
    options: { projectName }
  }, {
    id: 'p11n',
    apply: require('../generator'),
    options: {}
  }])

  // check pkg
  expect(pkg.files).toContain('types/index.d.ts')

  // check files
  const plugin = files['src/plugin.ts']
  const dts = files['types/index.d.ts']
  expect(plugin).toMatch(`import { VueConstructor, PluginObject } from 'vue'`)
  expect(dts).toMatch(`type PluginAddFunction = (a: number, b: number) => number`)
})