var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true,useUnifiedTopology: true })

var topicSchema = new Schema({
    classfication:{
        type: Number,
        required:true
    },
    title:{
        type: String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
   userID: {
       type: String,
       default: ''
   },
   nickname: {
       type: String,
       default: ''
   }
})

module.exports = mongoose.model('Topic',topicSchema);