const express = require('express');
const {check} = require('express-validator');

const Webhook = require('../controllers/webhook');

const router = express.Router();

//PAYMENT
router.post('/hook', Webhook.listen);

module.exports = router;