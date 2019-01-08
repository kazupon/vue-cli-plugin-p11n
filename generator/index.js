const debug = require('debug')('vue-cli-plugin-p11n:generator')

module.exports = (api, options, rootOptions) => {
  debug('options', options)
  debug('rootOptions', rootOptions)
  const { projectName } = rootOptions

  api.extendPackage({
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
      //"types",
      'src'
    ],
    /*
    devDependencies: {
      'rollup': '^0.67.3',
      'rollup-plugin-babel': '^4.0.3',
      'rollup-plugin-commonjs': '^9.2.0',
      'rollup-plugin-node-resolve': '^3.4.0',
      'rollup-plugin-replace': '^2.1.0',
      'uglify-js': '^2.7.5'
    }*/
  })

  api.render('./templates', options)

  api.onCreateComplete(() => {
    debug('onCreateComplete called')
  })

  api.postProcessFiles(files => {
    debug('postProcessFiles called')
  })
}
