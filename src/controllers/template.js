const Templates = require('../models/template');
const User = require('../models/user');

exports.indexOwn = async function (req, res) {
    const templates = await Templates.find({userId:req.session['user_id']});
    res.status(200).json({templates});
};

exports.index = async function (req, res) {
    const templates = await Templates.find({});
    res.status(200).json({templates});
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const template_ = await Templates.findById(id);

        if (!template_) return res.status(401).json({message: 'Template does not exist'});
        
        res.status(200).json({template_});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.create = async (req, res) => {
    try {
    	var {title} = req.body;
        var {price} = req.body;
        var g = parseInt(req.body.guarantee);
        switch(g){
            case 0:
            case 3:
            case 7:
            case 15:
            case 30:
                //do nothing
                break;
            default:
                g = 0;
                break;
        }
        var {template_link} = req.body;
        var {description} = req.body;
        
        var features_ = JSON.parse(req.body.features);
        var features = [];
        for(var i=0;i<features_.length;i++){
            if(features_[i].length>0){
                features.push(features_[i]);
            }
        }

        var faq_ = JSON.parse(req.body.faq);
        var faq = [];
        for(var i=0;i<faq_.length;i++){
            if(faq_.length>0){
                faq.push(faq_[i]);
            }
        }

        var {main_img} = req.body;
        var {bottom_imgs} = req.body;
        if(bottom_imgs == ""){
            bottom_imgs = [];
        }else{
            bottom_imgs = bottom_imgs.split('\n');
        }
        
        const id = req.session['user_id'];

        var user_ = await User.findById(id);

    	var dt = {
    		userId: user_._id,
            username: user_.username,
    		title:title,
    		price:parseFloat(price),
            guarantee:g,
            template_link:template_link,
            description:description,
            features:features,
            faq:faq,
            main_img:main_img,
            bottom_imgs:bottom_imgs
    	}
    	const template_ = new Templates(dt);

        await template_.save();

        res.status(200).json(template_);

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})
    }
};

/*
exports.update = async function (req, res) {
    try {

        const update = req.body;
        update.steps = JSON.parse(update.steps); //parsing
        update.apps = JSON.parse(update.apps);

        const id = req.params.id;
        const userId = req.session['user_id'];

        //Make sure the passed id is that of the logged in user
        const funnel_ = await Funnels.findById(id);

        if (!funnel_) return res.status(401).json({message: 'Funnel does not exist'});
        if (req.session['user_id'].toString() !== funnel_.userId.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        const funnel = await Funnels.findByIdAndUpdate(id, {$set: update}, {new: true});

        return res.status(200).json({funnel: funnel, message: 'Funnel has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const funnel_ = await Funnels.findById(id);

        if (!funnel_) return res.status(401).json({message: 'Funnel does not exist'});
        if (req.session['user_id'].toString() !== funnel_.userId.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        res.status(200).json({funnel_});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;

        const funnel_ = await Funnels.findById(id);

        if (!funnel_) return res.status(401).json({message: 'Funnel does not exist'});
        if (req.session['user_id'].toString() !== funnel_.userId.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

       	await Funnels.findByIdAndDelete(id);
        res.status(200).json({message: 'Funnel has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};*/