
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
/*
    多进程打包
    因为进程开启是需要时间的600ms左右 进程通信也需要时间 所以一旦没用好 还不如不用
    thread-loader 一次进程会根据cpu核数-1去启动 当然也可以自己去options中都去设置
    options:{
        workers:2 进程为2
    }
*/
/*
    externals 指定哪些包不需要打包
    externals:{
        忽略库名:npm包名
        jquery:'jQuery'
    }
*/
/*
    dll:更详细的分包 对某些库进行单独打包
*/
module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name]-[hash:10].js',
        path:resolve(__dirname, 'build')
    },
    module: {
        rules:[]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:'./src/template/index.html'
        }),
        // 告诉webpack哪些库不参与打包，同时使用时名称也改变
        new webpack.DllReferencePlugin({
            manifest:resolve(__dirname,'dll/mainfest.json')
        }),
        // 将某个文件打包输出去，并在html中自动引入该资源
        new AddAssetHtmlWebpackPlugin({
            filepath: resolve(__dirname, 'dll/jquery.js'),
            publicPath:'./'
        })
    ],
    mode: 'development',

    // externals: {
    //     jquery:'jquery'
    // }
}