var express = require('express')
var User = require('./models/user')
var Topic = require('./models/topic')
var Comments = require('./models/comments') 
var router = express.Router()
var mongoose = require('mongoose')
var md5 = require('blueimp-md5')
var multer = require('multer')
const session = require('express-session')

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

router.get('/',function(req,res){
    Topic.find(function(err,topics){
        if(err) return res.status(500).send('Server err');
        res.render('index.html',{
            user: req.session.user,
            topics: topics
        })
    })
})

router.get('/login',function(req,res){
    res.render('login.html')
})

router.post('/login',function(req,res){ 
    var body = req.body;
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    },function(err,user){
        if(err){
            res.status(500).json({
                err_code: 500,
                message: 'Internet Error'
            })
        }
        if(!user){
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid'
            })
        }
        //用户存在。登陆成功
        req.session.user = user;
        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })

})

router.get('/register',function(req,res){
    res.render('register.html')
})

router.post('/register', async function(req,res){ 
    var body = req.body;
    /*User.findOne({
        $or: [
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    },function(err, data){
        if(err){
            return res.status(500).json({
                success: false,
                message: '服务器错误'
            })
        }
        if(data.email == body.email){
            return res.status(200).json({
                err_code: 1, 
                message: 'email has existed'
            })
        }
        //对密码进行md5重复加密
        body.password = md5(md5(body.password))

        new User(body).save(function (err, user) { 
            if(err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Internet error'
                })
            }
         })

        //Express提供了一个响应方法： json
        //该方法接收一个对象作为参数，它会自动帮你把对象转化为字符串再发给浏览器
        res.status(200).json({
            err_code: 0,
            message: 'ok'
        })
    })*/
    try {
        if(await User.findOne({ email: body.email })) {
            return res.status(200).json({
                err_code: 1,
                message: '邮箱已存在'
            })
        }
        if(await User.findOne({ nickname: body.nickname })) {
            return res.status(200).json({
                err_code: 2,
                message: '昵称已存在'
            })
        }
        body.password = md5(md5(body.password))
        await new User(body).save()
        //注册成功，使用Session记录用户的登陆状态
        req.session.user = body
        res.status(200).json({
            err_code: 0,
            message: "OK"
        })
    } catch (err) {
        res.status(500).json({
            err_code: 500,
            message: err.message
        })
    }
})

router.get('/logout',function(req,res){
    req.session.user = null;
    res.redirect('/login')
})

//设置页的router操作,profile
router.get('/settings/profile',function(req,res){
    User.findById(req.session.user._id,function(err,data){
        if(err){
            return res.status(500).send('Server error')
        }
        res.render('./settings/profile.html',{
            user: data
        })
    })
})
router.post('/settings/profile',function(req,res){
    var body = req.body;
    var id = req.session.user._id;
    User.findByIdAndUpdate(id,body,function(err,data){
        if(err){
            return res.status(500).send('Server Error')
        }
        req.session.user = data;
        res.redirect('/');
    })
})

//admin
router.get('/settings/admin',function(req,res){
    User.findById(req.session.user._id,function(err,data){
        if(err){
            return res.status(500).send('Server error')
        }
        res.render('./settings/admin.html',{
            user: data
        })
    })
})
router.post('/settings/admin',function(req,res){
	var body = req.body;
	var oldPassword = body.oldPassword;
	var oldPassword = md5(md5(body.oldPassword));
	if(oldPassword != req.session.user.password){
		return res.status(200).send('password err')
	}
		var id = req.session.user._id;
		req.session.user.password = md5(md5(body.newPassword));
		User.findByIdAndUpdate(id,req.session.user,function(err,data){
			if(err) return res.status(500).send('Internet err')
			req.session.user = data;
			res.redirect('/');
		})
})
//删除用户
router.get('/admin/delete',function(req,res){
    var id = req.query.id;
    User.remove({ "_id": id },function(err){
        if(err){
            console.log(err);
            return res.status(500).send('Server err')
        }
        req.session.user = null;
        res.redirect('/');
    })
})
//退出登陆
router.get('/logout',function(req,res){
    req.session.user = null;
    res.redirect('/');
})

router.get('/topics/new',function(req,res){
    res.render('topic/new.html')

})

//创建话题
router.post('/topic/new',function(req,res){
    var body = req.body;
    body.userID = req.session.user._id;
    body.nickname = req.session.user.nickname;
    new Topic(body).save((err,data)=>{
        if(err){
            return res.status(500).send('Server err')
        }
        res.redirect('/');
    })
})
//展示话题
router.get('/topic/show',function(req,res){
    var id = req.query.id;
    Topic.findById(id,function (err,data) { 
        if(err){
            return res.status(500).send('Server')
        }
        var topic = data;
        Comments.find({author:id},function(err,data){
            if(err){
                return res.status(500).send('Server')
            }
            res.render('topic/show.html',{
                user: req.session.user,
                topic: topic,
                comments: data
            })
            
        })
     })
    /*Comments.findById(id,function (err,data){
        if(err){
            return res.status(500).send('Server')
        }
    })*/
})
//提交评论
router.post('/topic/show',function(req,res){
    var body = req.body;
    new Comments(body).save(function(err,data){
        if(err){
            console.log(err);
            return res.status(500).send("Sever err")
        }
    })
    res.redirect('/');
})



                
module.exports = router