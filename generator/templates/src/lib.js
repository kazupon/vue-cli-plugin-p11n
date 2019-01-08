const version = '__VERSION__'

const install = Vue => {
  Vue.prototype.$add = (a, b) => {
    return a + b
  }
}

const plugin = {
  install,
  version
}

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
