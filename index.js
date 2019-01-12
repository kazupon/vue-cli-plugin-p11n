const debug = require('debug')('vue-cli-plugin-p11n:service')

module.exports = (api, options) => {
  debug('options', options)

  api.registerCommand('build', {
    description: 'build for production with rollup',
    usage: 'vue-cli-service build [options] [entry|pattern]',
    options: {
    }
  }, async args => {
    const path = require('path')
    const { existsSync, mkdirSync } = require('fs')
    const getAllEntries = require('./entry')
    const bundle = require('./bundle')
    const banner = require('./banner')
    const { version, name, author, license } = require(path.join(process.cwd(), './package.json'))
    const lang = args.lang || 'js'

    if (!existsSync('dist')) {
      mkdirSync('dist')
    }

    let config = null
    let runtime = null
    if (lang === 'ts') {
      config = path.join(process.cwd(), './tsconfig.json')
      runtime = path.join(process.cwd(), './node_modules/typescript')
    }

    const entries = getAllEntries(
      { name, version }, 
      { entry: `src/index.${lang}`, dest: process.cwd() },
      banner({
        name,
        version,
        author: (author && author.name) || '',
        year: new Date().getFullYear(),
        license: license || 'ISC'
      }),
      { lang, config, runtime }
    )
    bundle(entries)
  })

  api.registerCommand('demo', {
    description: 'demo of plugin',
    usage: 'vue-cli-service demo entry'
  }, async args => {
    const path = require('path')
    const { existsSync } = require('fs')
    const chalk = require('chalk')
    const demo = require('./lib/demo')

    const context = api.getCwd()
    const entry = args._[0] || ''
    const lang = api.hasPlugin('typescript') ? 'ts' : 'js'
    const open = true

    // TODO: should be checked wheter dist files generating
    
    if (!existsSync(path.join(context, './demo', entry))) {
      // TODO:
      console.log(chalk.red(`Demo file ${chalk.yellow(entry)} does not exist.`))
      return
    }

    demo(context, entry, lang, { open })
  })
}
