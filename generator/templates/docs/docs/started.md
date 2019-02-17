# Getting Started

> We will be using [ES2015](https://github.com/lukehoban/es6features) in the code samples in the guide.


## HTML

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/<%= repoName %>/dist/<%= distName %>.js"></script>

<div id="#app">
  <!-- NOTE: here the outputs -->
</div>
```

## JavaScript

```javascript
// If using a module system (e.g. via Vue CLI), import Vue and <%= moduleName %> and then call Vue.use(<%= moduleName %>).
// import Vue from 'vue'
// import <%= moduleName %> from '<%= repoName %>'
// 
// Vue.use(<%= moduleName %>)

// NOTE: here the example

// Now the app has started!
new Vue({ }).$mount('#app')
```

Output the following:

```html
<div id="#app">
  <!-- NOTE: here the outputs -->
</div>
```
