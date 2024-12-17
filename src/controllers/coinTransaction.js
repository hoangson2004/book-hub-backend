const coinTransactionService = require('../services/coinTransaction');
const coinService = require('../services/coin');

exports.createCoinTransaction = async (req, res) => {
    const { amount, type, transactionId } = req.body;
    const userId = req.user.userId;  // Lấy userId từ token (đã có trong req.user)
    
    try {
        const transaction = await coinTransactionService.createCoinTransaction(userId, amount, type, transactionId);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllCoinTransactions = async (req, res) => { // Admin only
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to access this resource' });
        }
        const transactions = await coinTransactionService.getAllCoinTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCoinTransactionById = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await coinTransactionService.getCoinTransactionById(transactionId);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTransactionStatus = async (req, res) => { // Admin only
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to update this transaction' });
        }

        const { status } = req.body;
        const transactionId = req.params.transactionId;
        const transaction = await coinTransactionService.getCoinTransactionById(transactionId);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.status === 'Pending' && status === 'Success') {
            const userId = transaction.userId;  
            const amount = transaction.amount; 

            await coinService.updateCoinBalance(userId, amount);
        }

        transaction.status = status;
        await transaction.save();

        return res.json(transaction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getCoinTransactionByUserId = async (req, res) => {
    const userId = req.user.userId;  
    try {
        const transactions = await coinTransactionService.getCoinTransactionByUserId(userId);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
