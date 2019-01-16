const Service = require(require.resolve('@vue/cli-service'))
const demoConfigPlugin = require('./demoConfigPlugin')

function createService (context, entry, lang) {
  return new Service(context, {
    plugins: [
      demoConfigPlugin(context, entry, lang)
    ]
  })
}

module.exports = (context, entry, lang, args) => {
  createService(context, entry, lang).run('serve', args)
}
