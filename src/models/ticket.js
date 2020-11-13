const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: 'Title is empty.',
        max: 144
    },
    open: {
        type: Boolean,
        default: true
    },
    priority:{
        type: String,
        default: 'Medium'
    },
    department:{
        type: String
    },
    replies : {
        type: Array
    },
    message:{
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Tickets', ticketSchema);