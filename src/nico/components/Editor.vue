<template>
  <div class="root">
    <codemirror
      :options="cmOptions"
      :value="code"
      class="editor"
      @input="changeCode"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { codemirror } from 'vue-codemirror'

import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'

export default {
  name: 'Editor',

  components: { codemirror },

  data () {
    return {
      cmOptions: {
        tabSize: 2,
        mode: 'text/javascript',
        lineNumbers: true,
      },
    }
  },

  computed: {
    ...mapState('nico', ['code']),
  },

  methods: {
    ...mapMutations('nico', ['changeCode']),
  },
}
</script>

<style scoped lang="stylus">
.root, .editor {
  height: 100%;
}
</style>
