const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware'); 

router.get('/search', authMiddleware, userController.searchUsers);
router.post('/add-friend', authMiddleware, userController.addFriend);
router.post('/remove-friend', authMiddleware, userController.removeFriend)

module.exports = router;