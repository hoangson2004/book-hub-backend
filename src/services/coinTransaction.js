const CoinTransaction = require('../models/CoinTransaction');

exports.getAllCoinTransactions = async () => {
  try {
    return await CoinTransaction.find().populate('userId', 'name email');
  } catch (error) {
    throw new Error('Error fetching transactions: ' + error.message);
  }
};

exports.getCoinTransactionById = async (transactionId) => {
  try {
    return await CoinTransaction.findById(transactionId).populate('userId', 'name email');
  } catch (error) {
    throw new Error('Error fetching transaction by ID: ' + error.message);
  }
};

exports.createCoinTransaction = async (userId, amount, type, transactionId) => {
  try {
    const transaction = new CoinTransaction({
      userId,
      amount,
      type,
      transactionId,
    });
    return await transaction.save();
  } catch (error) {
    throw new Error('Error creating transaction: ' + error.message);
  }
};

exports.updateTransactionStatus = async (transactionId, status) => {
  try {
    const transaction = await CoinTransaction.findById(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }
    transaction.status = status;
    await transaction.save();

    return transaction;
  } catch (error) {
    throw new Error('Error updating transaction status: ' + error.message);
  }
};

exports.getCoinTransactionByUserId = async (userId) => {
  try {
    return await CoinTransaction.find({ userId });
  } catch (error) {
    throw new Error('Error fetching transactions for user: ' + error.message);
  }
};
