'use strict';

var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlwebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToJQuery = path.resolve(node_modules, 'jquery/dist/jquery.min.js');
var pathToBootstarp = path.resolve(node_modules, 'bootstrap/dist/');


module.exports = {
  entry: {
    "404": "./source/scripts/404.js",
    "index": "./source/scripts/index.js",
    "logic-puzzle": "./source/scripts/logic-puzzle",
    "homework": "./source/scripts/homework.js",
    "register": "./source/scripts/register.js",
    "start": "./source/scripts/start.js",
    "user-center": './source/scripts/user-center.js',
    "dashboard": './source/scripts/dashboard.js',
    "password-retrieve": './source/scripts/password-retrieve.js',
    "password-reset": './source/scripts/password-reset.js',
    "homework-details": './source/scripts/homework-details.js',
    "vendors": ['jquery','bootstrap.css','font-awesome','react','react-dom', 'bootstrap.js']


  },
  output: {
    path: __dirname + '/public/assets/',
    filename: '[chunkhash:8].[name].js',
    chunkFilename: '[name].[chunkhash:8].js'
  },
  module: {
    loaders: [
      {
        test: path.join(node_modules, 'jquery/dist/jquery.min.js'),
        loader: 'expose?jQuery'
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=10000&name=build/[name].[ext]'
      }
    ],
    noParse: [pathToJQuery,pathToBootstarp]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      React: 'react',
      ReactDom: 'react-dom',
      ReactDOM: 'react-dom'
    }),
    new ExtractTextPlugin("[name].bundle.css"),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'register.html',
      template: __dirname + '/public/register.html',
      inject: true,
      chunks: ['vendors', 'register'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'register': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'index.html',
      template: __dirname + '/public/index.html',
      inject: true,
      chunks: ['vendors', 'index'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'index': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'user-center.html',
      template: __dirname + '/public/user-center.html',
      inject: true,
      chunks: ['vendors', 'user-center'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'user-center': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'user-center.html',
      template: __dirname + '/public/user-center.html',
      inject: true,
      chunks: ['vendors', 'user-center'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'user-center': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'start.html',
      template: __dirname + '/public/start.html',
      inject: true,
      chunks: ['vendors', 'start'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'start': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'password-retrieve.html',
      template: __dirname + '/public/password-retrieve.html',
      inject: true,
      chunks: ['vendors', 'password-retrieve'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'password-retrieve': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'password-reset.html',
      template: __dirname + '/public/password-reset.html',
      inject: true,
      chunks: ['vendors', 'password-reset'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'password-reset': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'logic-puzzle.html',
      template: __dirname + '/public/logic-puzzle.html',
      inject: true,
      chunks: ['vendors', 'logic-puzzle'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'logic-puzzle': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'homework-details.html',
      template: __dirname + '/public/homework-details.html',
      inject: true,
      chunks: ['vendors', 'homework-details'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'homework-details': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'homework.html',
      template: __dirname + '/public/homework.html',
      inject: true,
      chunks: ['vendors', 'homework'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'homework': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: 'dashboard.html',
      template: __dirname + '/public/dashboard.html',
      inject: true,
      chunks: ['vendors', 'dashboard'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, 'dashboard': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    }),
    new HtmlwebpackPlugin({
      filename: '404.html',
      template: __dirname + '/public/404.html',
      inject: true,
      chunks: ['vendors', '404'],

      chunksSortMode: function (a, b) {
        var index = {'vendors': 2, '404': 1},
            aI = index[a.origins[0].name],
            bI = index[b.origins[0].name];
        return aI && bI ? bI - aI : -1;
      }
    })
  ],
  //devtool: '#inline-source-map',
  resolve: {
    alias: {
      'bootstrap.css': 'bootstrap/dist/css/bootstrap.min.css',
      'font-awesome': 'font-awesome/css/font-awesome.min.css',
      'bootstrap.js': 'bootstrap/dist/js/bootstrap.min.js',
      'jquery': 'jquery/dist/jquery.min.js'
    }
  }
};