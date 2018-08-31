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
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
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
  },
}
</script>

<style scoped lang="stylus">
.tool {
  img {
    width: 30px;
  }
}
</style>
