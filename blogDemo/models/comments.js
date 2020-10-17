var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true,useUnifiedTopology: true })

var commentsSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    commentor: {
        type: String,
        required: true
    },
    comment_time: {
        type: String,
        required: true
    },
    like: {
        type: Number,
        default: 0
    },
    author: {
        type: String,
        default: ''
    }
})
module.exports = mongoose.model('Comments', commentsSchema)