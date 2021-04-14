const express = require('express');
const {check} = require('express-validator');

const Paypal = require('../controllers/paypal');

const router = express.Router();

//PAYMENT
router.post('/create-payment', Paypal.createPayment);
router.post('/execute-payment', Paypal.executePayment);

module.exports = router;