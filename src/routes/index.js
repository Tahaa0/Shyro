const auth = require('./auth');
const user = require('./user');
const funnel = require('./funnel');
const funnelscript = require('./funnelscript');


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

    app.get('/funnels', (req,res)=>{
        if(req.session['token']){
            res.render('funnels.ejs');
        }else{
            res.redirect('/');
        }
    });

    app.get('/apps', (req,res)=>{
        if(req.session['token']){
            res.render('apps.ejs');
        }else{
            res.redirect('/');
        }
    });

    app.get('/documentation', (req,res)=>{
        if(req.session['token']){
            res.render('documentation.ejs');
        }else{
            res.redirect('/');
        }
    });

    app.get('/subscriptions', (req,res)=>{
        if(req.session['token']){
            res.render('subscriptions.ejs');
        }else{
            res.redirect('/');
        }
    });

    app.get('/support', (req,res)=>{
        if(req.session['token']){
            res.render('support.ejs');
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
    app.use('/api/funnelscript', funnelscript);

};