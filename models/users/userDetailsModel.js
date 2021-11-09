const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },
    last_name: {
        type: String, 
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    image:{
        type:String,
        default: ''
    },

});

module.exports = mongoose.model('User Details', dataSchema);
