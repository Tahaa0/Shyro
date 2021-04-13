const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    referrals: Array
}, {timestamps: true});


module.exports = mongoose.model('Affiliates', affiliateSchema);