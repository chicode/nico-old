<template>
  <div>
    <div v-if="tool === 'pencil'">
      <ColorPicker />
      <SizeSlider />
    </div>
    <div v-else-if="tool === 'eraser'">
      <SizeSlider />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ColorPicker from './ColorPicker'
import SizeSlider from './SizeSlider'

export default {
  name: 'Optionbar',

  components: {
    ColorPicker, SizeSlider,
  },

  computed: {
    ...mapState('sprite', ['tool']),
  },
}
</script>
