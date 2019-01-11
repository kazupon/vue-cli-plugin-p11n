const path = require('path')
const resolve = require('resolve')

module.exports = (context, entry) => {
  return {
    id: '@kazupon/cli-demo-config', // TODO: ID 
    apply: (api, options) => {
      api.chainWebpack(config => {
        if (/\.vue$/.test(entry)) {
          config.resolve
            .alias
              .set('~entry', path.resolve(path.join(context, './demo', entry)))
        }

        // ensure core-js polyfills can be imported
        config.resolve
          .alias
            .set('core-js', path.dirname(require.resolve('core-js')))
            .set('regenerator-runtime', path.dirname(require.resolve('regenerator-runtime')))

        // ensure loaders can be resolved properly
        // this is done by locating vue's install location (which is a
        // dependency of the global service)
        const modulePath = path.resolve(require.resolve('vue'), '../../../')
        config.resolveLoader
          .modules
            .add(modulePath)

        // add resolve alias for vue and vue-hot-reload-api
        // but prioritize versions installed locally.
        try {
          resolve.sync('vue', { basedir: context })
        } catch (e) {
          const vuePath = path.dirname(require.resolve('vue'))
          config.resolve.alias
            .set('vue$', `${vuePath}/${options.compiler ? `vue.esm.js` : `vue.runtime.esm.js`}`)
        }

        try {
          resolve.sync('vue-hot-reload-api', { basedir: context })
        } catch (e) {
          config.resolve.alias
            .set('vue-hot-reload-api', require.resolve('vue-hot-reload-api'))
        }

        // set entry
        config
          .entry('app')
            .clear()
            .add(path.resolve(context, './demo/main.js'))

        const babelOptions = {
          presets: [require.resolve('@vue/babel-preset-app')]
        }

        // set inline babel options
        config.module
          .rule('js')
            .include
              .clear()
              .end()
            .exclude
              .add(/node_modules/)
              .add(/@vue\/cli-service/)
              .end()
            .uses
              .delete('cache-loader')
              .end()
            .use('babel-loader')
              .tap(() => babelOptions)

        // set html plugin template
        config
          .plugin('html')
            .tap(args => {
              args[0].template = path.resolve(context, './demo/index.html')
              return args
            })

        config.plugins.delete('copy')
      })
    }
  }
}