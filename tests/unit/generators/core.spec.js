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

test('javascript', async () => {
  const projectName = 'vue-i18n-gen-js'
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
  const projectName = 'vue-i18n-gen-ts'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: '@vue/cli-plugin-typescript',
    apply: () => {},
    options: { projectName }
  }, {
    id: 'p11n',
    apply: require('../../../generator'),
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
