const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const categoriesRoutes = require('./categories');
const monthsRoutes = require('./months');
const incomesRoutes = require('./incomes');
const expensesRoutes = require('./expenses');

router.use('/users', userRoutes);
router.use('/categories', categoriesRoutes);
router.use('/months', monthsRoutes);
router.use('/incomes', incomesRoutes);
router.use('/expenses', expensesRoutes);

module.exports = router;