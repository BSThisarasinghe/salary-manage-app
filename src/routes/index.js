const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const categoriesRoutes = require('./categories');
const monthsRoutes = require('./months');

router.use('/users', userRoutes);
router.use('/categories', categoriesRoutes);
router.use('/months', monthsRoutes);

module.exports = router;