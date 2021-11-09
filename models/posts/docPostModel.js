const mongoose = require("mongoose");

var currentTime = new Date();
var ISTOffset = 330;
var ISTTime = new Date(currentTime.getTime() + (ISTOffset)*60000);

const dataSchema = new mongoose.Schema({
    doctorInfo:{
        doctor_id: {
            type: String,
        },
        name:{
            type: String,
        },
        education: {
            type: String,
        },
        image: {
            type: String,
        }
    },
    image:[{
        type: String,
        default: ''
    }], 
    postInfo:{
        description:{
            type: String,
        },
        date: {
            type: Date, 
            default: ISTTime
        },
    },
    postLikes: {
        type: Number,
        default: 0
    },
    postComments:[{ 
        user_id:{
            type: String,
        },
        comment: {
            type: String,
        },
        date: {
            type:String, 
            default: ISTTime
        } 
    }]
});

module.exports = mongoose.model('Doc Posts', dataSchema);