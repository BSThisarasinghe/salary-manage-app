const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const expensesController = require('../controllers/expenses.controller');

router.post('/expense', auth.authenticateToken, expensesController.postExpense);
router.get('/expenselist', auth.authenticateToken, expensesController.getMyExpenseList);
router.get('/expense/:id', auth.authenticateToken, expensesController.getIndividualExpense);
router.put('/expense/:id', auth.authenticateToken, expensesController.updateExpense);
router.delete('/expense/:id', auth.authenticateToken, expensesController.deleteExpense);

module.exports = router;