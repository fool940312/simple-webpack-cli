/* eslint-disable */
const path = require("path") 
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const p = relativePath => path.resolve(__dirname,relativePath)

const env = process.env.NODE_ENV
const mode = process.env.MODE
var plugins = [
    //css文件分离
    new MiniCssExtractPlugin({
        filename: env === 'development' ? '[name].css' : '[name].[hash].css',
        chunkFilename: env === 'development' ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    //生成html入口文件
    new HtmlWebpackPlugin({
        title:'title',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            minifyCSS: true
        },
        template:p('./index.html'),
        filename:'index.html',
        // chunks: ['index','main'] //多入口
    })
]

//清除dist目录下上次的打包文件
if(mode === 'build'){
    plugins.push(new CleanWebpackPlugin())
}

module.exports = {
    entry:{
        app:'./src/main.js'
    },
    output:{
        filename:'[name]_[hash:8].js',
        // publicPath:p('./dist'),
        path:p('./dist')
    },
    mode:env,
    resolve:{
        extensions: ['.js','.scss','.json','.css','.vue'],
        alias: {
            src :path.resolve(__dirname, '../src'),
            components :path.resolve(__dirname, '../src/components')
            // utils :path.resolve(__dirname, '../src/utils'),
          },
          modules: ['node_modules'],
    },
    module:{
        rules:[
            {
                test: /\.vue$/,
                loaders: ['vue-loader']
            },
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test:/\.css$/,
                use:[
                    env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader
                    ,'css-loader']
            },
            {
                test:/\.(scss | sass)$/,
                use:[env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,'css-loader','sass-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash:7].[ext]',
                            //引用文件路径
                            publicPath:"./images/",
                            //打包文件路径
                            outputPath:"/images"
                        }
                    },
                ],
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash:8].[ext]',
                            //引用文件路径
                            publicPath:"./fonts/",
                            //打包文件路径
                            outputPath:"/fonts"
                        }
                    },
                ],
            },
        ]
    },
    //优化相关
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: mode === "development"
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
        splitChunks: {
            //最小分割块30k
            minSize:30000,
            //同时分割同步和异步代码
            chunks:'all',
            //单独定义默认规则
            cacheGroups: {
                //提取所有css到一个文件里 可设置多入口
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    devtool: env === 'development'?'source-map':'inline-source-map',
    plugins:plugins,
    devServer : {
        // contentBase:path.join(__dirname, "dist"),
        contentBase:path.join(__dirname, 'dist'),
        host: '0.0.0.0',
        port: 9089,
        // publicPath:"/dist",
        historyApiFallback: {
            index: './dist/index.html'
        },
        overlay: {
            errors: true,
        },
        compress: true,
        inline: true,
        hot: true,
        proxy:{
            // '/mockApi': 'https://easy-mock.com/project/5a0aad39eace86040263d'
        }
    }
    // externals: process.env.NODE_ENV === 'production' ? {
    //     "vue": "Vue",
    //     // 'vue-router': 'VueRouter'
    // } : {}
}