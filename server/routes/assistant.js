const express = require('express');
const { chat, getGreeting } = require('../controllers/assistantController');

const router = express.Router();

router.get('/greeting', getGreeting);
router.post('/chat', chat);

module.exports = router;
