const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: [true, 'ID is required.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required.']
    },
    date: {
        isodate: Date,
        stringdate: String
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);