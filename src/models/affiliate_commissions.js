const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
    affiliateId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
    	type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
    	type: Number,
    	required: true,
        default: 0
    },
    value: {
    	type:Number,
    	required: true
    }
}, {timestamps: true});


module.exports = mongoose.model('Affiliate_Commissions', commissionSchema);