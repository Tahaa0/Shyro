const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    rate: {
    	type: Number,
    	required: true,
    	default: 0.15
    },
    referrals: Array
}, {timestamps: true});


module.exports = mongoose.model('Affiliates', affiliateSchema);