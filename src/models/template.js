const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: 'Title is empty.',
        max: 144
    },
    price : {
        type: Number,
        required: true
    },
    tags : Array,
    guarantee : {
        type: Number,
        default: 0
    },
    screenshots: Array
}, {timestamps: true});

module.exports = mongoose.model('Templates', templateSchema);