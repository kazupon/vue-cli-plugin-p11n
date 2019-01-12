const path = require('path')

module.exports = (context, entry, lang) => {
  return {
    id: '@kazupon/cli-demo-config', // TODO: ID 
    apply: api => {
      api.chainWebpack(config => {
        if (/\.vue$/.test(entry)) {
          config.resolve
            .alias
              .set('~entry', path.resolve(path.join(context, './demo', entry)))
        }

        // set entry
        config
          .entry('app')
            .clear()
            .add(path.resolve(context, `./demo/main.${lang}`))

        if (lang === 'ts') {
          config.resolve
            .extensions
            .merge(['.ts', '.tsx'])
        
          const tsRule = config.module.rule('ts').test(/\.ts$/)
          const tsxRule = config.module.rule('tsx').test(/\.tsx$/)
    
          // add a loader to both *.ts & vue<lang="ts">
          const addLoader = ({ loader, options }) => {
            tsRule.use(loader).loader(loader).options(options)
            tsxRule.use(loader).loader(loader).options(options)
          }
      
          addLoader({
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ['\\.vue$']
            }
          })
          // make sure to append TSX suffix
          tsxRule.use('ts-loader').loader('ts-loader').tap(options => {
            options = Object.assign({}, options)
            delete options.appendTsSuffixTo
            options.appendTsxSuffixTo = ['\\.vue$']
            return options
          })
        }

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