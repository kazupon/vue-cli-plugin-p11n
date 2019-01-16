const debug = require('debug')('vue-cli-plugin-p11n:service')
const path = require('path')
const { existsSync, mkdirSync } = require('fs')
const chalk = require('chalk')

module.exports = (api, options) => {
  debug('options', options)

  api.registerCommand('build', {
    description: 'build for production with rollup',
    usage: 'vue-cli-service build [options] [entry|pattern]',
    options: {
    }
  }, async args => {
    const { getAllEntries, banner, bundle } = require('./lib/build')

    const { version, name, author, license } = require(api.resolve('./package.json'))
    const lang = api.hasPlugin('typescript') ? 'ts' : 'js'
    const useBabel = api.hasPlugin('babel')

    if (!existsSync('dist')) {
      mkdirSync('dist')
    }

    let config = null
    let runtime = null
    if (lang === 'ts') {
      config = api.resolve('./tsconfig.json')
      runtime = api.resolve('./node_modules/typescript')
    }

    const entries = getAllEntries(
      { name, version }, 
      { entry: `src/index.${lang}`, dest: api.getCwd() },
      banner({
        name,
        version,
        author: (author && author.name) || '',
        year: new Date().getFullYear(),
        license: license || 'ISC'
      }),
      { lang, config, runtime, useBabel }
    )

    bundle(entries)
  })

  api.registerCommand('demo', {
    description: 'demo of plugin',
    usage: 'vue-cli-service demo entry'
  }, async args => {
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

  api.registerCommand('docs', {
    description: 'documentation for plugin',
    usage: 'vue-cli-service docs [options]',
    options: {
      '--mode': '`dev` or `build` mode, default `dev`'
    }
  }, async args => {
    const bin = require.resolve(path.join(__dirname, './node_modules/.bin/vuepress'))
    const docs = require('./lib/docs')
    return docs(bin, args)
  })
}
