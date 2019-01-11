jest.setTimeout(1200000)

const path = require('path')
const { create } = require('./helper')

// testing for unit test framework
const units = ['mocha', 'jest']
units.forEach(unit => {
  // for basic javascript project
  test(`${unit} project`, async () => {
    const projectName = `vue-i18n-${unit}`
    const plugins = {
      '@vue/cli-plugin-babel': {},
    }
    plugins[`@vue/cli-plugin-unit-${unit}`] = {}
    const project = await create(projectName, { plugins })
    expect(project.has('tests/unit/plugin.spec.js')).toBe(true)
  
    const targetService = path.join(
      project.dir,
      './node_modules/@vue/cli-service/bin/vue-cli-service.js'
    )
    await project.run(`${targetService} test:unit`)
  })

  // for typescript
  test.skip(`${unit} for typescript`, async () => {
    const projectName = `vue-i18n-${unit}-typescript`
    const plugins = {
      '@vue/cli-plugin-babel': {},
      '@vue/cli-plugin-typescript': {}
    }
    plugins[`@vue/cli-plugin-unit-${unit}`] = {}
    const project = await create(projectName, { plugins })
    expect(project.has('tests/unit/plugin.spec.ts')).toBe(true)
 
    const targetService = path.join(
      project.dir,
      './node_modules/@vue/cli-service/bin/vue-cli-service.js'
    )
    await project.run(`${targetService} test:unit`)
  })
})
