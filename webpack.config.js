const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
     assetModuleFilename: '[name][ext]'
   },
   plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
   watch: 'true',
   mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|ttf)$/,
        type: 'asset/resource'
      }
    ],
  },
 };
