const Funnels = require('../models/funnel');
const Webhooks = require('../models/webhook');
const User = require('../models/user');

exports.listen = async (req, res) => {
    try {
        const id = req.params.id;

        const webhook_ = await Webhooks.findOne({funnelId:id});

        if (!webhook_) return res.status(401).json({message: 'Webhook does not exist'});
        
        var new_content = webhook_.content;
        new_content.push(req.body);

        const webhook = await Webhooks.findByIdAndUpdate(webhook_._id, {$set: {content:new_content}}, {new: true});

        res.status(200).end();
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

/*
    
*/