const debug = require('debug')('vue-cli-plugin-p11n:service')

module.exports = (api, options) => {
  debug('options', options)

  const commands = ['build', 'demo', 'docs']
  commands.forEach(command => {
    const target = require(`./lib/${command}/command`)(api)
    api.registerCommand(command, target.opts, target.fn)
  })
}
