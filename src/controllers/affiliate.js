const Affiliates = require('../models/affiliate');
const Commissions = require('../models/affiliate_commissions');
const User = require('../models/user');

exports.getIndex = async function (req,res){
    try {
    	console.log(req.cookies);
        if(req.query['aff']){
            const affiliate_ = await Affiliates.findOne({userId:req.query['aff']});
            if(!affiliate_){
            	const user_ = await User.findById(req.query['aff']);
            	if(user_){
            		const affiliate_ = new Affiliates({userId:req.query['aff'],referrals:[]});
        			await affiliate_.save();		
            	}
            }
            res.cookie('aff', req.query['aff'], {maxAge: 2592000000});
        }

        if(req.session['token']){
            res.render('landing/index.ejs',{logged:true});
        }else{
            res.render('landing/index.ejs',{logged:false});
        }
        
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.createCommission = function(user_id,due){
    User.findById(user_id,function(err,user){
        if(user.referrer){
        	Affiliates.findById(user.referrer,function(err,affiliate){
        		Commissions.create({
        			affiliateId:affiliate._id,
        			userId:user_id,
        			value:due*affiliate.rate
        		})
        	});
        }
    });
}
