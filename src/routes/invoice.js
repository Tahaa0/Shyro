const express = require('express');
const {check} = require('express-validator');

const Invoice = require('../controllers/invoice');

const router = express.Router();

//INDEX
router.get('/', Invoice.indexOwn);

module.exports = router;