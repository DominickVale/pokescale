const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: 'public', to: './' }
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: './public/app.html',
    }),
    new WorkboxPlugin.GenerateSW({
      swDest: 'sw.js',
      skipWaiting: true,
      clientsClaim: true

    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(svg|png|jpg|gif|jpeg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'imgs',
            esModule: false,
          }
        }
      },
      {
        test: /\.(ttf|otf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'fonts',
          }
        }
      },
    ]
  }
}