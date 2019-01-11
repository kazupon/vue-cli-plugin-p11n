import Vue from 'vue'
import App from '~entry'
import plugin from '../dist/<%= projectName %>.esm.js'

Vue.config.productionTip = false

Vue.use(plugin)

new Vue({
  // NOTE: if you need to inject as option, you can set here!
  render: h => h(App)
}).$mount('#app')
