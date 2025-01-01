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

router.get('/', getAllBooks);
router.post('/', authMiddleware, upload.single('image'), createBook);  
router.get('/:id', getBookById);
router.put('/:id', authMiddleware, upload.single('image'), updateBook);  
router.delete('/:id', deleteBook);

module.exports = router;
