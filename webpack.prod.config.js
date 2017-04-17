//initialization
const webpack = require('webpack');

//html file
const HtmlWebpackPlugin = require('html-webpack-plugin');

//folder
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

//postcss support
const postcssImport = require('postcss-easy-import');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

//constants
const APP = path.join(__dirname, 'app');
const BUILD = path.join(__dirname, 'build');
const STYLE = path.join(__dirname, 'app/style.css');
const PUBLIC = path.join(__dirname, 'app/public');
const TEMPLATE = path.join(__dirname, 'app/templates/index.html')
const NODE_MODULES = path.join(__dirname, 'node_modules');
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const config = {
    entry: {
      app: APP,
      style: STYLE
    },
    output: {
      path: BUILD,
      filename: '[name].js'
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.css']
    },
    module: {
      loaders:[
        {
          test: /\.jsx?$/,
          loaders: ['babel?cacheDirectory'],
          include: APP
        },
        {
          test: /\.css$/,
          loaders: ['style', 'css', 'postcss'],
          include: [APP, NODE_MODULES]
        },
        {
          test: /\.json$/,
          loader: 'json',
          include: [APP, NODE_MODULES]
        }
      ]
    },
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      progress: true,

      stats: 'errors-only',

      host: HOST,
      port: PORT,

      outputPath: BUILD
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: function processPostcss(webpack) {
            return [
              postcssImport({
                addDependencyTo: webpack
              }),
              precss,
              autoprefixer({ browsers: ['last 2 versions'] })
            ]
          }
        }
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new CopyWebpackPlugin([
        {
          from: PUBLIC, to: BUILD
        }
      ],{
        ignore: [
          '.DS_Store'
        ]
      }),
      new HtmlWebpackPlugin({
        template: TEMPLATE,
        inject: 'body'
      })
    ]
};

module.exports = config;
