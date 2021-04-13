const Affiliates = require('../models/affiliate');
const User = require('../models/user');

exports.getIndex = async function (req,res){
    try {
        if(req.params['aff']){
            const affiliate_ = await Affiliates.findOne({userId:req.params['aff']});
        }

        res.render('landing/index.ejs')
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
