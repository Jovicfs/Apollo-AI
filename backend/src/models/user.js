const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    backgroundImageUrl: {
        type: String
    },
    profileImageUrl:{
        type: String
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    userConversations: {
        type: String,
        required: false,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);