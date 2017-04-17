const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
});

exports.extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    filename: '[name].css',
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: plugin.extract({
            use: ['css-loader', 'postcss-loader'],
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [ plugin ],
  };
};

exports.devServer = ({ host, port }) => ({
  devServer: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },

    historyApiFallback: true,
    stats: 'errors-only',

    host,
    port
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      path.join(__dirname, 'node_modules')
    ]),
    // new FriendlyErrorsPlugin({
    //   clearConsole: true
    // })
  ],
});

exports.purifyCSS = ({ paths }) => ({
  plugins: [
    new PurifyCSSPlugin({ paths }),
  ],
});

exports.lintCSS = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        enforce: 'pre',

        loader: 'postcss-loader',
        options: {
          plugins: () => ([
            require('stylelint')({
              // Ignore node_modules CSS
              ignoreFiles: 'node_modules/**/*.css',
            })
          ])
        }
      }
    ]
  }
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|jpeg)$/,
        include,
        exclude,

        use: {
          loader: 'url-loader',
          options,
        }
      }
    ]
  }
});

exports.setNodeENV = ({ env } = {}) => ({
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      }
    })
  ]
});
