const webpack = require('webpack');
const path = require('path');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const config = {
  devServer: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },

    historyApiFallback: true,
    stats: 'errors-only',

    host: process.env.HOST,
    port: process.env.PORT
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      path.join(__dirname, 'node_modules')
    ]),
    //new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin({
      clearConsole: true
    })
  ],
};

module.exports = config;
