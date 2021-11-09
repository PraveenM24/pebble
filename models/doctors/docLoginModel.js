const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Doc Login', dataSchema); 
