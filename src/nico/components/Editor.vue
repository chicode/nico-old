<template>
  <div class="editor">
    <codemirror
      ref="cm"
      :options="cmOptions"
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

// import 'codemirror'
// import 'codemirror/lib/codemirror.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'

// import 'codemirror/addon/hint/show-hint.js'
// import 'codemirror/addon/hint/show-hint.css'
// import 'codemirror/addon/hint/javascript-hint.js'

export default {
  name: 'Editor',

  components: { codemirror },

  data () {
    return {
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        lineNumbers: true,
      },
    }
  },
  computed: {
    ...mapState('nico', ['code']),
    cm () {
      return this.$refs.cm.codemirror
    },
  },

  methods: {
    ...mapMutations('nico', ['setCode']),
    init () {
      document.fonts.ready.then(() => {
        this.cm.refresh()
      })
      /*
        this.cm.on('keyup', (cm, event) => {
          if (!cm.state.completionActive && // Enables keyboard navigation in autocomplete list
                event.keyCode !== 13) { // Enter - do not open autocomplete list just after item has been selected in it
            CodeMirror.commands.autocomplete(cm, null, { completeSingle: false })
          }
        })
    */
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
