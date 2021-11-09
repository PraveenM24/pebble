const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    contentType:{
        type: String,
    },
    url:{
        type: String,
    },
    postedOn: {
        type:String, 
        default: new Date()
    },
    thumbnail:String,
});

module.exports = mongoose.model('Extra Content', dataSchema);