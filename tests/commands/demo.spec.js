const { createMockService } = require('../helper')

let existsSyncSpy
beforeEach(() => {
  jest.mock('../../lib/demo')
  jest.mock('fs', () => require('memfs').fs)
  const fs = require('fs')
  existsSyncSpy = jest.spyOn(fs, 'existsSync')
})

afterEach(() => {
  existsSyncSpy.mockClear()
  jest.clearAllMocks()
  jest.unmock('../../lib/demo')
  jest.unmock('fs')
})

test('demo javascript', () => {
  existsSyncSpy.mockReturnValueOnce(true)
  const mockDemo = require('../../lib/demo')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: require('../../index')
  }], '/')
  service.run('demo', { _: ['demo', 'Demo.vue']})

  const calls = mockDemo.mock.calls
  expect(calls[0][0]).toMatch('/')
  expect(calls[0][1]).toMatch('Demo.vue')
  expect(calls[0][2]).toMatch('js')
  expect(calls[0][3]).toEqual({ open: true })
})

test('demo typescript', () => {
  existsSyncSpy.mockReturnValueOnce(true)
  const mockDemo = require('../../lib/demo')

  const service = createMockService([{
    id: 'typescript',
    apply: () => {}
  }, {
    id: 'vue-cli-plugin-p11n',
    apply: require('../../index')
  }], '/')
  service.run('demo', { _: ['demo', 'Demo.vue']})

  const calls = mockDemo.mock.calls
  expect(calls[0][2]).toMatch('ts')
})

test('demo failed due to not exit demo entry', () => {
  const logSpy = jest.spyOn(console, 'log')
  logSpy.mockImplementation(() => {})
  existsSyncSpy.mockReturnValueOnce(false)
  const mockDemo = require('../../lib/demo')
  
  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: require('../../index')
  }], '/')
  service.run('demo', { _: ['demo', 'Foo.vue']})
  
  expect(mockDemo).not.toHaveBeenCalled()
  expect(logSpy).toHaveBeenCalled()

  logSpy.mockClear()
})