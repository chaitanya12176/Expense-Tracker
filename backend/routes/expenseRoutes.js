const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/', expenseController.createExpense);
router.get('/', expenseController.getAllExpenses);
router.delete('/:id', expenseController.deleteExpense);
router.get('/summary', expenseController.getSummary);

module.exports = router;