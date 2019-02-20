const fs = require('fs')
const chalk = require('chalk')
const { log } = require(require.resolve('@vue/cli-shared-utils'))

const classifyRE = /(?:^|[-_\/])(\w)/g

const toUpper = (_, c) => c ? c.toUpperCase() : ''
const classify = str => str.replace(classifyRE, toUpper)
const isUndef = v => v === undefined || v === null
const isDef = v => v !== undefined && v !== null
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

function loadPackage (api) {
  let pkg = {}
  try {
    pkg = require(api.resolve('package.json'))
  } catch (e) {
    console.error('loadPackage error', e.message)
  }
  return pkg
}

function normalizeModuleName (name) {
  if (!isDef(name)) {
    log(`⚠️  ${chalk.yellow.bold('name')} is undefined in ${chalk.yellow.bold('package.json')}`)
  }
  return stripNamespaceIfExists(name)
}

function normalizeLicense (license) {
  if (!isDef(license)) {
    log(`⚠️  ${chalk.yellow.bold('license')} is undefined in ${chalk.yellow.bold('package.json')}`)
  }
  return license
}

function normalizeVersion (version) {
  if (!isDef(version)) {
    log(`⚠️  ${chalk.yellow.bold('version')} is undefined in ${chalk.yellow.bold('package.json')}`)
  }
  return version
}

function normalizeAuthor (_author) {
  let author = ''
  if (typeof(_author) === 'string') {
    author = _author
  } else if (isObject(_author)) {
    author = _author.name
  } else {
    log(`⚠️  ${chalk.yellow.bold('author')} is undefined in ${chalk.yellow.bold('package.json')}`)
  }
  return author
}

function stripNamespaceIfExists (name) {
  if (!isDef(name) || name.indexOf('@') < 0) {
    return name
  }
  return name.split('/').slice(-1).join('')
}

module.exports = {
  isUndef,
  isObject,
  classify,
  readFile,
  writeFile,
  loadPackage,
  normalizeModuleName,
  normalizeLicense,
  normalizeVersion,
  normalizeAuthor,
  stripNamespaceIfExists
}
