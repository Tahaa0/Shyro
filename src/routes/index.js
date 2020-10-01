const auth = require('./auth');
const user = require('./user');
const funnel = require('./funnel');


const authenticate = require('../middlewares/authenticate');

module.exports = app => {
    app.get('/', (req, res) => {
    	if(req.session['token']){
    		res.redirect('/dashboard');
    	}else{
    		res.render('index.ejs')
    	}
    });

    app.get('/dashboard', (req,res)=>{
        if(req.session['token']){
            res.render('dashboard.ejs');
        }else{
            res.redirect('/');
        }
    });

    app.get('/funnel/:id', (req,res)=>{
        if(req.session['token']){
            res.render('portal.ejs',{id:req.params.id});
        }else{
            res.redirect('/');
        }
    });

    app.get('/recover', (req,res)=>{
    	res.render('askreset.ejs');
    });

    app.use('/api/auth', auth);
    app.use('/api/user', authenticate, user);
    app.use('/api/funnel', authenticate, funnel);

};