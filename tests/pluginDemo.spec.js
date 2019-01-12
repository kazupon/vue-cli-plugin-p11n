jest.setTimeout(6000000)

const path = require('path')
const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')
const { create } = require('./helper')


test('demo generation', async () => {
  const projectName = 'vue-i18n'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: 'p11n',
    apply: require('../generator'),
    options: {}
  }])

  // check pkg
  expect(pkg.scripts.demo).toMatch('vue-cli-service demo')

  // check files
  const demo = files['demo/Demo.vue']
  expect(demo).toMatch(`<h1>Plugin Demo</h1>`)
  const main = files['demo/main.js']
  expect(main).toMatch(`import Vue from 'vue'`)
  const index = files['demo/index.html']
  expect(index).toMatch(`<title>Vue Plugin Demo</title>`)
})

test.skip('demo command', async () => {
  const projectName = 'vue-i18n-demo'
  const project = await create(projectName, {
    plugins: {
      '@vue/cli-plugin-babel': {}
    }
  })

  /*
  const targetService = path.join(
    project.dir,
    './node_modules/@vue/cli-service/bin/vue-cli-service.js'
  )

  await serve(
    () => project.run(`${targetService} demo Demo.vue`),
    async ({ helpers }) => {
      const msg = `add: 1 + 1 = 2`
      expect(await helpers.getText('p')).toMatch(msg)
    }
  )*/
})


test.skip('demo command for typescript class style', async () => {
  const projectName = 'vue-i18n-demo-class'
  const project = await create(projectName, {
    plugins: {
      '@vue/cli-plugin-babel': {},
      '@vue/cli-plugin-typescript': {
        classComponent: true 
      }
    }
  })
})

test('demo command for typescript none class style', async () => {
  const projectName = 'vue-i18n-demo-none-class'
  const project = await create(projectName, {
    plugins: {
      '@vue/cli-plugin-babel': {},
      '@vue/cli-plugin-typescript': {
        classComponent: false
      }
    }
  })
})