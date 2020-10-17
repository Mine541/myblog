var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true,useUnifiedTopology: true })

var userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: '/public/img/avatar-max-img.png'
    },
    gender: {
        type: Number,
        enum: [0, 1, 2],
        default: 2
    },
    bio: {
        type: String,
        default: ''
    },
    birthday: {
        type: String
    },
    status: {
        type: Number,
        //0-无权限限制 1-不可以评论 2-不可以登陆
        enum: [0, 1, 2],
        default: 0
    }
})

module.exports = mongoose.model('User' , userSchema)