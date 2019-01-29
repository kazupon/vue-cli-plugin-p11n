const pkg = {
  name: 'vue-i18n',
  author: 'kazuya kawaguchi',
  version: '0.0.1',
  license: 'MIT'
}
const cwd = process.cwd()

let spyWriteFile
let spyLog

beforeEach(() => {
  spyLog = jest.spyOn(console, 'log') // due to suppress
  spyLog.mockImplementation(() => {})
  const fs = require('fs')
  spyWriteFile = jest.spyOn(fs, 'writeFile')
  spyWriteFile.mockImplementation((dest, code, fn) => { fn() })
})

afterEach(() => {
  spyWriteFile.mockClear()
  spyLog.mockClear()
  jest.clearAllMocks()
})

test('build', async () => {
  const service = require('../../../lib/build/service')
  await service(pkg, { entry: `${cwd}/generator/templates/core/js/src/index.js`, dest: cwd }, { lang: 'js', config: null, runtime: null, useBabel: true })

  expect(spyWriteFile).toHaveBeenCalledTimes(4)
})