const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, roomController.createRoom);
router.post('/join', authMiddleware, roomController.joinRoom);
router.post('/leave', authMiddleware, roomController.leaveRoom);
router.post('/invite', authMiddleware, roomController.inviteFriends);
router.get('/:id', authMiddleware, roomController.getRoomById);

module.exports = router;