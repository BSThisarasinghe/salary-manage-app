const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const userController = require('../controllers/user.controller');

router.post('/signup', userController.postUsers);
router.post('/signin', userController.siginIn);
router.post('/token', userController.getToken);
router.get('/checkunique/:email', userController.checkUniqueEmail);
router.delete('/signout', auth.authenticateToken, userController.signOut);
router.get('/user', auth.authenticateToken, userController.getUserProfile);

module.exports = router;