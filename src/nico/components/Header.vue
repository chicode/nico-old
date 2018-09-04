<template>
  <div class="header">
    <div class="tools">
      <button
        v-for="iview in $options.VIEWS"
        :key="iview"
        :class="'button-2' + (view === iview ? ' active' : '')"
        @click="setView(iview)"
      >{{ iview }}</button>
    </div>

    <div>
      <button
        class="button"
        @click="run"
      >run code</button>
      <button
        :disabled="pauseDisabled"
        class="button"
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

<style scoped lang="stylus">
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  margin: 10px;

  .tools {
    display: flex;
    & > * {
      margin-right: 20px;
    }
  }
}
</style>
