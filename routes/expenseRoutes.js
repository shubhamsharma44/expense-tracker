const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense');
const userAuth = require('../middleware/auth');


router.post('/addExpense', userAuth.authenticate, expenseController.postExpense);
router.get('/getExpense', userAuth.authenticate, expenseController.getExpense);
router.delete('/:expenseId', userAuth.authenticate, expenseController.deleteExpense);

module.exports = router;
