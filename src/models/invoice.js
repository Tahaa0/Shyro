const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
    	type: Number,
    	default: 0
    },
    datePaid: {
    	type: Date,
    	required: false
    },
    value: {
    	type:Number,
    	required: true
    }
}, {timestamps: true});


module.exports = mongoose.model('Invoices', invoiceSchema);