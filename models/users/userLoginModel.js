const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
    },
    verified: {
        type: Boolean,
        deafult: false
    },
    uniqueString: {
        type: String, 
    } 
});

module.exports = mongoose.model('User Login', dataSchema); 
