const path = require('path');
const { resolve } = require('path');
// 插件都是需要用require去使用哒
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 因为webpack是用node语法实现的 所以这里需要使用common.js
console.log(path.resolve(__dirname));
// process.env.NODE_ENV = 'development';
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'js/build.js',
        // 处理绝对路径的拼接
        path: path.resolve(__dirname, 'build'),
        //  像以上的被webpack-dev-server作为在内存中的输出目录。
        //  被其他的loader插件所读取，修改url地址等
        // publicPath:'/'
    },
    // loader配置
    module: {
        rules: [
            {
                test: /\.less$/,
                // 从右向左执行
                // css-loader:将css文件变成commonjs模块加载到js中(所以就无法将他打包成单独的文件 后面会有办法mini-css-extract - plugin)
                // style-loader:生成style标签将css放入，添加到html中的header 
                // less-loader:需要下载less和loader
                // 将css提取成单独的包 并通过link标签引入（需要打包成css文件就不需要自动抽离到header中了 所以不需要style-loader）
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        // 处理css文件引入图片路径问题
                        options: {
                            publicPath:'../'
                        }
                    },
                    // 'style-loader',
                    'css-loader',
                    // css兼容性处理
                    {
                        // 需要去设置nodejs的环境变量 否则不管webpack配置的什么mode 都会按照生成环境去进行
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                  [
                                    'postcss-preset-env',
                                  ],
                                ],
                              },
                        }
                    },
                    'less-loader'
                ]
            }, {
                // 处理不了html引入的图片
                test: /\.(jpg|png|gif)$/,
                // url-loader依赖 file-loader
                loader: 'url-loader',
                options: {
                    limit: 1024 * 8,
                    name: '[hash:10].[ext]',
                    // outputPath:'imgs'
                }
            }, {
                // 处理html引入的图片
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    esModule:false
                }
            },{
                // 打包其它资源
                test: /\.otf$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath:'other'
                }
            }
        ]
    },
    plugins: [
        // 自动将打包的结果放入html中
        new HtmlWebpackPlugin({
            template:__dirname+'/src/index.html'
        }),
        // 将css抽成一个文件出来
        new MiniCssExtractPlugin({
            filename:'css/build.css'
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin()
    ],
    // 开发环境不需要太多工具的优化 这样反而会让运行打包速度变慢
    // 生产环境更加注重代码的压缩等等让用户体验更好的操作（提取css文件 浏览器样式兼容前缀 压缩）
    mode: 'development',
    // 启动npx webpack-dev-server
    devServer: {
        // 只在内存中打包不会影响硬盘上
        //打包后的内存路径(和硬盘上的打包路径冲突或者输出路径不存在 好像就是会以硬盘上为主 最好不要冲突)
        // contentBase + output.publicPath
        contentBase: resolve(__dirname),
        port: 3000,
        open: true,
        inline: true,
        hot: true,
        hotOnly:false
    }
}