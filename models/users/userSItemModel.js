const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    postID:{
        type: String
    }
});

module.exports = mongoose.model('User Saved Items', dataSchema);
