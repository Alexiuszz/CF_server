const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//user schema for data object structure
const courierSchema = new Schema({
    name: {
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
    locations: {
        type: Array,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    inventory: {
        type: Object
    },
    logo: {
        type: Buffer,      
    },
    details: {
        type: String
    }
}, { timestamps: true });

const Courier = mongoose.model('courier', courierSchema);

module.exports = Courier;