const auth = require('./auth');
const user = require('./user');


const authenticate = require('../middlewares/authenticate');

module.exports = app => {
    app.get('/', (req, res) => {
    	if(req.session['token']){
    		res.render('portal.ejs');
    	}else{
    		res.render('index.ejs')
    	}
    });

    app.get('/recover', (req,res)=>{
    	res.render('askreset.ejs');
    });

    app.use('/api/auth', auth);
    app.use('/api/user', authenticate, user);

};