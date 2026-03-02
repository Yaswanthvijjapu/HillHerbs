const router = require('express').Router();
const chatController = require('../controllers/chat.controller');

router.post('/ask', chatController.askChatBot);

module.exports = router;