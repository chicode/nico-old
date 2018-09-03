<template>
  <div>
    <!-- see nico/App.vue for definition of no-interaction -->
    <div class="tools no-interaction">
      <button
        v-for="tool in $options.TOOLS"
        :key="tool"
        :class="tool"
        @click="setTool(tool)"
      >
        <img :src="`icons/tools/${tool}.svg`">
      </button>
    </div>
    <div class="other">
      <button
        class="clear"
        @click="clear"
      >
        <img src="icons/clear.svg">
      </button>
      <button
        @click="undo"
      >
        <img src="icons/undo.svg">
      </button>
      <button
        @click="redo"
      >
        <img src="icons/redo.svg">
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

  .bucket {
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
