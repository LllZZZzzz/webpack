- webpack.config.js
- webpack使用node实现 支持common.js语法
- entry output module{rules:[]} plugins mode devServer devtools(代码调试) optimization(代码分割优化) externals(不打包的部分) resolve
- 从上到下去配置 
- 常用loader以及plugin 
- css->js->html
- css:
    - mini-css-extract-plugin:将css提取成单独的文件
    - style-loader:将js中的css插入到html顶部
    - css-loader:将css打包到js中
    - postcss-loader（postcss-preset-env）:css兼容性处理
    - optimize-assets-webpack-plugin: 压缩css     

- less:（sass同理）
    - less-loader:将less转化成css

- js:
    - eslint-loader
    - babel-loader:js兼容性处理
        - @babel/preset-env基础的js处理
        - @babel/polyfill全部的兼容性处理 但是会让打包结果变得很大
        - core-js 按需打包

- image
    - url-loader(file-loader)：不能处理html中的图片 ES6 

- html
    - html-loader:使用的是commonjs 使用的时候加上esModule:false
    - html-webpack-plugin:将打包的结果放入指定的模板html中

- 其它文件
    - file-loader

- 开发环境应该做的优化
    - 提高打包速度(可以使用HMR但是没太大必要)
        - HMR
            - 样式文件：style-loader内部支持HME
            - js:需要手动实现
            - html:没必要
            - 问题 会导致html文件没法进行热更新
            - 解决办法 将html文件加入entry入口文件的配置中
    - 优化调试
        - source-map 代码映射
- 生产环境应该做的优化
    - 优化打包构建速度
        - oneOf 只经过一个loader
        - babel缓存 缓存js的处理
        - dll
            - 更详细的分包 可以让文件单独打包出来  之后不用在做打包
    - 提高运行速度
        - hash缓存 代码改变时 只改变改变的文件的hash 其余不变这样其余的可以使用缓存（hash chunkhash contenthash）
            hash:随机生成的
            chunkhash :同一个chunck一个hash css也会被打包进js 所以这两个是一个hash
            contenthash：相同内容hash不变 
        - tree shaking:树摇 去除无用代码
            - 前提：
                - 1. 必须是ES6模块
                - 2. 开启production
            sideEffect防止无用代码被删除
        - codesplit 代码分割 并行加载 按需加载
            - 实现方式：
                - 1. 多入口 一个入口为一个chunk
                - 2. 自定义分包 optimization-splitChunks
                - 3. 动态引入 动态引入的文件会单独打包
        - externals 指定不需要打包的文件
        - 资源懒加载和预加载
        - 多进程打包 thread-loader
        - pwa 离线访问 （不必掌握）

- entry:入口文件
    - string
    - array 一个array是一个chunk打包生成一个文件
    - objtct 多入口文件

- output:{
    filename: (文件名+目录),
    path:公共打包输出路径,
    publicPath:'/'所有资源引入的公共路径 -->'imgs/a.png'当前目录下的 '/imgs/a.png'服务器前缀下的  一般用于生产环境
    chunkFilename:非入口chunk的名称 '[name]_chunk.js' 对非入口的chunk重命名
    library:'[name]',
    libraryTarget:'umd','window'添加到window下
}
- module:{
    rules:[
        {
            test
            include
            exclude
            enforce
            loader:''
            use:[]
            options
        }
    ]
}
- resolve:{
    配置路径别名 简写路径
    alias:{
        name:value
    },
    配置省略文件路径的后缀
    extensions:[]
    告诉webpack模块去哪里找  就不用一层一层找
    modules:['node_modules']
}
- devServer:{
    contentBase:运行代码的目录
    watchContentBase 监视contentBase 一旦改变重新打包 感觉没啥用呀 open打开就行了呀
    watchOptions:{
        ignores:/node_modules/
        忽略监视
    }
    compress:true gzip压缩
    port
    host
    open
    hot
    clientLogLevel 是否显示的启动服务器日志信息
    quiet 除了基本的启动信息之外 其它内容不展示
    overlay false 如果出错不要全屏提示
    proxy 服务器代理：{
        '/api':{
            //浏览器和服务器之间是存在跨域的 服务器和服务器之间不存在 所以利用代理服务器去解决跨域
            target:'',
            pathRewrite:{
                '^/api'
                路径重写
            }
        }
    }
}
- optimization:{
    splitChunks:{}
    minimizer:{
        配置生产环境的压缩方案 ：主要针对js css
    }
}