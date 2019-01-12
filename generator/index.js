const debug = require('debug')('vue-cli-plugin-p11n:generator')
const { readFile, writeFile } = require('../lib/utils')

module.exports = (api, options, rootOptions) => {
  debug('options', options)
  debug('rootOptions', rootOptions)
  const { projectName } = rootOptions

  // basic extending
  api.extendPackage({
    scripts: {
      demo: 'vue-cli-service demo'
    },
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

  const lang = api.hasPlugin('typescript') ? 'ts' : 'js'
  const unit = getUnitTest(api)
  const classStyle = isTypeScriptClassStyle(api)

  if (lang === 'ts') {
    applyTypeScript(api, unit)
  }

  const entryFile = lang === 'ts' ? 'src/main.ts' : 'src/main.js'
  api.injectImports(entryFile, `import './plugin'`)

  api.render(`./templates/core/${lang}`, { classStyle,  projectName, ...options })
  api.render(`./templates/demo/${lang}`, { classStyle,  projectName, ...options })

  if (unit) {
    api.render(`./templates/unit/${lang}`, { unit, ...options })
  }

  api.onCreateComplete(() => {
    debug('onCreateComplete called')
    replacePackage(api, lang, classStyle)
    replaceAppFile(api)
  })

  api.postProcessFiles(files => {
    debug('postProcessFiles called')
  })
}

function applyTypeScript (api, unit) {
  api.extendPackage({
    types: 'types/index.d.ts',
    files: [
      'types/index.d.ts'
    ]
  })
}

function replacePackage (api, lang, classStyle) {
  const pkgPath = api.resolve('package.json')
  const pkg = JSON.parse(readFile(pkgPath))
  delete pkg.private
  pkg.devDependencies.vue = pkg.dependencies.vue
  delete pkg.dependencies.vue
  if (classStyle) {
    pkg.devDependencies['vue-class-component'] = pkg.dependencies['vue-class-component']
    delete pkg.dependencies['vue-class-component']
    pkg.devDependencies['vue-property-decorator'] = pkg.dependencies['vue-property-decorator']
    delete pkg.dependencies['vue-property-decorator']
  }
  writeFile(pkgPath, JSON.stringify(pkg, null, 2))
}

function replaceAppFile (api) {
  const appPath = api.resolve('src/App.vue')
  const appFile = readFile(appPath)
  const newAppFile = appFile.replace(/^<template>[^]+<\/script>/, `<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>Welcome to Your Plugin in Vue.js</h1>
    <p>add: 1 + 1 = {{ $add(1, 1) }}</p>
  </div>
</template>
`).trim()
  writeFile(appPath, newAppFile)
}

function isTypeScriptClassStyle (api) {
  let ret = true
  try {
    const clsPath = api.resolve('./node_modules/vue-class-component/package.json')
    const decoPath = api.resolve('./node_modules/vue-property-decorator/package.json')
    require(clsPath) && require(decoPath)
  } catch (e) {
    ret = false
  }
  return ret
}

function getUnitTest (api) {
  return api.hasPlugin('unit-mocha')
    ? 'mocha'
    : api.hasPlugin('unit-jest')
      ? 'jest'
      : ''
}
