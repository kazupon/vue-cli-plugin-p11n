const { createMockService } = require('../../helper')

let existsSyncSpy
beforeEach(() => {
  jest.mock('../../../lib/demo/service')
  jest.mock('fs', () => require('memfs').fs)
  const fs = require('fs')
  existsSyncSpy = jest.spyOn(fs, 'existsSync')
})

afterEach(() => {
  existsSyncSpy.mockClear()
  jest.clearAllMocks()
  jest.unmock('../../../lib/demo/service')
  jest.unmock('fs')
})

test('demo javascript', () => {
  existsSyncSpy.mockReturnValueOnce(true)
  const mockDemo = require('../../../lib/demo/service')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: api => {
      const demo = require('../../../lib/demo/command')(api)
      api.registerCommand('demo', demo.opts, demo.fn)
    }
  }], process.cwd())
  service.run('demo', { _: ['demo', 'Demo.vue']})

  const calls = mockDemo.mock.calls
  expect(calls[0][0]).toMatch('/')
  expect(calls[0][1]).toMatch('Demo.vue')
  expect(calls[0][2]).toMatch('js')
  expect(calls[0][3]).toEqual({ open: true })
  expect(calls[0][4]).toMatch('serve')
})

test('demo typescript', () => {
  existsSyncSpy.mockReturnValueOnce(true)
  const mockDemo = require('../../../lib/demo/service')

  const service = createMockService([{
    id: 'typescript',
    apply: () => {}
  }, {
    id: 'vue-cli-plugin-p11n',
    apply: api => {
      const demo = require('../../../lib/demo/command')(api)
      api.registerCommand('demo', demo.opts, demo.fn)
    }
  }], process.cwd())
  service.run('demo', { _: ['demo', 'Demo.vue']})

  const calls = mockDemo.mock.calls
  expect(calls[0][2]).toMatch('ts')
})

test('demo failed due to not exit demo entry', () => {
  const logSpy = jest.spyOn(console, 'log')
  logSpy.mockImplementation(() => {})
  existsSyncSpy.mockReturnValueOnce(false)
  const mockDemo = require('../../../lib/demo/service')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: api => {
      const demo = require('../../../lib/demo/command')(api)
      api.registerCommand('demo', demo.opts, demo.fn)
    }
  }], process.cwd())
  service.run('demo', { _: ['demo', 'Foo.vue']})

  expect(mockDemo).not.toHaveBeenCalled()
  expect(logSpy).toHaveBeenCalled()

  logSpy.mockClear()
})

test('demo --mode build', () => {
  existsSyncSpy.mockReturnValueOnce(true)
  const mockDemo = require('../../../lib/demo/service')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: api => {
      const demo = require('../../../lib/demo/command')(api)
      api.registerCommand('demo', demo.opts, demo.fn)
    }
  }], process.cwd())
  service.run('demo', { _: ['demo', 'Demo.vue'], mode: 'build' })

  const calls = mockDemo.mock.calls
  expect(calls[0][0]).toMatch('/')
  expect(calls[0][1]).toMatch('Demo.vue')
  expect(calls[0][2]).toMatch('js')
  expect(calls[0][3]).toEqual({ open: true, dest: './demo/dist' })
  expect(calls[0][4]).toMatch('build')
})
