<template>
  <div>
    <canvas ref="mainCanvas" />
    <p v-if="error">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { initCtx, initCanvas } from '../../sprite/helpers'

export default {
  name: 'Game',

  computed: {
    ...mapState('nico', ['error']),
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
