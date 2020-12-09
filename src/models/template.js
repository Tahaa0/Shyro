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
    guarantee : {
        type: Number,
        default: 0
    },
    template_link: {
        type: String,
        required: true
    },
    description: String,
    features: Array,
    faq: Array,
    main_img: String,
    bottom_imgs: String
}, {timestamps: true});

module.exports = mongoose.model('Templates', templateSchema);