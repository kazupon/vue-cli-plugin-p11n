import { VueConstructor, PluginObject } from 'vue'

declare global {
  interface Window {
    Vue: VueConstructor
  }
}

const version = '__VERSION__'

const install = (Vue: VueConstructor): void => {
  /*
   * NOTE:
   *   if you need to extend Vue contstructor, you can extend it in here.
   */

  Vue.prototype.$add = (a: number, b: number): number => {
    return a + b
  }

  /*
   * NOTE:
   *  somthing implementation here ...
   */
}

const plugin: PluginObject<VueConstructor> = {
  install,
  version
}
export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
