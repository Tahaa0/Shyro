const Tickets = require('../models/ticket');
const User = require('../models/user');
const tools = require('../utils/tools');
const request = require('request');

const USER_ADMIN = "5f4f85eb8005ec09e8cb3bc8";

exports.index = async function (req, res) {
    if(req.session['user_id'] != USER_ADMIN){
        const tickets = await Tickets.find({userId:req.session['user_id']}).sort({updatedAt:-1});
        for(var i=0;i<tickets.length;i++){
            Tickets.findByIdAndUpdate(tickets[i]._id,{$set: {read:true}}, {new: true},function(err,data){});
        }
        res.status(200).json({tickets});
    }else{
        const tickets = await Tickets.find({}).sort({updatedAt:-1});
        res.status(200).json({tickets});
    }   
    
};


exports.create = async (req, res) => {
    try {
    	const {title} = req.body;
        const {priority} = req.body;
        const {department} = req.body;
        const {message} = req.body;
        const id = req.session['user_id'];

        var user_ = await User.findById(id);

    	var dt = {
    		userId: user_._id,
            username: user_.username,
    		title:title,
    		priority:priority,
            department:department,
            message:message,
            replies:[]
    	}
    	const ticket_ = new Tickets(dt);

        await ticket_.save();

        res.status(200).json(ticket_);

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})
    }
};

exports.close = async function (req, res) {
    try {
        const id = req.body.id;

        var ticket_ = await Tickets.findById(id);

        if (!ticket_) return res.status(401).json({message: 'Ticket does not exist'});
        if (req.session['user_id'].toString() !== ticket_.userId.toString() && req.session['user_id'].toString() !== USER_ADMIN) return res.status(401).json({message: "Sorry, you don't have the permission to close this ticket."});

        ticket_.open = false;
        if(req.session['user_id'].toString() == USER_ADMIN){
            ticket_.read = false;
        }
        await ticket_.save();

        res.status(200).json({message: 'Ticket has been closed'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.reply = async function (req, res) {
    try {
        const id = req.body.id;
        const message = req.body.message;
        const user_id = req.session['user_id'];

        var ticket_ = await Tickets.findById(id);

        if (!ticket_) return res.status(401).json({message: 'Ticket does not exist'});
        if (req.session['user_id'].toString() !== ticket_.userId.toString() && req.session['user_id'].toString() !== USER_ADMIN) return res.status(401).json({message: "Sorry, you don't have the permission to close this ticket."});

        const user_ = await User.findById(user_id);

        var reply = {
            user_id:user_id,
            full_name:user_.firstName+" "+user_.lastName,
            message:message,
            timestamp:new Date().getTime()
        }

        ticket_.replies.push(reply);
        if(req.session['user_id'].toString() == USER_ADMIN){
            console.log("USER_ADMIN");
            ticket_.read = false;
        }
        await ticket_.save();

        res.status(200).json({message: 'Message was sent successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.notification = async function (req, res) {
    const tickets = await Tickets.find({userId:req.session['user_id'],read:false});
    if(tickets.length>0){
        res.status(200).json({notify:true});
    }else{
        res.status(200).json({notify:false});
    }
};
/*exports.destroy = async function (req, res) {
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