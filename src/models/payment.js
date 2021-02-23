const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    paymentMethod: {
        type : String,
        default : "paypal"
    },
    amount: {
        type : Number,
        required : true
    }
}, {timestamps: true});

module.exports = mongoose.model('Payments', paymentSchema);