const debug = require('debug')('vue-cli-plugin-p11n:service')

module.exports = (api, options) => {
  debug('options', options)

  api.registerCommand('build', {
    description: 'build for production with rollup',
    usage: 'vue-cli-service build [options] [entry|pattern]',
    options: {
    }
  }, async args => {
    const { existsSync, mkdirSync } = require('fs')

    if (!existsSync('dist')) {
      mkdirSync('dist')
    }

    const entries = getAllEntries()
    bundle(entries)
  })
}

function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

const classifyRE = /(?:^|[-_\/])(\w)/g
function classify (str) {
  return str.replace(classifyRE, toUpper)
}

function makeEntries (entryPath, moduleName, packageName, banner) {
  const path = require('path')
  const resolve = _path => path.resolve(process.cwd(), _path)

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

function genConfig (opts, moduleName, version) {
  const babel = require('rollup-plugin-babel')
  const cjs = require('rollup-plugin-commonjs')
  const node = require('rollup-plugin-node-resolve')
  const replace = require('rollup-plugin-replace')

  const config = {
    input: opts.entry,
    output: {
      file: opts.dest,
      name: moduleName,
      format: opts.format,
      banner: opts.banner,
      sourcemap: true,
    },
    plugins: [
      babel({
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs'],
        runtimeHelpers: true,
      }),
      node(),
      cjs()
    ]
  }

  const replacePluginOptions = { '__VERSION__': version }
  if (opts.env) {
    replacePluginOptions['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  config.plugins.push(replace(replacePluginOptions))

  return config
}

function getAllEntries () {
  const path = require('path')
  const { version, name } = require(path.join(process.cwd(), './package.json'))
  const moduleName = classify(name)
  const entries = makeEntries('src/lib.js', moduleName, name, '')
  return Object.keys(entries).map(name => genConfig(entries[name], moduleName, version))
}


function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

function bundle (entries) {
  let built = 0
  const total = entries.length
  const next = () => {
    bundleEntry(entries[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }
  next()
}

function bundleEntry (config) {
  const rollup = require('rollup')
  const uglify = require('uglify-js')

  const output = config.output
  const { file, banner } = output
  const isProd = /min\.js$/.test(file)
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ code }) => {
      if (isProd) {
        const minified = (banner ? banner + '\n' : '') + uglify.minify(code, {
          fromString: true,
          output: { ascii_only: true },
          compress: { pure_funcs: ['makeMap'] }
        }).code
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}

function write (dest, code, zip) {
  const fs = require('fs')
  const path = require('path')
  const zlib = require('zlib')

  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) { return reject(err) }
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) { return reject(err) }
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}