const debug = require('debug')('vue-cli-plugin-p11n:generator')
const chalk = require('chalk')
const { isObject, isUndef, classify, readFile, writeFile } = require('../lib/utils')
const { error, warn, log } = require('@vue/cli-shared-utils')

module.exports = (api, options, rootOptions) => {
  debug('options', options)
  debug('rootOptions', rootOptions)
  const { projectName } = rootOptions

  // basic extending
  api.extendPackage({
    scripts: {
      'demo': 'vue-cli-service demo',
      'docs:dev': 'vue-cli-service docs --mode dev',
      'docs:build': 'vue-cli-service docs --mode build'
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
  const version = getVersion(api)
  const author = getAuthor(api)
  const unit = getUnitTest(api)
  const classStyle = isTypeScriptClassStyle(api)

  if (lang === 'ts') {
    applyTypeScript(api, unit)
  }

  const entryFile = lang === 'ts' ? 'src/main.ts' : 'src/main.js'
  api.injectImports(entryFile, `import './plugin'`)

  // TODO: should be refactored variable name ...
  api.render(`./templates/core/${lang}`, { classStyle,  projectName, ...options })
  api.render(`./templates/demo/${lang}`, { classStyle,  projectName, ...options })
  api.render(`./templates/docs/`, {
    ...options,
    author,
    version,
    projectName: classify(projectName),
    moduleName: projectName,
    distName: projectName,
    repoName: projectName
  })
  api.render(`./templates/release/`, {
    author, year: new Date().getFullYear(), ...options
  })

  if (unit) {
    api.render(`./templates/unit/${lang}`, { unit, ...options })
  }

  api.onCreateComplete(() => {
    debug('onCreateComplete called')
    replacePackage(api, lang, classStyle)
    replaceAppFile(api)
    repleaceGitIgnore(api)
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

function getVersion (api) {
  let version = ''
  try {
    const pkgPath = api.resolve('package.json')
    const pkg = require(pkgPath)
    if (!isUndef(pkg.version)) {
      log(`${chalk.yellow.bold('version')} is undefined in ${chalk.yellow.bold('package.json')}`)
    } else {
      version = pkg.version
    }
  } catch (e) {
    error('getVersion error', e.message)
  }
  return version
}

function getAuthor (api) {
  let author = ''
  try {
    const pkgPath = api.resolve('package.json')
    const pkg = require(pkgPath)
    if (typeof(pkg.author) === 'string') {
      author = pkg.author
    } else if (isObject(pkg.author)) {
      author = pkg.author.name
    } else {
      log(`${chalk.yellow.bold('author')} is undefined in ${chalk.yellow.bold('package.json')}`)
    }
  } catch (e) {
    error('getAuthor error', e.message)
  }
  return author
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

function repleaceGitIgnore (api) {
  const ignorePath = api.resolve('.gitignore')
  writeFile(ignorePath, `.DS_Store
node_modules
public
dist/*.gz
dist/*.map
coverage
docs/.vuepress/dist

# local env files
.env.local
.env.*.local

# related test files
/tests/e2e/reports
/tests/e2e/videos
/tests/e2e/screenshots

# editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw*
  `)
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
