const express = require('express');
const {check} = require('express-validator');

const Template = require('../controllers/template');

const router = express.Router();

//INDEX
router.get('/', Template.index);
router.get('/own',Template.indexOwn);
//STORE
router.post('/', [
    check('title').not().isEmpty().withMessage('Title is empty.'),
],Template.create);
//SHOW
router.get('/:id',  Template.show);
//UPDATE
router.put('/:id', Template.update);

module.exports = router;