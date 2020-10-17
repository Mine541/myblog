var express = require('express')
var path = require('path')
var router = require('./router')
var app = express()
var bodyParser = require('body-parser')
var session = require('express-session')
var multer = require('multer')
//读取文件时(例如用readfile读取./a.txt),./a.txt相对于执行node命令所处的终端路径
//就是说，文件操作路径中，相对路径设计就是相对于执行node命令所处的路径
app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules',express.static(path.join(__dirname,'./node_modules')))


//配置art-template
app.engine('html',require('express-art-template'));
//默认./views目录
app.set('views',path.join(__dirname,'./views/'))

//配置表单解析题插件,一定要在app.use(router)前
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//配置session
//添加Session数据:req.session.foo = 'bar'
//访问Session数据:req.session.foo
app.use(session({
    //该插件会为req请求对象添加一个成员：req-session默认是一个对象
    //这是最简单的配置方式，暂且不用关心里面参数的含义
    secret: 'itcast',
    resave: false,
    //无论是否使用Session，都默认分配一把钥匙
    saveUninitialized: true
}))



//把路由挂载到app中
app.use(router)
app.get('/',function(req,res){
    res.render('index.html')
})

app.listen(3000,function(){
    console.log('running...')
})