//initialization
const webpack = require('webpack');

//html file
const HtmlWebpackPlugin = require('html-webpack-plugin');

//extractText
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//folder
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

//postcss support
const postcssImport = require('postcss-easy-import');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

//merge
const merge = require('webpack-merge');

//parts
const parts = require('./webpack.parts.js');

//glob
const glob = require('glob');

//constants
const PATHS = {
  APP: path.join(__dirname, 'app'),
  BUILD: path.join(__dirname, 'build'),
  NODE_MODULES: path.join(__dirname, 'node_modules')
};

// const APP = path.join(__dirname, 'app');
// const BUILD = path.join(__dirname, 'build');
// const STYLE = path.join(__dirname, 'app/style.css');
// const PUBLIC = path.join(__dirname, 'app/public');
// const TEMPLATE = path.join(__dirname, 'app/templates/index.html')
// const NODE_MODULES = path.join(__dirname, 'node_modules');
// const HOST = process.env.HOST || 'localhost';
// const PORT = process.env.PORT || 8080;

const config = merge([
  {
    entry: {
      app: PATHS.APP,
      //style: STYLE
    },
    output: {
      path: PATHS.BUILD,
      filename: '[name].js'
    },
    // resolve: {
    //   extensions: ['.js', '.jsx', '.css']
    // },
    module: {
      rules: [
        {
          // Conditions
          test: /\.js$/,
          include: PATHS.APP,
          exclude: PATHS.NODE_MODULES,
          // Actions
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['react', 'es2015'],
            },
          },
        },
      ]
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
      // new webpack.DefinePlugin({
      //   'process.env': {
      //     'NODE_ENV': JSON.stringify('development')
      //   }
      // }),
      // new webpack.HotModuleReplacementPlugin(),
      // new CopyWebpackPlugin([
      //   {
      //     from: PUBLIC, to: BUILD
      //   }
      // ],{
      //   ignore: [
      //     '.DS_Store'
      //   ]
      // }),
      new HtmlWebpackPlugin({
        // template: TEMPLATE,
        // inject: 'body'
        title: 'webpack'
      }),
    ]
  },
  parts.lintCSS({ include: PATHS.APP })
]);

const productionConfig = merge([
  config,
  parts.extractCSS({ include: [PATHS.APP, PATHS.NODE_MODULES] }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.APP}/**/*`, { nodir: true })
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[ext]',
    }
  }),
  parts.setNodeENV({ env: 'production' })
]);

const developmentConfig = merge([
  config,
  parts.devServer({ hostost: process.env.HOST, port: 3000 || process.env.PORT }),
  parts.loadCSS({ include: [PATHS.APP, PATHS.NODE_MODULES] }),
  parts.loadImages(),
  parts.setNodeENV({ env: 'development' })
]);

module.exports = (env)=>{
  console.log('=================================');
  console.log('开启环境模式：',env);
  console.log('=================================');

  if(env == 'production') {
    return productionConfig;
  }

  return developmentConfig;
};
