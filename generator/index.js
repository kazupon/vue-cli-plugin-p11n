const debug = require('debug')('vue-cli-plugin-p11n:generator')
const {
  classify,
  readFile,
  writeFile,
  loadPackage,
  normalizeVersion,
  normalizeAuthor,
  stripNamespaceIfExists
} = require('../lib/utils')
const { log } = require(require.resolve('@vue/cli-shared-utils'))

module.exports = (api, options, rootOptions) => {
  debug('options', options)
  debug('rootOptions', rootOptions)
  let { projectName } = rootOptions
  projectName = stripNamespaceIfExists(projectName)
  // basic extending
  api.extendPackage({
    scripts: {
      'demo': 'vue-cli-service demo',
      'docs': 'npm run docs:serve',
      'docs:serve': 'vue-cli-service docs --mode serve',
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

  let { version, author } = loadPackage(api)
  version = normalizeVersion(version)
  author = normalizeAuthor(author)

  const lang = api.hasPlugin('typescript') ? 'ts' : 'js'
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
    replacePackage(api, classStyle)
    replaceAppFile(api)
    repleaceGitIgnore(api)
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

function replacePackage (api, classStyle) {
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
  // TODO: should be extract template
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
  // TODO: should be extract template
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
