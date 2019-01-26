const { createMockService } = require('../helper')

let spyLoadModule
let spyGetAllEntries
let pkg

beforeEach(() => {
  pkg = {
    name: 'vue-i18n',
    author: 'kazuya kawaguchi',
    version: '0.0.1',
    license: 'MIT'
  }
  jest.mock('fs', () => {
    const fs = require('memfs').fs
    fs.existsSync = () => true
    return fs
  })
  jest.mock('../../lib/build', () => {
    const banner = require('../../lib/build/banner')
    return {
      bundle: () => {},
      getAllEntries: () => [],
      banner
    }
  })
  const utils = require('../../lib/utils')
  spyLoadModule = jest.spyOn(utils, 'loadPackage')
  const build = require('../../lib/build')
  spyGetAllEntries = jest.spyOn(build, 'getAllEntries')
})

afterEach(() => {
  spyGetAllEntries.mockClear()
  spyLoadModule.mockClear()
  jest.clearAllMocks()
  jest.unmock('../../lib/build')
  jest.unmock('fs')
})

test('build from javascript codes', () => {
  spyLoadModule.mockReturnValueOnce(pkg)
  spyGetAllEntries.mockReturnValueOnce([])

  const service = createMockService([{
    id: 'babel',
    apply: () => {}
  }, {
    id: 'vue-cli-plugin-p11n',
    apply: require('../../index')
  }], '/')
  service.run('build', {})

  const calls = spyGetAllEntries.mock.calls
  expect(calls[0][0]).toEqual({ name: pkg.name, version: pkg.version })
  expect(calls[0][1]).toEqual({ entry: 'src/index.js', dest: '/' })
  expect(calls[0][2]).toMatch(`${pkg.name} v${pkg.version}`)
  expect(calls[0][3]).toEqual({ lang: 'js', config: null, runtime: null, useBabel: true })
})

test('build from typescript codes', () => {
  spyLoadModule.mockReturnValueOnce(pkg)
  spyGetAllEntries.mockReturnValueOnce([])

  const service = createMockService([{
    id: 'typescript',
    apply: () => {}
  }, {
    id: 'vue-cli-plugin-p11n',
    apply: require('../../index')
  }], '/')
  service.run('build', {})

  const calls = spyGetAllEntries.mock.calls
  expect(calls[0][0]).toEqual({ name: pkg.name, version: pkg.version })
  expect(calls[0][1]).toEqual({ entry: 'src/index.ts', dest: '/' })
  expect(calls[0][2]).toMatch(`${pkg.name} v${pkg.version}`)
  expect(calls[0][3]).toEqual({ lang: 'ts', config: '/tsconfig.json', runtime: '/node_modules/typescript', useBabel: false })
})

test('warning build', () => {
  const spyLog = jest.spyOn(console, 'log')
  spyLog.mockImplementation(() => {})
  spyLoadModule.mockReturnValueOnce({}) // package info nothing
  spyGetAllEntries.mockReturnValueOnce([])

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: require('../../index')
  }], '/')
  service.run('build', {})

  expect(spyGetAllEntries).toHaveBeenCalled()
  expect(spyLog).toHaveBeenCalledTimes(4)

  spyLog.mockClear()
})