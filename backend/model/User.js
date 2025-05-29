const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
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
    img: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "hey there I am using chat app"
    },
    lastSeen: {
        type: Date,
        default: Date.now()
    },
    isOnline: {
        type: Boolean,
        default: false
    }
} , {timestamps: true});

module.exports = mongoose.model('User' , userSchema);