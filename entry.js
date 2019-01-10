const path = require('path')
const babel = require('rollup-plugin-babel')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')

const classifyRE = /(?:^|[-_\/])(\w)/g
const toUppser = (_, c) => c ? c.toUpperCase() : ''
const classify = str => str.replace(classifyRE, toUppser)

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
  
function buildinPlugins (version, env) {
  const plugins = [
    babel({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs'],
      runtimeHelpers: true,
    }),
    node(),
    cjs()
  ]

  const replaceOptions = { '__VERSION__': version }
  if (env) {
    replaceOptions['process.env.NODE_ENV'] = JSON.stringify(env)
  }
  plugins.push(replace(replaceOptions))

  return plugins
}

function generateConfig (options, moduleName, version) {
  const plugins = buildinPlugins(version, options.env)
  return { 
    input: options.entry,
    output: {
      file: options.dest,
      name: moduleName,
      format: options.format,
      banner: options.banner
      // TODO: sourcemap: 'inline'
    },
    plugins
  }
}

function getAllEntries ({ name, version }, { entry, dest }, banner) {
  const moduleName = classify(name)
  const entries = makeEntries(entry, dest, moduleName, name, banner)
  return Object.keys(entries).map(name => generateConfig(entries[name], moduleName, version))
}

module.exports = getAllEntries
