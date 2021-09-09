const path = require('path');
const {
    resolve
} = require('path');
// "browserslist": {
//     "development": [
//       "last 1 chrome version",
//       "last 1 firefox version",
//       "last 1 safari version"
//     ],
//     "production": [
//       ">0.2%",
//       "not dead",
//       "not op_mini all"
//     ]
//   },
// 插件都是需要用require去使用哒
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

// 因为webpack是用node语法实现的 所以这里需要使用common.js
console.log(path.resolve(__dirname));
process.env.NODE_ENV = 'development';
/*
    tree shaking :树摇 去除无用代码
    前提：1.必须是ES6模块 2.开启production环境
    作用：去除无用代码 减少代码体积
*/
/*
    codesplit:代码分割 并行加载 按需加载
    1. 多入口
    2. 自定义分包
    optimization:{
        splitChunks:{
        // 将node_module的文件单独打包成一个chunks  分析多入口的公共文件（文件大于一定程度才会） 如果有 单独打包成一个chunk
         chunks:'all'
        }
    }
    3.import动态导入语法 能将某个文件单独打包
    import('./js/b').then((res) => {
    console.log(res.p)
    res.p.then((a) => {
        console.log(a)
    })
})
 */
/*
    缓存：
        babel缓存 让第二次打包更快
            cacheDirectory:true
        文件资源缓存 让上线代码更好的使用缓存（更新了得代码去请求 没更新的使用缓存）
            hash：每次webpack打包生成的
            问题：js与css使用同一hash值 
            chunkhash:如果打包源于同一chunk那么hash值相同 css也是在入口js中引入的 所以这两个是一个chunk这两hash也一样
            contenthash:根据内容生成hash
            维持hash值得变化 可以控制 资源是否更新是否从缓存获取
*/
module.exports = {
    entry: {
        index:'./src/index.js',
        home:'./src/home.js',
    },
    output: {
        filename: 'js/[name]-[hash:10].js',
        // 处理绝对路径的拼接
        path: path.resolve(__dirname, 'build'),
        //  像以上的被webpack-dev-server作为在内存中的输出目录。
        //  被其他的loader插件所读取，修改url地址等
        //  /是服务器目录下 ./是打包输出的路径下
        publicPath:'./'
    },
    // loader配置
    module: {
        rules: [
            {
                // 优化打包速度
                // 这样只会经过其中一个loader就不会往下走 不加oneOf会把所以的都经过一遍
                // 注意不能有两个配置处理同一类型文件
                oneOf: [
                    {
                        test: /\.less$/,
                        // 从右向左执行
                        // css-loader:将css文件变成commonjs模块加载到js中(所以就无法将他打包成单独的文件 后面会有办法mini-css-extract - plugin)
                        // style-loader:生成style标签将css放入，添加到html中的header 
                        // less-loader:需要下载less和loader
                        // 将css提取成单独的包 并通过link标签引入（需要打包成css文件就不需要自动抽离到header中了 所以不需要style-loader）
                        use: [{
                                loader: MiniCssExtractPlugin.loader,
                                // 处理css文件引入图片路径问题
                                options: {
                                    publicPath: '../',
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
                            outputPath: 'imgs'
                        }
                    }, {
                        // 处理html引入的图片
                        test: /\.html$/,
                        loader: 'html-loader',
                        options: {
                            esModule: false
                        }
                    }, {
                        // 打包其它资源
                        test: /\.otf$/,
                        loader: 'file-loader',
                        options: {
                            name: '[hash:10].[ext]',
                            outputPath: 'other'
                        }
                    },
                    {
                        // js兼容性处理 babel @babel/core @babel/preset-env babel-loader
                        // 1.基础js兼容性处理 -->@babel/preset-env 
                        // 2.全部js兼容性处理 -->@babel/polyfill 问题是我只需解决部分的兼容性问题，这里将所有的兼容性代码全部引入 体积太大
                        // 3.按需做兼容性处理 -->core-js 
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            // 多进程打包js
                            // 'thread-loader',
                            {
                            loader: 'babel-loader',
                            options: {
                                // 预设：指示babel做怎么样的兼容性处理
                                // 只能打包一些基础的es6语法
                                presets: [['@babel/preset-env', {
                                    useBuiltIns: 'usage',
                                    corejs:{
                                        version:3
                                    },
                                    targets:'>0.2%,not dead'
                                }]],
                                targets: '>0.2%,not dead',
                                // 开启babel缓存
                                // 第二次构建时，会读取之前的缓存
                                cacheDirectory:true
                            },
                        }]
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // 自动将打包的结果放入html中
        new HtmlWebpackPlugin({
            template: __dirname + '/src/template/index.html',
            minify: {
                // 移除注释
                removeComments: true,
                // 移除空格
                collapseWhitespace: true
            }
        }),
        // 将css抽成一个文件出来
        new MiniCssExtractPlugin({
            filename: 'css/build-[hash:10].css'
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin()
    ],
    // 开发环境更加注重代码调试（sourcemap）以及打包速度（热模块提换）不需要太多工具的优化 这样反而会让运行打包速度变慢
    // 生产环境更加注重代码的压缩资源缓存等等让用户体验更好的操作（提取css文件 浏览器样式兼容前缀 压缩）
    mode: 'production',
    // 启动npx webpack-dev-server
    devServer: {
        // 只在内存中打包不会影响硬盘上
        contentBase: resolve(__dirname),
        port: 3000,
        open: true,
        inline: true,
        // 开启HMR功能 热模块替换 hot-module-replace
        hot: true,
        hotOnly: false,
        // 开启gzip
        compress:true
    },
    // 代码映射
    // [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map 可以随意组合
    /*
        inline-source-map 内联映射
        hidden-source-map 隐藏外部映射文件
        eval-source-map 每个文件都生成一个sourcmap 内联映射
        nosources-source-map 外部
        cheap-source-map 外部
        cheap-module-source-map 外部
    */
    devtool: 'source-map',
    optimization: {
        // 这里是splitChunks的默认配置 
        splitChunks: {
            /*
                async表示只从异步加载得模块（动态加载import()）里面进行拆分 多一个异步就会多一个chunk
                initial表示只从入口模块进行拆分
                all表示以上两者都包括
            */
            chunks: 'all',
            // chunk的最小体积
            minSize: 0,
            // chunk的最小使用次数
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            // 分包
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                // 权重
                priority: -10
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              }
            }
          }
        // splitChunks:{
        // // 将node_module的文件单独打包成一个chunks
        //     chunks: 'all',
        //     // chunks如何命名呢
        //     // name:false
        // }
    }
}