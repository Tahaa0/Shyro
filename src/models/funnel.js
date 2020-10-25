const mongoose = require('mongoose');

const funnelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: 'Title is empty.',
        max: 144
    },
    apps : {
        type: Map,
        of: Boolean
    },
    steps : Array
}, {timestamps: true});

module.exports = mongoose.model('Funnels', funnelSchema);