jest.setTimeout(10 * 60 * 1000)

const path = require('path')
const { create } = require('../helper')

test(`javascript project`, async () => {
  const projectName = `vue-i18n-js`
  const plugins = {
    '@vue/cli-plugin-babel': {},
  }
  plugins[`@vue/cli-plugin-unit-mocha`] = {}
  const project = await create(projectName, { plugins })

  const targetService = path.join(
    project.dir,
    './node_modules/@vue/cli-service/bin/vue-cli-service.js'
  )
  await project.run(`${targetService} build`)

  const distFiles = [
    `dist/${projectName}.common.js`,
    `dist/${projectName}.umd.min.js`,
    `dist/${projectName}.umd.js`,
    `dist/${projectName}.esm.js`
  ]
  distFiles.forEach(file => { expect(project.has(file)).toBe(true) })

  const pkg = JSON.parse(await project.read('package.json') )
  expect(pkg.private).toBeUndefined()
  expect(pkg.dependencies['vue']).toBeUndefined()
  expect(pkg.devDependencies['vue']).not.toBeUndefined()
})
