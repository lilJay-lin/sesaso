/**
 * Created by liljay on 2016/4/13.
 */
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let pkg = require('./package.json')
let ROOT_PATH = path.resolve(__dirname);
let BUILD_PATH = path.join(ROOT_PATH, 'build', pkg.version);
let APP_PATH = path.resolve(ROOT_PATH, 'src');
let NODE_MODULES =  path.resolve(ROOT_PATH, '/node_modules');

let config = {
    //devtool: 'eval-source-map',
    resolve: {
        root: [ APP_PATH, NODE_MODULES],
        alias: {},
        extensions: ['', '.js', 'jsx', '.less', '.css', '.scss', '.ejs', '.png', '.jpg']
    },
    entry: {
        'recommend': path.resolve(APP_PATH, 'recommend'),
        'index': path.resolve(APP_PATH, 'index')
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].js',
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
                loaders: ['style', 'css', 'less']
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
        //new webpack.optimize.UglifyJsPlugin({minimize: true}),
        /*        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),*/
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
            chunks: ['recommend', 'index'],
            minChunks: Infinity // 提取所有entry共同依赖的模块
        }),
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
        new HtmlWebpackPlugin({
            template: './src/recommend.html',
            filename: 'recommend.html',
            inject: 'body',
            chunks: ['recommend', 'vendors']
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body',
            chunks: ['index', 'vendors']
        })
    ]
};
module.exports = config;