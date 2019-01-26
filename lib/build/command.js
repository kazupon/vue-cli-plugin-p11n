const { existsSync, mkdirSync } = require('fs')
const {
  loadPackage,
  normalizeModuleName,
  normalizeLicense,
  normalizeVersion,
  normalizeAuthor
} = require('../utils')
const service = require('./service')

module.exports = api => ({
  opts: {
    description: 'build for production with rollup',
    usage: 'vue-cli-service build [options] [entry|pattern]',
  },
  fn: async args => {
    let { name, license, version, author } = loadPackage(api)
    name = normalizeModuleName(name)
    license = normalizeLicense(license)
    version = normalizeVersion(version)
    author = normalizeAuthor(author)

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

    return service(
      { name, version, author, license },
      { entry: `src/index.${lang}`, dest: api.getCwd() },
      { lang, config, runtime, useBabel },
      args
    )
  }
})
