const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = Merge(CommonConfig, {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('bundles'),
    publicPath: '/bundles/'
  },
  devtool: 'inline-source-map',
  plugins: [
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:8080',
        files: ["_site", "_src"],
        open: false
      },
      {
        reload: false
      }
    ),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin()
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1 
            }
          },
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
        /* ExtractTextPlugin.extract({
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
        }) */
      },
    ]
  },
  devServer: {
    contentBase: [
      path.resolve('_site'),
    ],
    hot: true
  }
});