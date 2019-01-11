const Service = require('@vue/cli-service')
const { toPlugin } = require('./utils')

const babelPlugin = toPlugin('@vue/cli-plugin-babel')
const demoConfigPlugin = require('./demoConfigPlugin')

function createService (context, entry) {
  return new Service(context, {
    projectOptions: {
      compiler: true,
    },
    plugins: [
      babelPlugin,
      demoConfigPlugin(context, entry)
    ]
  })
}

module.exports = (context, entry, args) => {
  createService(context, entry).run('serve', args)
}
