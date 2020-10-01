const Funnels = require('../models/funnel');
const User = require('../models/user');
const tools = require('../utils/tools');

exports.index = async function (req, res) {
    const funnels = await Funnels.find({userId:req.session['user_id']});
    res.status(200).json({funnels});
};


exports.create = async (req, res) => {
    try {
    	const {title} = req.body;
        const steps = JSON.parse(req.body.steps);
        const id = req.session['user_id'];

        var user_ = await User.findById(id);

    	var dt = {
    		userId: user_._id,
    		title:title,
    		steps:steps,
    	}
    	const funnel_ = new Funnels(dt);

        await funnel_.save();

        res.status(200).json(funnel_);

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})
    }
};

exports.update = async function (req, res) {
    try {

        const update = req.body;
        update.steps = JSON.parse(update.steps); //parsing

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
/*
exports.updateFunnel = async (req, res)=>{
	try {
		const {id} = req.body;
        const {steps} = req.body;

        var map_ = await Maps.findById(id);
        map_.map = map;
        await map_.save();

        res.status(200).json(map_);

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}
*/
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
};