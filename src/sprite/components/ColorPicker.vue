<template>
  <div>
    <div
      v-for="color in $options.COLORS"
      :style="{ background: color }"
      :key="color"
      class="color"
      @click="setColor(color)"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { COLORS } from '../constants'

export default {
  name: 'ColorPicker',

  COLORS,

  computed: {
    ...mapState('sprite', ['toolOptions']),
  },

  methods: {
    ...mapMutations('sprite', ['setColor']),
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
