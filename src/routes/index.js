const auth = require('./auth');
const user = require('./user');
const funnel = require('./funnel');
const template = require('./template');
const ticket = require('./ticket');
const funnelscript = require('./funnelscript');
const paypal = require('./paypal');
const webhook = require('./webhook');

const FunnelController = require('../controllers/funnel');


const authenticate = require('../middlewares/authenticate');

module.exports = app => {
    app.get('/', (req, res) => {
    	res.render('landing/index.ejs')
    });

    app.get('/index.html', (req, res) => {
        res.redirect('/')
    });

    app.get('/index', (req, res) => {
        res.redirect('/')
    });

    app.get('/login', (req, res) => {
        if(req.session['token']){
            res.redirect('/dashboard');
        }else{
            res.render('index.ejs')
        }
    });

    app.get('/dashboard', FunnelController.checkMembership);

    app.get('/funnels', (req,res)=>{
        if(req.session['token']){
            res.render('funnels.ejs',{sidebar_index:1});
        }else{
            res.redirect('/login');
        }
    });

    app.get('/apps', (req,res)=>{
        if(req.session['token']){
            res.render('apps.ejs',{sidebar_index:2});
        }else{
            res.redirect('/login');
        }
    });

    app.get('/documentation', (req,res)=>{
        if(req.session['token']){
            res.render('documentation.ejs',{sidebar_index:4});
        }else{
            res.redirect('/login');
        }
    });

    app.get('/subscriptions', (req,res)=>{
        if(req.session['token']){
            res.render('subscriptions.ejs',{sidebar_index:5});
        }else{
            res.redirect('/login');
        }
    });

    app.get('/support', (req,res)=>{
        if(req.session['token']){
            res.render('support.ejs',{sidebar_index:6});
        }else{
            res.redirect('/login');
        }
    });

    app.get('/account', (req,res)=>{
        if(req.session['token']){
            res.render('account.ejs');
        }else{
            res.redirect('/login');
        }
    });

    app.get('/marketplace', (req,res)=>{
        if(req.session['token']){
            res.render('marketplace.ejs',{sidebar_index:3});
        }else{
            res.render('marketplace0.ejs');
        }
    });

    app.get('/marketplace/my-listings', (req,res)=>{
        if(req.session['token']){
            res.render('mp_listings.ejs',{sidebar_index:3});
        }else{
            res.redirect('/login');
        }
    });

    app.get('/marketplace/add', (req,res)=>{
        if(req.session['token']){
            res.render('marketplace_add.ejs',{sidebar_index:3});
        }else{
            res.redirect('/login');
        }
    });

    app.get('/marketplace/product/:id', (req,res)=>{
        if(req.session['token']){
            res.render('mp_product.ejs',{id:req.params.id,sidebar_index:3});
        }else{
            res.redirect('/login');
        }
    });

    app.get('/marketplace/product/edit/:id', (req,res)=>{
        if(req.session['token']){
            res.render('marketplace_edit.ejs',{id:req.params.id,sidebar_index:3});
        }else{
            res.redirect('/login');
        }
    });


    app.get('/paypaltest', (req,res)=>{
        res.render('paypaltest.ejs',{sidebar_index:99});
    });

    /*app.get('/funnel/:id', (req,res)=>{
        if(req.session['token']){
            res.render('portal.ejs',{id:req.params.id});
        }else{
            res.redirect('/');
        }
    });*/

    app.get('/funnel/:id', FunnelController.portal);

    app.get('/recover', (req,res)=>{
    	res.render('askreset.ejs');
    });

    app.use('/api/auth', auth);
    app.use('/api/user', authenticate, user);
    app.use('/api/funnel', authenticate, funnel);
    app.use('/api/ticket', authenticate, ticket);
    app.use('/api/funnelscript', funnelscript);
    app.use('/api/paypal/', paypal);
    app.use('/api/webhook/',webhook);

    //marketplace
    app.use('/api/template', authenticate, template);

};