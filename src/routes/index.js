const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const categoriesRoutes = require('./categories');
const monthsRoutes = require('./months');
const incomesRoutes = require('./incomes');

router.use('/users', userRoutes);
router.use('/categories', categoriesRoutes);
router.use('/months', monthsRoutes);
router.use('/incomes', incomesRoutes);

module.exports = router;