const debug = require('debug')('vue-cli-plugin-p11n:service')

module.exports = (api, options) => {
  debug('options', options)

  const build = require('./lib/build/command')(api)
  api.registerCommand('build', build.opts, build.fn)

  const demo = require('./lib/demo/command')(api)
  api.registerCommand('demo', demo.opts, demo.fn)

  const docs = require('./lib/docs/command')(api)
  api.registerCommand('docs', docs.opts, docs.fn)
}
