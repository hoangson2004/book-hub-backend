const express = require('express');
const {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
} = require('../controllers/book');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Dùng middleware upload.single('image') để nhận ảnh từ request
router.get('/', getAllBooks);
router.post('/', authMiddleware, upload.single('image'), createBook);  // Tạo mới sách và upload ảnh
router.get('/:id', getBookById);
router.put('/:id', authMiddleware, upload.single('image'), updateBook);  // Cập nhật sách và ảnh nếu có
router.delete('/:id', deleteBook);

module.exports = router;
