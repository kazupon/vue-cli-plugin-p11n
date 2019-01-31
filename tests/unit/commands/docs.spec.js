const { createMockService } = require('../../helper')

beforeEach(() => {
  jest.mock('../../../lib/docs/service')
})

afterEach(() => {
  jest.clearAllMocks()
  jest.unmock('../../../lib/docs/service')
})

test('docs default', () => {
  const docsService = require('../../../lib/docs/service')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: api => {
      const docs = require('../../../lib/docs/command')(api)
      api.registerCommand('docs', docs.opts, docs.fn)
    }
  }], process.cwd())
  service.run('docs', {})

  const calls = docsService.mock.calls
  expect(calls[0][0]).toMatch(`${process.cwd()}/node_modules/vuepress/cli.js`)
  expect(calls[0][1]).toEqual({ _: [], mode: 'dev' })
})

test('docs serve', () => {
  const docsService = require('../../../lib/docs/service')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: api => {
      const docs = require('../../../lib/docs/command')(api)
      api.registerCommand('docs', docs.opts, docs.fn)
    }
  }], process.cwd())
  service.run('docs', { mode: 'serve' })

  const calls = docsService.mock.calls
  expect(calls[0][1]).toEqual({ _: [], mode: 'dev' })
})

test('docs build', () => {
  const docsService = require('../../../lib/docs/service')

  const service = createMockService([{
    id: 'vue-cli-plugin-p11n',
    apply: api => {
      const docs = require('../../../lib/docs/command')(api)
      api.registerCommand('docs', docs.opts, docs.fn)
    }
  }], process.cwd())
  service.run('docs', { mode: 'build' })

  const calls = docsService.mock.calls
  expect(calls[0][1]).toEqual({ _: [], mode: 'build' })
})
