/**
 * Created by liljay on 2016/4/13.
 */
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let pkg = require('./package.json')
let ROOT_PATH = path.resolve(__dirname);
let BUILD_PATH = path.join(ROOT_PATH, 'build', pkg.version);
let APP_PATH = path.resolve(ROOT_PATH, 'src');
let NODE_MODULES =  path.resolve(ROOT_PATH, '/node_modules');

let config = {
    resolve: {
        root: [ APP_PATH, NODE_MODULES],
        alias: {},
        extensions: ['', '.js', 'jsx', '.less', '.css', '.scss', '.ejs', '.png', '.jpg']
    },
    entry: {
        'index': path.resolve(APP_PATH, 'index')
    },
    output: {
        path: BUILD_PATH,
        filename: 'js/[name].js',
        public: '/',
        chunkFilename:  '[name].chunk.min.js'
    },
     jshint: {
     "esnext": true
     },
    module: {
        /*        preLoaders:[
         {
         test: /\.jsx?$/,
         include: APP_PATH,
         loaders: ['jshint-loader']
         }
         ],*/
        loaders: [
            {
                test: /\.(css|less)$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'less-loader')
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    //'image-webpack?{bypassOnDebug: true, progressive:true, optimizationLevel: 3, pngquant:{quality: "65-80"}}',
                    'url?limit=10000&name=img/[name].[ext]',
                ]
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include:  APP_PATH
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        /*        proxy: {
         '/api/!*': {
         target: 'http://localhost:5000',
         secure: false
         }
         }*/
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
                //new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
/*        new webpack.optimize.CommonsChunkPlugin({
         name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
         chunks: ['detail', 'index'],
         minChunks: chunks.length // 提取所有entry共同依赖的模块
         }),*/
        /*        new HtmlWebpackPlugin({
         template: './src/index.html',
         filename: 'index.html',
         inject: 'body',
         chunks: ['model2', 'vendors']
         })*/
//provide $, jQuery and window.jQuery to every script
        new webpack.ProvidePlugin({
         $: "jquery",
         jQuery: "jquery",
         "window.jQuery": "jquery"
        }),
        new ExtractTextPlugin('css/[name].[contenthash:8].css', {allChunks: true}),
/*        new HtmlWebpackPlugin({
            template: './src/detail.html',
            filename: 'detail.html',
            inject: 'body',
            chunks: ['detail', 'vendors']
        }),*/
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ]
};
module.exports = config;