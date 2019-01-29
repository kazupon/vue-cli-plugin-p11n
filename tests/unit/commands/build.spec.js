const path = require('path')
const { createMockService } = require('../../helper')

let spyLoadModule
const pkg = {
  name: 'vue-i18n',
  author: 'kazuya kawaguchi',
  version: '0.0.1',
  license: 'MIT'
}
const cwd = process.cwd()

beforeEach(() => {
  jest.mock('fs', () => {
    const fs = require('memfs').fs
    fs.existsSync = () => true
    return fs
  })
  jest.mock('../../../lib/build/entry', () => {})
  jest.mock('../../../lib/build/bundle', () => {})
  jest.mock('../../../lib/build/service')
  const utils = require('../../../lib/utils')
  spyLoadModule = jest.spyOn(utils, 'loadPackage')
})

afterEach(() => {
  spyLoadModule.mockClear()
  jest.clearAllMocks()
  jest.unmock('../../../lib/build/service')
  jest.unmock('../../../lib/build/bundle')
  jest.unmock('../../../lib/build/entry')
  jest.unmock('fs')
})

test('build from javascript codes', () => {
  spyLoadModule.mockReturnValueOnce(pkg)
  const mockBuild = require('../../../lib/build/service')

  const service = createMockService([{
    id: 'babel',
    apply: () => {}
  }, {
    id: 'vue-cli-plugin-p11n',
    apply: api => {
      const build = require('../../../lib/build/command')(api)
      api.registerCommand('build', build.opts, build.fn)
    }
  }], cwd)
  service.run('build', {})

  const calls = mockBuild.mock.calls
  expect(calls[0][0]).toEqual(pkg)
  expect(calls[0][1]).toEqual({ entry: 'src/index.js', dest: cwd })
  expect(calls[0][2]).toEqual({ lang: 'js', config: null, runtime: null, useBabel: true })
})

test('build from typescript codes', () => {
  spyLoadModule.mockReturnValueOnce(pkg)
  const mockBuild = require('../../../lib/build/service')

  const service = createMockService([{
    id: 'typescript',
    apply: () => {}
  }, {
    id: 'vue-cli-plugin-p11n',
    apply: api => {
      const build = require('../../../lib/build/command')(api)
      api.registerCommand('build', build.opts, build.fn)
    }
  }], cwd)
  service.run('build', {})

  const calls = mockBuild.mock.calls
  expect(calls[0][0]).toEqual(pkg)
  expect(calls[0][1]).toEqual({ entry: 'src/index.ts', dest: cwd })
  expect(calls[0][2]).toEqual({
    lang: 'ts',
    config: path.join(cwd, '/tsconfig.json'),
    runtime: path.join(cwd, '/node_modules/typescript'),
    useBabel: false
  })
})

test('warning build', () => {
  const spyLog = jest.spyOn(console, 'log')
  spyLog.mockImplementation(() => {})
  spyLoadModule.mockReturnValueOnce({}) // package info nothing
  const mockBuild = require('../../../lib/build/service')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: api => {
      const build = require('../../../lib/build/command')(api)
      api.registerCommand('build', build.opts, build.fn)
    }
  }], cwd)
  service.run('build', {})

  expect(mockBuild).toHaveBeenCalled()
  expect(spyLog).toHaveBeenCalledTimes(4)

  spyLog.mockClear()
})