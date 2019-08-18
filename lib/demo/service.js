const Service = require(require.resolve('@vue/cli-service'))
const plugin = require('./plugin')

function createService (context, entry, lang) {
  return new Service(context, {
    plugins: [
      plugin(context, entry, lang)
    ]
  })
}

module.exports = (context, entry, lang, args, command) => {
  return createService(context, entry, lang).run(command, args)
}
