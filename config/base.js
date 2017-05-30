'use strict';
/* global module */
/* global __dirname */
/* global require  */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpack = require('html-webpack-plugin');
const WebpackManifest = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const rootDir = path.resolve(__dirname, '..');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = () => {
  // noinspection JSUnresolvedFunction
  return {
    entry: [
      'babel-polyfill',
      path.resolve(rootDir, 'src/app/entry', 'index'),
      path.resolve(rootDir, 'src/app/entry', 'service-worker'),
    ],
    output: {
      path: path.join(rootDir, 'public'),
      filename: '[name].bundle.[hash].js',
      sourceMapFilename: '[name].[hash].map'
    },
    resolve: {
      extensions: ['.jsx', '.js', '.json'],
      modules: [path.join(rootDir, 'src'), 'node_modules']
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            { loader: 'react-hot-loader' },
          ],
          exclude: [/node_modules/, /\.(spec|e2e)\.jsx?$/]
        },
        {
          test: /\.jsx?$/,
          use: [
            { loader: 'babel-loader', options: { presets: ['es2015', 'react', 'stage-2'] } }
          ],
          exclude: [/node_modules/, /\.(spec|e2e)\.jsx?$/],

        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                importantLoaders: 1,
              },
            },
            { loader: 'postcss-loader' }
          ]
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'assets/icons/[name].[ext]'
            }
          }
        },
        {
          test: /\.json$/,
          use: {
            loader: 'json-loader'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              limit: 100000,
              name: 'assets/fonts/[name].[hash].[ext]'
            },
          }
        }
      ],
    },
    plugins: [
      new ServiceWorkerWebpackPlugin({
        entry: path.join(rootDir, 'src/app/entry/service-worker.js'),
        includes: [
          'main.bundle.*.js',
          'vendor.bundle.*.js',
          'runtime.bundle.*.js',
        ],
      }),
      new CleanWebpackPlugin(['public/**'], {
        dry: true,
        verbose: true
      }),
      new HtmlWebpack({
        filename: 'index.html',
        inject: 'body',
        template: path.resolve(rootDir, 'src/app/entry', 'index.html')
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: m => m.context && m.context.includes('node_modules')
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime',
        chunks: ['vendor'],
        minChunks: Infinity
      }),
      new WebpackManifest({
        filename: 'chunk-manifest.json',
        manifestVariable: 'webpackManifest'
      }),
      new WebpackChunkHash()
    ],
  };
};