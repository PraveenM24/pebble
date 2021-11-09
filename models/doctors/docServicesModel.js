const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    doctor_id: {
        type: String,
    },
    enquiry:{
        enabled: {
            type: Boolean
        },
        interval:{
            type: Number
        },
        cost: {
            type: Number
        }
    },
    therapy:{
        enabled: {
            type: Boolean
        },
        interval:{
            type: Number
        },
        cost: {
            type: Number
        }
    },
    consultation:{
        enabled: {
            type: Boolean
        },
        interval:{
            type: Number
        },
        cost: {
            type: Number
        }
    },
});

module.exports = mongoose.model('Doc Services', dataSchema); 
