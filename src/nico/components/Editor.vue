<template>
  <div class="editor">
    <codemirror
      ref="cm"
      :options="$options.cmOptions"
      :value="code"
      class="vue-CodeMirror"
      @input="setCode"
      @ready="init"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { codemirror } from 'vue-codemirror'

import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/display/autorefresh.js'

export default {
  name: 'Editor',

  components: { codemirror },

  cmOptions: {
    tabSize: 2,
    mode: 'text/javascript',
    lineNumbers: true,
    autorefresh: true,
  },

  computed: {
    ...mapState('nico', ['code', 'view', 'error']),
    cm () {
      return this.$refs.cm.codemirror
    },
  },

  watch: {
    error (error) {
      if (error) {
        // console.log(error.from, error.to)
        if (this.mark) this.mark.clear()
        this.mark = this.cm.markText(error.from, error.to, { className: 'error', atomic: true })
      }
    },

    view (view) {
      if (view === 'editor') {
        this.cm.refresh()
      }
    },
  },

  methods: {
    ...mapMutations('nico', ['setCode']),
    init () {
      // must wait for webfonts to finish loading, or else editor will be improperly initialized
      document.fonts.ready.then(() => {
        this.cm.refresh()
      })
    },
  },
}
</script>

<style scoped lang="stylus">
.editor, .vue-CodeMirror {
  overflow-y: hidden;
}
</style>

<style lang="stylus">
.CodeMirror {
  height: 100%;

  * {
    font-family: 'Fantasque Sans Mono';
  }
}

.CodeMirror-gutters {
  background: white;
  border-right: 0;
  width: 60px;
}
</style>
