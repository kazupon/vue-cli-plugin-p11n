jest.setTimeout(10 * 60 * 1000)

const path = require('path')
const { create } = require('../helper')

test(`typescript project`, async () => {
  const projectName = `vue-i18n-ts`
  const plugins = {
    '@vue/cli-plugin-babel': {},
    '@vue/cli-plugin-typescript': {
      classComponent: true 
    }
  }
  plugins[`@vue/cli-plugin-unit-jest`] = {}
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
  expect(pkg.dependencies['vue-class-component']).toBeUndefined()
  expect(pkg.devDependencies['vue-class-component']).not.toBeUndefined()
  expect(pkg.dependencies['vue-property-decorator']).toBeUndefined()
  expect(pkg.devDependencies['vue-property-decorator']).not.toBeUndefined()
})
