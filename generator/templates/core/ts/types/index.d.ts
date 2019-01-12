/*
 * NOTE:
 *   if you need to define typing of your plugin
 */

// NOTE: default plugin typings
type PluginAddFunction = (a: number, b: number) => number

// NOTE: if you need to extend Vue contstructor, you can extend it in here.
declare module 'vue/types/vue' {
  interface Vue {
    $add: PluginAddFunction
  }
}

// NOTE: if you don't need, you should remove!
export {
  PluginAddFunction
}
