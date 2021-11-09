const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    registeredAt: {
        type: Date,
    },
    basic:{
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
        },
    },
    contact:{
        email: {
            type: String,
        },
        phone: {
            type: Number,
        },
    },
    work:{
        imr_no:{
            type: Number,
            required: true
        },
        education: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        },
        experience: {
            type: Number,
        },
        languages: {
            type: String,
        },
        bio:{
            type: String,
        },
    },
    tags:[{
        type: String,
    }],
    image: {
        type:String,
        default: ''
    },
});

module.exports = mongoose.model('Temp Doc Details', dataSchema);
