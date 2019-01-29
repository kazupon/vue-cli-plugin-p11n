const path = require('path')
const createTestProject = require('@vue/cli-test-utils/createTestProject')
const Service = require('@vue/cli-service')

async function create (name, presets) {
  const project = await createTestProject(
    name, presets, path.join(process.cwd(), './tests/e2e/projects')
  )

  // mocking...
  const pkg = JSON.parse(await project.read('package.json'))
  pkg.devDependencies['vue-cli-plugin-p11n'] = '../../../..'
  await project.write('package.json', JSON.stringify(pkg, null, 2))
  /*
  jest.mock('@vue/cli-shared-utils')
  const utils = require('@vue/cli-shared-utils')
  utils.loadModule.mockReturnValueOnce(require('./generator'))
  */
  const invoke = require('@vue/cli/lib/invoke')
  await invoke('p11n', {}, project.dir)
  return Promise.resolve(project)
}

function createMockService (plugins = [], context = '/', init = true, mode) {
  const service = new Service(context, {
    plugins,
    useBuiltIn: false
  })
  if (init) {
    service.init(mode)
  }
  return service
}

module.exports = {
  create,
  createMockService
}
