const cliServicePath = require.resolve('@vue/cli-service')
const demoPluginPath = '../../../lib/demo/plugin'

beforeEach(() => {
  jest.mock(cliServicePath)
  jest.mock(demoPluginPath)
  jest.mock()
})

afterEach(() => {
  jest.clearAllMocks()
  jest.unmock(demoPluginPath)
  jest.unmock(cliServicePath)
})

test('demo', () => {
  const service = require('../../../lib/demo/service')
  const mockPlugin = require('../../../lib/demo/plugin')
  const mockCliService = require(cliServicePath)

  service('/', '/entry', 'ts', { mode: 'build' }, 'serve')

  const mockCliServiceCalls = mockCliService.mock.calls
  expect(mockCliServiceCalls[0][0]).toMatch('/')

  const mockPluginCalls = mockPlugin.mock.calls
  expect(mockPluginCalls[0][0]).toMatch('/')
  expect(mockPluginCalls[0][1]).toMatch('/entry')
  expect(mockPluginCalls[0][2]).toMatch('ts')

  const instance = mockCliService.mock.instances[0]
  expect(instance.run.mock.calls).toEqual([['serve', { mode: 'build' }]])
})
