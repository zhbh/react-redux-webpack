const webpack = require('webpack');
const path    = require('path');

const config = {
    entry: {
      index: './src/js/index.js'
    },
    output: {
      path: path.join(__dirname,'build'),
      filename: '[name].bundle.js'
    }
};

module.exports = config;
