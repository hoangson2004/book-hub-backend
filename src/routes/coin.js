const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getCoinBalance } = require('../controllers/coin');

const router = express.Router();

router.get('/balance', authMiddleware, getCoinBalance);

module.exports = router;