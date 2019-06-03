const {src , dest , series , parallel ,watch} = require('gulp');
// const gulp = require('gulp')
const gulpwebserver = require('gulp-webserver')
const webpackStream = require('webpack-stream')
const path = require('path');
const gulpSass = require('gulp-sass');
const proxy = require('http-proxy-middleware');
const del = require('del');
//路径解析的模块

//任务的回调一定要有返回值，返回值全部都是异步操作

//如果没有返回值的话，必须传参callbak
//因为他遵循nodejs的错误优先的回调

//拷贝index.html到dev根目录下
function copyHtml(){
    //return 返回的stream流
    return src('./*.html')
        .pipe(dest('./dev'))
}

function copyLibs(){
    return src('./src/libs/**/*')
        .pipe(dest('./dev/libs'))
}

function copyImages(){
    return src('./src/images/**/*')
        .pipe(dest('./dev/images'))
}

function copyIcons(){
    return src('./src/icons/**/*')
        .pipe(dest('./dev/icons'))
}

//启动server
function webServer(){
    return src('./dev/')
        .pipe(gulpwebserver({
            port:'8000',
            livereload:true,
            middleware:[
                proxy('/api',{
                    target : 'www.m.lagou.com',
                    changeOrigin : true,
                    //chagneOrigi：需要跨域的时候就设为true
                    pathRewrite:{
                        //重定向
                        '^/api' : ''
                    }
                })
            ]
        }))
}

//编译js模块
function packJs(){
    return src('./src/app.js')
        .pipe(webpackStream({
            mode :'development', //开发环境中
            entry : {
                app : './src/app.js'
            },
            output : {
                filename : '[name].js',
                //[name] = app
                path : path.resolve(__dirname,'./dev')
                // __dirname:获取物理路径，绝对路径
            },
            module : { //es6-8  => es8
                rules : [{  
                    test : /\.m?js$/,
                    exclude : /node_modules/,
                    use : {
                        loader : 'babel-loader',
                        options : {
                            presets :['@babel/preset-env'],
                            //preset-env包含了许多编译es6的草案
                            plugins : ['@babel/plugin-transform-runtime']
                        }
                    }
                },{
                    test : /\.art$/,
                    loader : 'string-loader'
                }
            ]
            }
        })).pipe(dest('./dev/scripts'))
}

function packCss(){
    return src('./src/styles/app.scss')
    .pipe(gulpSass().on('error',gulpSass.logError))
    .pipe(dest('./dev/styles'))
    //if sth wrong ,the server will not stop and u will get an error-information
}

function watcher(){
    watch('./*.html',series(clear('./dev/*.html'),copyHtml))
    watch('./src/libs/**/*',series(clear('./dev/libs'),copyLibs))
    watch('./src/images/**/*',series(clear('./dev/images'),copyImages))
    watch('./src/icons/**/*',series(clear('./dev/icons'),copyIcons))
    watch('./src/styles/**/*',series(packCss))
    watch(['./src/**/*','!src/images','!src/icons','!src/libs','!src/styles'],series(packJs))
}

function clear(target){
    return function(){
        return del(target)
    }
}
exports.default = series(parallel(copyHtml,copyLibs,copyImages,copyIcons),parallel(packCss,packJs), webServer ,watcher)