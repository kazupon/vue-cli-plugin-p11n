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
  const plugin = files['src/index.js']
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
  const plugin = files['src/index.ts']
  const dts = files['types/index.d.ts']
  expect(plugin).toMatch(`import { VueConstructor, PluginObject } from 'vue'`)
  expect(dts).toMatch(`type PluginAddFunction = (a: number, b: number) => number`)
})

test('jest', async () => {
  const projectName = 'vue-i18n'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: '@vue/cli-plugin-unit-jest',
    apply: () => {},
    options: { }
  }, {
    id: 'p11n',
    apply: require('../generator'),
    options: {}
  }])

  const tdd = files['tests/unit/plugin.spec.js']
  expect(tdd).toMatch(`expect(wrapper.vm.$add(1, 1)).toMatch(2)`)
})

test('mocha', async () => {
  const projectName = 'vue-i18n'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: '@vue/cli-plugin-unit-mocha',
    apply: () => {},
    options: { }
  }, {
    id: 'p11n',
    apply: require('../generator'),
    options: {}
  }])

  const tdd = files['tests/unit/plugin.spec.js']
  expect(tdd).toMatch(`expect(wrapper.vm.$add(1, 1)).to.equal(2)`)
})
