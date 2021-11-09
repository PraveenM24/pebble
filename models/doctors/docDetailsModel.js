const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    access_blocked: {
        type: Boolean,
        default: false,
    },
    doctor_id: {
        type: String,
    },
    zoom_id:{
        type: String,
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
            default: ''
        },
    },
    tags:[{
        type: String,
    }],
    ratings: {
        type: Number,
        default: 0
    },
    image: {
        type:String,
        default: ''
    },
});

module.exports = mongoose.model('Doc Details', dataSchema);
