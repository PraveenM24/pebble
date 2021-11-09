const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    mood: {
        type: String
    },
    time: {
        type: Date
    }
});

module.exports = mongoose.model('User Mood', dataSchema);
