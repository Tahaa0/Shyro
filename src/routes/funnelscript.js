const express = require('express');
const {check} = require('express-validator');

const Funnel = require('../controllers/funnel');

const router = express.Router();

//SCRIPT
router.get('/head_script/:id', Funnel.headScript);
router.get('/body_script/:id', Funnel.bodyScript);

module.exports = router;