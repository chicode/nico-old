const MonocoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  chainWebpack: (config) => {
    config.plugin('monaco').use(MonocoEditorPlugin)
    config.module
      .rule('text')
      .test(/\.raw.js$/)
      .use('raw-loader')
      .loader('raw-loader')
      .options({
        options: {
          validate: true,
          schema: './shema.json',
          removeUnusedFragments: true,
        },
      })
  },
}
