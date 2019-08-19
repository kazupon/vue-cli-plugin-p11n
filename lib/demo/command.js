const chalk = require('chalk')
const { existsSync } = require('fs')
const path = require('path')
const service = require('./service')

module.exports = api => ({
  opts: {
    description: 'demo of plugin',
    usage: 'vue-cli-service demo [options] entry',
    options: {
      '--mode': 'specify `serve` or `build` mode (default: `serve`)'
    }
  },
  fn: async args => {
    const context = api.getCwd()
    const entry = args._[0] || ''
    const lang = api.hasPlugin('typescript') ? 'ts' : 'js'
    const open = true

    const command = args.mode || 'serve'
    const customArgs = { open }
    if (command === 'build') {
      customArgs.dest = './demo/dist'
    }

    // TODO: should be checked wheter dist files generating

    if (!existsSync(path.join(context, './demo', entry))) {
      console.log(chalk.red(`Demo file ${chalk.yellow(entry)} does not exist.`))
      return
    }

    return service(context, entry, lang, customArgs, command)
  }
})
