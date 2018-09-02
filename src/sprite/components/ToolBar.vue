<template>
  <div>
    <div class="tools">
      <button
        v-for="tool in $options.TOOLS"
        :key="tool"
        :class="tool"
        @click="setTool(tool)"
      >
        <img :src="`tools/${tool}.svg`">
      </button>
    </div>
    <div class="other">
      <button
        class="clear"
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
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import { TOOLS } from '../constants'

export default {
  name: 'ToolBar',

  TOOLS,

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
button img {
  width: 30px;
}
.tools {
  margin-right: 30px;

  .eraser {
    margin-right: 10px;
  }
}
.other {
  .clear {
    margin-right: 10px;
  }
}
.tools, .other {
  display: inline-block;
}
</style>
