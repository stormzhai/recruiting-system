'use strict';

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");

module.exports = {
    entry: {
        "index": "./source/scripts/index.js",
        "logic-puzzle": "./source/scripts/logic-puzzle",
        "homework": "./source/scripts/homework.js",
        "register": "./source/scripts/register.js",
        "start": "./source/scripts/start.js",
        "user-center": './source/scripts/user-center.js',
        "dashboard":'./source/scripts/dashboard.js'
    },
    output: {
        path: __dirname + '/public/assets/',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
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
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].bundle.css")
    ],
    devtool: '#inline-source-map'
    //resolve: {
    //    extensions: [".jpg", ".png"]
    //}
}
;