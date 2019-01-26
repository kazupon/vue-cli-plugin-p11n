const { createMockService } = require('../helper')

beforeEach(() => {
  jest.mock('execa')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.unmock('execa')
})

test('docs default', () => {
  const mockExeca = require('execa')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: require('../../index')
  }])
  service.run('docs', {})

  const calls = mockExeca.mock.calls
  expect(calls[0][0]).toMatch('node_modules/vuepress/vuepress.js')
  expect(calls[0][1][0]).toMatch('serve')
  expect(calls[0][1][1]).toMatch('docs')
  expect(calls[0][2]).toEqual({ stdio: 'inherit' })
})

test('docs serve', () => {
  const mockExeca = require('execa')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: require('../../index')
  }])
  service.run('docs', { mode: 'serve' })

  const calls = mockExeca.mock.calls
  expect(calls[0][1][0]).toMatch('serve')
})

test('docs build', () => {
  const mockExeca = require('execa')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: require('../../index')
  }])
  service.run('docs', { mode: 'build' })

  const calls = mockExeca.mock.calls
  expect(calls[0][1][0]).toMatch('build')
})