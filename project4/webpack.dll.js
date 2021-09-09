/*
    使用dll技术对某些库进行单独打包
*/
const { resolve } = require('path');
const webpack = require('webpack')
module.exports = {
    entry: {
        // 最终打包生成的name --> 要打包的库
        jquery:['jquery']
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dll'),
        // 打包的库向外暴露出去的内容叫什么名字
        library:'[name]_[hash]'
    },
    plugins: [
        // 打包生成一个mainfest.json文件 提供jquery映射 
        new webpack.DllPlugin({
            name: '[name]_[hash]',//映射库暴露的内容名称
            path:resolve(__dirname,'dll/mainfest.json')//输出文件路径
        })
    ],
    mode:'production'
}