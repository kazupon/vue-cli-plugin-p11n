const debug = require('debug')('vue-cli-plugin-p11n:generator')

module.exports = (api, options, rootOptions) => {
  debug('options', options)
  debug('rootOptions', rootOptions)

  api.onCreateComplete(() => {
    debug('onCreateComplete called')
  })

  api.postProcessFiles(files => {
    debug('postProcessFiles called')
  })
}
