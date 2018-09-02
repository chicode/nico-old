<template>
  <div class="header">
    <div>
      <button
        v-for="view in $options.VIEWS"
        :key="view"
        @click="setView(view)"
      >{{ view }}</button>
    </div>

    <div>
      <button @click="run">run code</button>
      <button
        :disabled="pauseDisabled"
        @click="togglePause"
      >{{ paused ? 'resume' : 'pause' }}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Header',
  VIEWS: ['game', 'editor', 'sprite'],
  computed: {
    ...mapGetters('nico', ['pauseDisabled']),
    ...mapState('nico', ['view', 'paused']),
  },
  methods: {
    ...mapMutations('nico', ['togglePause', 'setView']),
    ...mapActions('nico', ['run']),
  },
}
</script>
