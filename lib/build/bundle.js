const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const uglify = require('uglify-js')
const chalk = require('chalk')
const rollup = require('rollup')
const { error, info, log, done } = require('@vue/cli-shared-utils')

const getSize = code => (code.length / 1024).toFixed(2) + 'kb'

function bundle (entries) {
  let built = 0
  const total = entries.length
  const next = () => {
    bundleEntry(entries[built]).then(() => {
      built++
      if (built < total) {
        next()
      } else {
        log()
        done(`Build complete. The ${chalk.cyan('dist')} directory is ready to be deployed.`)
      }
    }).catch(error)
  }

  log('Building for production mode as plugin ...')
  next()
}

function bundleEntry (config) {
  const output = config.output
  const { file, banner } = output
  const isProd = /min\.js$/.test(file)
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ output: [{ code }] }) => {
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
  return new Promise((resolve, reject) => {
    const report = extra => {
      info(chalk.blue.bold(path.relative(process.cwd(), dest) + ' ' + getSize(code) + (extra || '')))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) { return reject(err) }
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) { return reject(err) }
          report(` (gzipped: ${getSize(zipped)})`)
        })
      } else {
        report()
      }
    })
  })
}

module.exports = bundle
