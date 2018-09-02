<template>
  <div
    v-if="tool === 'pencil'"
    class="option-bar"
  >
    <ColorPicker />
    <SizeSlider />
  </div>
  <div
    v-else-if="tool === 'bucket'"
    class="option-bar"
  >
    <ColorPicker />
  </div>
  <div
    v-else-if="tool === 'eraser'"
    class="option-bar"
  >
    <SizeSlider />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ColorPicker from './ColorPicker'
import SizeSlider from './SizeSlider'

export default {
  name: 'OptionBar',

  components: {
    ColorPicker, SizeSlider,
  },

  computed: {
    ...mapState('sprite', ['tool']),
  },
}
</script>

<style scoped lang="stylus">
.option-bar {
  display: flex;

  & > * {
    margin-right: 10px;
  }
}
</style>
