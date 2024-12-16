const Cart = require('../models/Cart');
const Book = require('../models/Book');

exports.getCartByUserId = async (userId) => {
  const carts = await Cart.find({ userId })
    .populate('bookId', 'title author price stock') 
    .exec();
  
  return carts;
};

exports.addToCart = async (userId, bookId, quantity) => {
  if (!userId || !bookId || !quantity) {
    throw new Error('User ID, Book ID, and quantity are required');
  }

  const existingItem = await Cart.findOne({ userId, bookId });

  if (existingItem) {
    existingItem.quantity += quantity;
    return await existingItem.save();
  }

  const newCartItem = new Cart({
    userId,
    bookId,
    quantity,
  });

  return await newCartItem.save();
};


exports.updateCart = async (userId, bookId, quantity) => {
  const cart = await Cart.findOne({ userId, bookId });

  if (!cart) {
    throw new Error('Item not found in cart');
  }

  cart.quantity = quantity;
  return await cart.save();
};

exports.removeFromCart = async (userId, bookId) => {
  const cart = await Cart.findOne({ userId, bookId });

  if (!cart) {
    throw new Error('Item not found in cart');
  }
  return await Cart.deleteOne({ userId, bookId });
};
