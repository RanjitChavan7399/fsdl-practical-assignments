const express = require('express');
const { register, login, getMe } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// add getMe route when authMiddleware is added, or leave it for now
// router.get('/me', protect, getMe);

module.exports = router;
