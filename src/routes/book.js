const express = require('express');
const {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook
} = require('../controllers/book'); // Đảm bảo đường dẫn đúng tới controller

const router = express.Router();

// Định nghĩa các route cho sách
router.get('/', getAllBooks);         // GET tất cả sách
router.post('/', createBook);         // POST tạo sách mới
router.get('/:id', getBookById);     // GET lấy sách theo id
router.put('/:id', updateBook);      // PUT cập nhật sách theo id
router.delete('/:id', deleteBook);   // DELETE xóa sách theo id

module.exports = router;
