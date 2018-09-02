<template>
  <div class="root">
    <Header />
    <!-- https://vuejs.org/v2/guide/components.html#Dynamic-Components -->
    <keep-alive>
      <component :is="view"/>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Game from './components/Game'
import Editor from './components/Editor'
import Sprite from '../sprite/App'

import Header from './components/Header'

export default {
  name: 'App',
  components: {
    Header, Game, Editor, Sprite,
  },
  computed: {
    ...mapState('nico', ['view']),
  },
}
</script>

<styles lang="stylus">
button *,
img,
.no-interaction {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;

  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
</styles>
