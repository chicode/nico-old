<template>
  <div class="root">
    <button @click="$store.commit('run')">run code</button>
    <ul>
      <li v-for="view in views" :key="view" @click="changeView(view)">{{ view }}</li>
    </ul>
    {{ $store.state.view }}
    <!-- https://vuejs.org/v2/guide/components.html#Dynamic-Components -->
    <keep-alive>
      <component :is="$store.state.view"></component>
    </keep-alive>
  </div>
</template>

<script>
import * as viewComponents from '@/views'

export default {
  name: 'app',
  data: function () {
    return {
      views: Object.keys(viewComponents),
    }
  },
  components: {
    ...viewComponents,
  },
  methods: {
    changeView (view) {
      this.$store.commit('changeView', { view })
    },
  },
}
</script>

<style lang="stylus">
html, body, .root {
  height: 100%;
}
</style>
