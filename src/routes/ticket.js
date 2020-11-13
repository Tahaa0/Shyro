const express = require('express');
const {check} = require('express-validator');

const Ticket = require('../controllers/ticket');

const router = express.Router();

//INDEX
router.get('/', Ticket.index);

//STORE
router.post('/', [
    check('title').not().isEmpty().withMessage('Title is empty.'),
],Ticket.create);

router.put('/close', Ticket.close);
router.put('/reply', Ticket.reply);
/*
//SHOW
router.get('/:id',  Funnel.show);
//UPDATE

//DELETE
router.delete('/:id', Funnel.destroy);*/

module.exports = router;