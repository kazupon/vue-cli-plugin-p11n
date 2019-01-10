const debug = require('debug')('vue-cli-plugin-p11n:generator')
const { readFile, writeFile } = require('../utils')

module.exports = (api, options, rootOptions) => {
  debug('options', options)
  debug('rootOptions', rootOptions)
  const { projectName } = rootOptions

  // basic extending
  api.extendPackage({
    sideeffects: false,
    main: `dist/${projectName}.common.js`,
    jsdelivr: `dist/${projectName}.umd.min.js`,
    module: `dist/${projectName}.esm.js`,
    unpkg: `dist/${projectName}.umd.min.js`,
    files: [
      `dist/${projectName}.common.js`,
      `dist/${projectName}.umd.min.js`,
      `dist/${projectName}.umd.js`,
      `dist/${projectName}.esm.js`,
      'src'
    ]
  })

  if (api.hasPlugin('typescript')) {
    applyTypeScript(api)
  }

  const lang = api.hasPlugin('typescript') ? 'ts' : 'js'
  api.render(`./templates/${lang}`, options)

  api.onCreateComplete(() => {
    debug('onCreateComplete called')
    const pkgPath = api.resolve('package.json')
    const pkg = JSON.parse(readFile(pkgPath))
    pkg.scripts['build'] = `vue-cli-service build --lang ${lang}`
    writeFile(pkgPath, JSON.stringify(pkg, null, 2))
  })

  api.postProcessFiles(files => {
    debug('postProcessFiles called')
  })
}

function applyTypeScript (api) {
  api.extendPackage({
    types: 'types/index.d.ts',
    files: [
      'types/index.d.ts'
    ]
  })
}