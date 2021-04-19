const Funnels = require('../models/funnel');
const Webhooks = require('../models/webhook');
const User = require('../models/user');

exports.listen = async (req, res) => {
    try {
        const id = req.params.id;

        const webhook_ = await Webhooks.findOne({funnelId:id});

        if (!webhook_) return res.status(401).json({message: 'Webhook does not exist'});
        
        var new_content = webhook_.content;
        var new_sales = webhook_.sales;
        new_content.push(req.body);
        var userId = webhook_.userId;

        if(req.body.purchase && req.body.event == "created"){
            new_sales.push(req.body.purchase);
            var user_ = await User.findById(userId);
            var new_currentEarned = user_.currentEarned + req.body.purchase.original_amount_cents/100;
            var user = await User.findByIdAndUpdate(userId,{$set:{currentEarned:new_currentEarned}}, {new:true});
        }

        const webhook = await Webhooks.findByIdAndUpdate(webhook_._id, {$set: {content:new_content,sales:new_sales}}, {new: true});

        res.status(200).end();
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

/*
    
*/