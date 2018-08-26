<template>
  <div class="root">
    <div class="header">
      <div>
        <button
          v-for="view in views"
          :key="view"
          @click="changeView({ view })"
        >{{ view }}</button>
      </div>

      <div>
        <button @click="run">run code</button>
        <button
          :disabled="$store.getters.pauseDisabled"
          @click="togglePause"
        >{{ paused ? 'resume' : 'pause' }}</button>
      </div>
    </div>
    <!-- https://vuejs.org/v2/guide/components.html#Dynamic-Components -->
    <keep-alive>
      <component :is="$store.state.view"/>
    </keep-alive>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import * as viewComponents from '@/views'

export default {
  name: 'App',
  components: {
    ...viewComponents,
  },
  data: function () {
    return {
      views: Object.keys(viewComponents),
    }
  },
  computed: {
    ...mapState(['paused', 'view']),
  },
  methods: {
    ...mapMutations(['run', 'togglePause', 'changeView']),
  },
}
</script>
