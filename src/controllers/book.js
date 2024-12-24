const bookService = require('../services/book');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    console.log(books);
    res.status(200).json({ data: books, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const newBook = await bookService.createBook(req.body, req.file);

    res.status(201).json({ data: newBook, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found', status: 'error' });
    }
    res.status(200).json({ data: book, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await bookService.updateBook(req.params.id, req.body, req.file);

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found', status: 'error' });
    }
    res.status(200).json({ data: updatedBook, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await bookService.deleteBook(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found', status: 'error' });
    }
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
