beforeEach(() => {
  jest.mock('execa')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.unmock('execa')
})

test('docs', () => {
  const service = require('../../../lib/docs/service')
  const mockExeca = require('execa')

  service('/bin/vuepress', { mode: 'build' })

  const calls = mockExeca.mock.calls
  expect(calls[0][0]).toMatch('/bin/vuepress')
  expect(calls[0][1]).toEqual(['build', 'docs'])
  expect(calls[0][2]).toEqual({ stdio: 'inherit' })
})
