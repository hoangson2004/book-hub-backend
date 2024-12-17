const coinService = require('../services/coin');

exports.getCoinBalance = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const balance = await coinService.getCoinBalance(userId);
    res.status(200).json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
