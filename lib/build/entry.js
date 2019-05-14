const path = require('path')
const babel = require('rollup-plugin-babel')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const VuePlugin = require('rollup-plugin-vue')
const typescript = require('rollup-plugin-typescript2')
const { classify } = require('../utils')
// require.main cannot be used because this process is run externally (from vue-cli-service)
const { dependencies } = require(path.resolve(process.cwd(), 'package.json'))
  
function makeEntries (entryPath, destPath, moduleName, packageName, banner) {
  const resolve = _path => path.resolve(destPath, _path)
  return {
    commonjs: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.common.js`),
      format: 'cjs',
      banner
    },
    esm: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.esm.js`),
      format: 'es',
      banner
    },
    production: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.umd.min.js`),
      format: 'umd',
      env: 'production',
      moduleName,
      banner
    },
    development: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.umd.js`),
      format: 'umd',
      env: 'development',
      moduleName,
      banner
    }
  }
}
  
function buildinPlugins (version, env, langInfo) {
  const plugins = [
    node({
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
    cjs()
  ]

  if (langInfo.lang === 'ts') {
    plugins.push(
      typescript({
        typescript: require(langInfo.runtime),
        tsconfig: langInfo.config,
        cacheRoot: './node_modules/.cache/rpt2_cache',
        clean: true
      })
    )
  }
  
  if (langInfo.useBabel) {
    plugins.push(
      VuePlugin()
    )
    plugins.push(
      babel({
        // https://cli.vuejs.org/guide/browser-compatibility.html#polyfills-when-building-as-library-or-web-components
        babelrc: false,
        presets: [[
          '@vue/babel-preset-app', { useBuiltIns: false }
        ]],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs'],
        runtimeHelpers: true
      })
    )
  }

  const replaceOptions = { '__VERSION__': version }
  if (env) {
    replaceOptions['process.env.NODE_ENV'] = JSON.stringify(env)
  }
  plugins.push(replace(replaceOptions))

  return plugins
}

function generateConfig (options, moduleName, version, langInfo) {
  const plugins = buildinPlugins(version, options.env, langInfo)
  return { 
    input: options.entry,
    output: {
      file: options.dest,
      name: moduleName,
      format: options.format,
      banner: options.banner
      // TODO: sourcemap: 'inline'
    },
    // https://github.com/rollup/rollup/issues/1514#issuecomment-320438924
    external: Object.keys(dependencies),
    plugins
  }
}

function getAllEntries ({ name, version }, { entry, dest }, banner, langInfo) {
  const moduleName = classify(name)
  const entries = makeEntries(entry, dest, moduleName, name, banner)
  return Object.keys(entries).map(name => generateConfig(entries[name], moduleName, version, langInfo))
}

module.exports = getAllEntries
