const path = require('path')
const service = require('./service')

module.exports = api => ({
  opts: {
    description: 'documentation for plugin',
    usage: 'vue-cli-service docs [options]',
    options: {
      '--mode': 'specify `serve` or `build` mode (default: `serve`)'
    }
  },
  fn: async args => {
    if (!args.mode || args.mode !== 'build') {
      args.mode = 'dev'
    }
    args.mode = args.mode || 'serve'
    const bin = require.resolve(path.join(api.getCwd(), './node_modules/.bin/vuepress'))
    return service(bin, args)
  }
})
