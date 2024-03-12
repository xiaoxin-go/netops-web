const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: ['*'],
    proxy: {
      '/netops/v1': {
        target: 'http://localhost:8031',
        secure: false,
        ws: false
      },
      '/': {
        target: 'http://localhost:8031',
        secure: false,
        ws: false
      }
    }
  },
  lintOnSave: false,
})
