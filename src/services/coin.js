const Coin = require('../models/Coin');

exports.getCoinBalance = async (userId) => {
  try {
    let coin = await Coin.findOne({ userId });
    if (!coin) {
      coin = new Coin({
        userId,
        balance: 0, 
      });
      await coin.save();
    }

    return coin.balance;
  } catch (error) {
    throw new Error('Error fetching coin balance: ' + error.message);
  }
};

exports.updateCoinBalance = async (userId, amount) => {
  try {
    const coin = await Coin.findOne({ userId });

    if (!coin) {
      throw new Error('Coin balance not found for the user');
    }
    coin.balance += amount;
    await coin.save();

    return coin.balance;
  } catch (error) {
    throw new Error('Error updating coin balance: ' + error.message);
  }
};
