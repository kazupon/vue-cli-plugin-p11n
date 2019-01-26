const execa = require('execa')

module.exports = (bin, args) => {
  return execa(bin, [args.mode, 'docs'], { stdio: 'inherit' })
}