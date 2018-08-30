<template>
  <div>
    <div
      v-for="color in COLORS"
      :style="{ background: color }"
      :key="color"
      class="color"
      @click="selectColor(color)"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { COLORS } from '../constants'

export default {
  name: 'ColorPicker',

  data: function () {
    return {
      COLORS,
    }
  },

  computed: {
    ...mapState('sprite', ['toolOptions']),
  },

  methods: {
    ...mapMutations('sprite', ['selectColor']),
  },
}
</script>

<style scoped lang="stylus">
.color {
  width: 10px;
  height: 10px;
  display: inline-block;
}
</style>
