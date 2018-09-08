<template>
  <div class="game">
    <p
      v-if="error"
      class="error"
    >
      {{ error.message }}
    </p>
    <p v-else-if="!hasBeenRun">
      press "run code" to run your game for the first time!
    </p>
    <!-- v-show has to be used because the ref needs to be initiated -->
    <canvas
      v-show="running"
      ref="mainCanvas"
      class="main-canvas"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { initCtx, initCanvas } from '../../sprite/helpers'

export default {
  name: 'Game',

  computed: {
    ...mapState('nico', ['error', 'hasBeenRun', 'running']),
  },

  mounted () {
    const canvas = this.$refs.mainCanvas
    initCanvas(canvas)
    const mainCtx = canvas.getContext('2d')
    initCtx(mainCtx)
    this.initMainCtx(mainCtx)
  },

  methods: {
    ...mapMutations('nico', ['initMainCtx']),
  },
}
</script>

<style scoped lang="stylus">
@import '~@/styles/defs.styl'

.game {
  .main-canvas {
    border()
  }
}
</style>
