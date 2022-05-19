const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//user schema for data object structure
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    hash: {
        type: String
    },
    googleId: {
        type: String,
    },
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

module.exports = User;