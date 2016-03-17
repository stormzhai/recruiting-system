'use strict';

var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlwebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToJQuery = path.resolve(node_modules, 'jquery/dist/jquery.min.js');
var pathToBootstarp = path.resolve(node_modules, 'bootstrap/dist/');

var config = {
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
    "vendors": ['bootstrap.css','font-awesome','jquery','react','react-dom', 'bootstrap.js']
    //"vendor.css": ['bootstrap.css','font-awesome']
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
    new ExtractTextPlugin("[chunkhash:8].[name].css"),
    //new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
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

function htmlwebpackPluginBuilder(fileName, deps) {
  return new HtmlwebpackPlugin ({
    filename: fileName,
    minify: {collapseWhitespace: true},
    template: __dirname + '/source/' + fileName,
    inject: true,
    chunks: deps
  })
}

config.plugins.push(htmlwebpackPluginBuilder('index.html', ['index.css', 'vendors', 'index']));
config.plugins.push(htmlwebpackPluginBuilder('register.html', ['register.css', 'vendors', 'register']));
config.plugins.push(htmlwebpackPluginBuilder('user-center.html', ['user-center.css', 'vendors', 'user-center']));
config.plugins.push(htmlwebpackPluginBuilder('user-center.html', ['user-center.css', 'vendors', 'user-center']));
config.plugins.push(htmlwebpackPluginBuilder('start.html', ['start.css', 'vendors', 'start']));
config.plugins.push(htmlwebpackPluginBuilder('password-retrieve.html', ['password-retrieve.css', 'vendors', 'password-retrieve']));
config.plugins.push(htmlwebpackPluginBuilder('password-reset.html', ['password-reset.css', 'vendors', 'password-reset']));
config.plugins.push(htmlwebpackPluginBuilder('logic-puzzle.html', ['logic-puzzle.css', 'vendors', 'logic-puzzle']));
config.plugins.push(htmlwebpackPluginBuilder('homework-details.html', ['homework-details.css', 'vendors', 'homework-details']));
config.plugins.push(htmlwebpackPluginBuilder('homework.html', ['homework.css', 'vendors', 'homework']));
config.plugins.push(htmlwebpackPluginBuilder('dashboard.html', ['dashboard.css', 'vendors', 'dashboard']));
config.plugins.push(htmlwebpackPluginBuilder('404.html', ['404.css', 'vendors', '404']));

module.exports = config;
