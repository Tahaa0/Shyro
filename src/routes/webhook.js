const express = require('express');
const {check} = require('express-validator');

const Webhook = require('../controllers/webhook');

const router = express.Router();

//WEBHOOK
router.post('/hook/:id', Webhook.listen);

module.exports = router;