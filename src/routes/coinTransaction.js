const express = require('express');
const router = express.Router();
const { getAllCoinTransactions, createCoinTransaction, getCoinTransactionById,
    updateTransactionStatus, getCoinTransactionByUserId } = require('../controllers/coinTransaction');
const authMiddleware = require('../middleware/authMiddleware');

router.route('/getAll').get(authMiddleware, getAllCoinTransactions)  // Admin only

router.route('/').post(authMiddleware, createCoinTransaction) 
    .get(authMiddleware, getCoinTransactionByUserId);

router.route('/:transactionId')
    .get(authMiddleware, getCoinTransactionById)
    .put(authMiddleware, updateTransactionStatus); // Admin only 

module.exports = router;
