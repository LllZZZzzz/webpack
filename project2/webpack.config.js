const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'js/build.js',
        path:path.resolve(__dirname,'build')
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath:'../imgs/'
                        }
                    },
                    'css-loader','less-loader'
                ]
            }, {
                test: /\.(jpg|png)$/,
                loader: 'url-loader',
                options: {
                    name:'[hash:10].[ext]',
                    limit: 8 * 1024,
                    outputPath:'imgs'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/src/template/index.html',
            minify: {
                // 移除注释
                removeComments:true,
                // 移除空格
                collapseWhitespace:true
            }
        }),
        new MiniCssExtractPlugin({
            filename:'css/build.css'
        }),
    ],
    // production模式会自动开启js压缩UglifyJsPlugin
    mode:'development'
}