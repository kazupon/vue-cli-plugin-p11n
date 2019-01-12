<template>
  <div class="demo">
    <h1>Plugin Demo</h1>
    <p>add: {{ a }} + {{ b }} = {{ $add(a, b) }}</p>
  </div>
</template>

<script lang="ts">
<%_ if (!classStyle) { _%>
import Vue from 'vue'

export default Vue.extend({
  name: 'demo',
  data: () => ({ a: 1, b: 1 })
})
<%_ } else { _%>
import { Component, Vue } from 'vue-property-decorator'

@Component({ 
})
export default class Demo extends Vue {
  a = 1
  b = 1
}
<%_ } _%>
</script>

<style>

</style>
