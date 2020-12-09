const express = require('express');
const {check} = require('express-validator');

const Template = require('../controllers/template');

const router = express.Router();

//INDEX
router.get('/', Template.index);

//STORE
router.post('/', [
    check('title').not().isEmpty().withMessage('Title is empty.'),
],Template.create);


module.exports = router;