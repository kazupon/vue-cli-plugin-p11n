const fs = require('fs')

const classifyRE = /(?:^|[-_\/])(\w)/g

const toUpper = (_, c) => c ? c.toUpperCase() : ''
const classify = str => str.replace(classifyRE, toUpper)
const isUndef = v => v === undefined || v === null
const isObject = obj => obj !== null && typeof obj === 'object'

function readFile (path) {
  let ret = ''
  try {
    ret = fs.readFileSync(path, { encoding: 'utf8' })
  } catch (e) {
    ret = ''
  }
  return ret
}

function writeFile (path, content) {
  let ret = true
  try {
    fs.writeFileSync(path, content, { encoding: 'utf8' })
  } catch (e) {
    ret = false
  }
  return ret
}

module.exports = {
  isUndef,
  isObject,
  classify,
  readFile,
  writeFile
}