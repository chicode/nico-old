<template>
  <div class="root">
    <codemirror
      class="editor"
      :options="cmOptions"
      v-model="$store.state.code"
    />
    <p v-if="$store.state.error">
      {{ $store.state.error }}
    </p>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'

import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'

export default {
  name: 'editor',
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
}
</script>

<style scoped lang="stylus">
.root, .editor {
  height: 100%;
}
</style>
