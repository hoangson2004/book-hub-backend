const express = require('express');
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart
} = require('../controllers/cart');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',authMiddleware, getCart);

router.post('/add',authMiddleware, addToCart);

router.put('/update',authMiddleware, updateCart);

router.delete('/remove',authMiddleware, removeFromCart);

module.exports = router;
