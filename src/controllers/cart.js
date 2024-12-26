const cartService = require('../services/cart');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const carts = await cartService.getCartByUserId(userId);
    console.log(carts);
    res.json({ data: carts, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { bookId, quantity } = req.body;

    if (!bookId || !quantity) {
      return res.status(400).json({ error: 'Book ID and quantity are required' });
    }

    const cart = await cartService.addToCart(userId, bookId, quantity);
    res.json({ data: cart, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { bookId, quantity } = req.body;

    if (quantity === 0) {
      await cartService.removeFromCart(userId, bookId);
      return res.json({ status: 'success', message: 'Item removed from cart' });
    }

    const updatedItem = await cartService.updateCart(userId, bookId, quantity);
    res.json({ data: updatedItem, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { bookId } = req.body;
    await cartService.removeFromCart(userId, bookId);
    res.json({ status: 'success', message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

