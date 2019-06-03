//生产环境
const {src , dest , series , parallel } = require('gulp');
const webpackStream = require('webpack-stream')
const path = require('path');
const gulpSass = require('gulp-sass');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const cleanCss = require('gulp-clean-css')
//路径解析的模块

//任务的回调一定要有返回值，返回值全部都是异步操作

//如果没有返回值的话，必须传参callbak
//因为他遵循nodejs的错误优先的回调

//拷贝index.html到dev根目录下
function copyHtml(){
    //return 返回的stream流
    return src('./*.html')
        .pipe(dest('./dist'))
}

function copyLibs(){
    return src('./src/libs/**/*')
        .pipe(dest('./dist/libs'))
}

function copyImages(){
    return src('./src/images/**/*')
        .pipe(dest('./dist/images'))
}

function copyIcons(){
    return src('./src/icons/**/*')
        .pipe(dest('./dist/icons'))
}

//编译js模块
function packJs(){
    return src('./src/app.js')
        .pipe(webpackStream({
            mode :"production", //开发环境中
            entry : {
                app : './src/app.js'
            },
            output : {
                filename : '[name].js',
                //[name] = app
                path : path.resolve(__dirname,'./dist')
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
        }))
        .pipe(rev())
        .pipe(dest('./dist/scripts'))
        .pipe(rev.manifest())
        .pipe(dest('rev/scripts'))
}

function packCss(){
    return src('./src/styles/app.scss')
    .pipe(gulpSass().on('error',gulpSass.logError))
    .pipe(cleanCss({compatibility : 'ie8'}))
    .pipe(rev())
    .pipe(dest('./dist/styles'))
    .pipe(rev.manifest())
    .pipe(dest('rev/styles'))
    //if sth wrong ,the server will not stop and u will get an error-information
}

function revColl(){
    return src(['./rev/**/*.json','./dist/*.html'])
        .pipe(revCollector())
        .pipe(dest('./dist'))
}

exports.default = series(parallel(packCss,packJs,copyLibs,copyImages,copyIcons),copyHtml,revColl)