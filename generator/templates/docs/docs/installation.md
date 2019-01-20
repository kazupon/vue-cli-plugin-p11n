# Installation

## Direct Download / CDN

https://unpkg.com/<%= repoName %>/dist/<%= distName %> 

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/<%= repoName %>@{{ $version }}/dist/<%= distName %>.js
 
Include <%= moduleName %> after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/<%= repoName %>/dist/<%= distName %>.js"></script>
```

## NPM

```sh
$ npm install <%= repoName %>
```

## Yarn

```sh
$ yarn add <%= repoName %>
```

When used with a module system, you must explicitly install the `<%= repoName %>` via `Vue.use()`:

```javascript
import Vue from 'vue'
import <%= moduleName %> from '<%= repoName %>'

Vue.use(<%= moduleName %>)
```

You don't need to do this when using global script tags.

<%_ if (!author) { _%>
## Dev Build

You will have to clone directly from GitHub and build `<%= repoName %>` yourself if
you want to use the latest dev build.

```sh
$ git clone https://github.com/<%= author %>/<%= repoName %>.git node_modules/<%= repoName %>
$ cd node_modules/<%= repoName %>
$ npm install
$ npm run build
```

<%_ } _%>
