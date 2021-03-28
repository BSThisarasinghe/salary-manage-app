const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const categoriesController = require('../controllers/categories.controller');

router.post('/category', auth.authenticateToken, categoriesController.postCategories);
router.get('/categorylist', auth.authenticateToken, categoriesController.getMyCategoryList);
router.get('/category/:id', auth.authenticateToken, categoriesController.getIndividualCategory);
router.put('/category/:id', auth.authenticateToken, categoriesController.updateCategory);
router.delete('/category/:id', auth.authenticateToken, categoriesController.deleteCategory);

module.exports = router;