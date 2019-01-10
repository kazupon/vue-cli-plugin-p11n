jest.setTimeout(300000)

const path = require('path')
const { create } = require('./helper')
const serve = require('@vue/cli-test-utils/serveWithPuppeteer')

test.skip('serve the basic project', async () => {
  const projectName = 'vue-i18n-serve-basic'
  const project = await create(projectName, {
    plugins: {
      '@vue/cli-plugin-babel': {}
    }
  })

  const targetService = path.join(
    project.dir,
    './node_modules/@vue/cli-service/bin/vue-cli-service.js'
  )

  await serve(
    () => project.run(`${targetService} serve`),
    async ({ helpers }) => {
      const msg = `add: 1 + 1 = 2`
      expect(await helpers.getText('p')).toMatch(msg)
    }
  )
})

test.skip('serve the typescript project', async () => {
  const projectName = 'vue-i18n-serve-typescript'
  const project = await create(projectName, {
    plugins: {
      '@vue/cli-plugin-babel': {},
      '@vue/cli-plugin-typescript': {}
    }
  })

  const targetService = path.join(
    project.dir,
    './node_modules/@vue/cli-service/bin/vue-cli-service.js'
  )

  await serve(
    () => project.run(`${targetService} serve`),
    async ({ helpers }) => {
      const msg = `add: 1 + 1 = 2`
      expect(await helpers.getText('p')).toMatch(msg)
    }
  )
})