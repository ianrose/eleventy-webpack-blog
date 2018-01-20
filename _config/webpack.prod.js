const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = Merge(CommonConfig, {
  output: {
    filename: '[name]-[hash].bundle.js',
    path: path.resolve('bundles'),
    publicPath: '/bundles/'
  },
  plugins: [
    new CleanWebpackPlugin(['bundles'], { root: path.resolve(__dirname , '..'), verbose: true }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }),
    new ExtractTextPlugin('[name]-[hash].css'),
    new WebpackAssetsManifest({
      output: '../_data/manifest.json'
    })
  ],
  module: {
    rules: [
      {
				test: /\.js$/,
				enforce: "pre",
				exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: '_config/postcss.config.js'
                }
              }
            },
            { loader: 'sass-loader'}
          ]
        })
      },
    ]
  },
});