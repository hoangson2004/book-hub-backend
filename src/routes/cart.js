const express = require('express');
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart
} = require('../controllers/cart');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route để lấy giỏ hàng của người dùng
router.get('/',authMiddleware, getCart);

// Route để thêm sản phẩm vào giỏ hàng
router.post('/add',authMiddleware, addToCart);

// Route để cập nhật giỏ hàng (cập nhật số lượng hoặc xóa nếu số lượng = 0)
router.put('/update',authMiddleware, updateCart);

// Route để xóa sản phẩm khỏi giỏ hàng
router.delete('/remove',authMiddleware, removeFromCart);

module.exports = router;
