const execa = require('execa')

module.exports = (bin, args) => {
  const options = {
    stdio: 'inherit'
  }
  return execa(bin, [args.mode], options)
}
