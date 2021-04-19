const Invoices = require('../models/invoice');
const User = require('../models/user');

exports.verifySubscriptions = function(){
    User.find({membershipLevel:2, nextBilling: {$lte : Date.now()}}, function (err, users) {
        if(!err){
            var invoices = [];
            for(var i=0;i<users.length;i++){
                createInvoice(users[i]._id,calculateInvoice(users[i]));
            }
        }else{
            console.log(err);
        } 
    });
}

exports.clearUser = function(user_id){
    Invoices.find({userId:user_id,status:0},function(err,invoices){
        if(!err){
            for(var i=0;i<invoices.length;i++){
                Invoices.findByIdAndUpdate(invoices[i]._id,{$set: {status:1}}, {new: true},function(err,data){});
            }
        }else{
            console.log(err);
        } 
    });
    User.findByIdAndUpdate(user_id,{$set: {currentEarned:0}}, {new: true},function(err,data){});
}

exports.getTotalDue = async function(user_id){
    try{
        var invoices = await Invoices.find({userId:user_id,status:0});
        var totalDue = 0;
        for(var i=0;i<invoices.length;i++){
            totalDue += invoices[i].value;
        }
        return totalDue;
    }catch(error){
        console.log(error);
    }
    
}

var createInvoice = function(user_id,due){
    User.findById(user_id,function(err,user){
        var new_billing = Date.parse(user.nextBilling) + 30*24*60*60*1000;
        User.findByIdAndUpdate(user_id,{$set: {nextBilling:new_billing}}, {new: true},function(err,data){
            
        });
    });
    Invoices.create({
        userId:user_id,
        value:due
    });
}

var calculateInvoice = function(user){
    if(user.currentEarned < 1000) return 29;
    if(user.currentEarned < 2500) return 39;
    if(user.currentEarned < 5000) return 79;
    if(user.currentEarned < 7500) return 119;
    if(user.currentEarned < 10000) return 159;
    if(user.currentEarned < 12500) return 199;
    if(user.currentEarned < 15000) return 239;
    if(user.currentEarned < 17500) return 269;
    if(user.currentEarned < 20000) return 289;
    if(user.currentEarned < 30000) return 389;
    return 489;
}

exports.indexOwn = async function (req, res) {
    const invoices = await Invoices.find({userId:req.session['user_id']});
    res.status(200).json({invoices});
};
