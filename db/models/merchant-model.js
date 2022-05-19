const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//user schema for data object structure
const merchantSchema = new Schema({
    companyName: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    hash: {
        type: String
    },
    email: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Merchant = mongoose.model('merchant', merchantSchema);

module.exports = Merchant;