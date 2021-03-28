const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const monthsController = require('../controllers/months.controller');

router.post('/month', auth.authenticateToken, monthsController.postMonth);
router.get('/monthlist', auth.authenticateToken, monthsController.getMyMonthList);
router.get('/month/:id', auth.authenticateToken, monthsController.getIndividualMonth);
router.put('/month/:id', auth.authenticateToken, monthsController.updateMonth);
router.delete('/month/:id', auth.authenticateToken, monthsController.deleteMonth);

module.exports = router;