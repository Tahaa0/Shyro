const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    funnelId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content : Array,
    sales : Array
}, {timestamps: true});


module.exports = mongoose.model('Webhooks', webhookSchema);