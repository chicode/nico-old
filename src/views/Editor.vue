<template>
  <div class="root">
    <monaco-editor
      class="editor"
      language="javascript"
      v-model="code"
      :options="{
        selectOnLineNumbers: true,
        fontSize: 50,
      }"
      @change="onChange"
      ref="editor"
    />
    <p v-if="$store.state.error">
      {{ $store.state.error }}
    </p>
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco'

export default {
  name: 'editor',
  components: { MonacoEditor },
  data () {
    return {
      code: '',
      decorations: [],
    }
  },
  methods: {
    onChange (newCode, event) {
    /*
      if (this.$state.state.error) {
        this.decorations = this.editor.deltaDecorations(this.decorations, [])
      }

*/

      const { changes: [e] } = event

      this.$store.commit('changeCode', {
        start: e.rangeOffset,
        deleteLength: e.rangeLength,
        text: e.text,
      })
    },
  },
  mount () {
    window.addEventListener('resize', () => this.$refs.editor.layout())
  },
}
</script>

<style scoped lang="stylus">
.root, .editor {
  height: 100%;
}
</style>
