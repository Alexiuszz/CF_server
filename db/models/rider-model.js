const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//user schema for data object structure
const riderSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    CEO: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    hash: {
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    riderName: {
        type: String,
    },
    riderId: {
        type: String,
        required: true,
    },
    riderGender: {
        type: String
    },
    riderPhone: {
        type: Number
    },
}, { timestamps: true });

const Rider = mongoose.model('rider', riderSchema);

module.exports = Rider;