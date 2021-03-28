const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const categoriesRoutes = require('./categories');

router.use('/users', userRoutes);
router.use('/categories', categoriesRoutes);

module.exports = router;