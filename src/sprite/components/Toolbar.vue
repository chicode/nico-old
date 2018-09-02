<template>
  <div>
    <button
      v-for="tool in TOOLS"
      :key="tool"
      class="tool"
      @click="setTool(tool)"
    >
      <img :src="`tools/${tool}.svg`">
    </button>
    <button
      @click="clear"
    >
      <img src="clear.svg">
    </button>
    <button
      @click="undo"
    >
      <img src="undo.svg">
    </button>
    <button
      @click="redo"
    >
      <img src="redo.svg">
    </button>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import { TOOLS } from '../constants'

export default {
  name: 'Toolbar',

  data: function () {
    return {
      TOOLS,
    }
  },

  computed: {
    ...mapState('sprite', ['tool']),
  },

  methods: {
    ...mapMutations('sprite', ['setTool']),
    ...mapActions('history', ['undo', 'redo']),
    ...mapActions('sprite', ['clear']),
  },
}
</script>

<style scoped lang="stylus">
img {
  width: 30px;
}
</style>
