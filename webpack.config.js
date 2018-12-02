var path = require('path')
var webpack = require('webpack')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// Phaser webpack config
// var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
// var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
// var pixi = path.join(phaserModule, 'build/custom/pixi.js')
// var p2 = path.join(phaserModule, 'build/custom/p2.js')

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/index.js')
    ],
    // vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
  },
  devtool: 'cheap-source-map',
  // devtool: 'source-map',//show source map for debug
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    filename: 'bundle.js'
  },
  watch: true,
  plugins: [
    definePlugin,
    // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: 'vendor.bundle.js'/* filename= */}),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./', './build','./assets','./dist']
      }
    })
  ],
  module: {
    rules: [
      {
        test : /\.css$/,
        include: [path.join(__dirname, 'src', 'static', 'css')],
        use : ['style-loader', {
          loader : 'css-loader',
          options : {
            modules : true,
            importLoaders : 1,
            localIdentName : '[path][name]__[local]--[hash:base64:5]',
          },
        }],
      },
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      // 'phaser': phaser,
      // 'pixi': pixi,
      // 'p2': p2
    }
  }
}
