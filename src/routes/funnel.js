const express = require('express');
const {check} = require('express-validator');

const Funnel = require('../controllers/funnel');

const router = express.Router();

//INDEX
router.get('/', Funnel.index);

//STORE
router.post('/', [
    check('title').not().isEmpty().withMessage('Title is empty.'),
],Funnel.create);

//SHOW
router.get('/:id',  Funnel.show);
//UPDATE
router.put('/:id', Funnel.update);
//DELETE
router.delete('/:id', Funnel.destroy);
//Get sales
router.get('/sales/:id', Funnel.getSales);

module.exports = router;