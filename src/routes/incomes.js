const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const incomesController = require('../controllers/incomes.controller');

router.post('/income', auth.authenticateToken, incomesController.postIncome);
router.get('/incomelist', auth.authenticateToken, incomesController.getMyIncomeList);
router.get('/income/:id', auth.authenticateToken, incomesController.getIndividualIncome);
router.put('/income/:id', auth.authenticateToken, incomesController.updateIncome);
router.delete('/income/:id', auth.authenticateToken, incomesController.deleteIncome);

module.exports = router;