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
        baseDir: ['./src','./dist']
      }
    })
  ],
  module: {
    rules: [
      {
        test : /\.css$/,
        include: [path.join(__dirname, 'src', 'static', 'css'), 
                  path.join(__dirname, 'node_modules')],
        use : ['style-loader', {
          loader : 'css-loader',
        }],
      },
      {test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader'},
      {test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=65000&mimetype=application/font-woff"},
      {test: /\.ttf(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?limit=10000&mimetype=application/octet-stream'},
      // {test: /\.svg(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?limit=10000&mimetype=image/svg+xml'},
      {
          test: /\.(jpe?g|png|gif|jsapi|ico|svg|gif|mp3)$/, 
          use: [
              {
                  loader: 'file-loader',
                  options: {
                      name: '[name].[ext]',
                  }
              }
          ]
      },
      // {test: /\.json$/, loader: 'file-loader?name=[name].[ext]', exclude : /(node_modules)/}
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
    },
    modules : [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  }
}
