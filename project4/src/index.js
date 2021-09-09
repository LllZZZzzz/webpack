console.log('index加载了');
import jQuery from 'jquery'
console.log(jQuery)
// setTimeout(() => {
//     // 懒加载 等用的时候才去加载
//     // 预加载 webpackPrefetch 刚进入就去加载 等到用的时候不需要加载 直接用 等其它资源加载完毕再去加载 不会占用其它资源的加载时间
//     // 兼容性很差  预加载慎用
//     import(/*webpackPrefetch:true*/'./test').then((res) => {
//         console.log(res.default)
//     })
// }, 10000);
// import a from './test'
// console.log(a)
// sourcework ?????
/*
PWA渐进式网络开发应用程序（离线可使用）
    workbox -->workbox-webpack-plugin
    npm i serve -g 下载服务器 快速下载服务器
    serve -s build 启动服务器 将build目录下的所有资源作为静态资源暴露出去
*/