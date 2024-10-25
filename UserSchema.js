const mongoose = require("../configuration/db");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    files: [{ type: String }]
});

const User = mongoose.model('User', UserSchema, "users");

module.exports = User;