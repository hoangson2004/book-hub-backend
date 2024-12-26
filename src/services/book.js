const BookModel = require('../models/Book');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getAllBooks = async () => {
  return await BookModel.find();
};

exports.createBook = async (book, file, userId) => {
  let imageUrl = null;

  if (file) {
    imageUrl = await uploadToCloudinary(file.buffer, 'books');
  }

  const newBook = await BookModel.create({
    ...book,
    imageUrl,
    userId, 
  });

  return newBook;
};

exports.getBookById = async (id) => {
  return await BookModel.findById(id);
};

exports.updateBook = async (id, book, file, userId) => {
  let imageUrl = null;

  if (file) {
    imageUrl = await uploadToCloudinary(file.buffer, 'books');
  }

  const updatedBook = await BookModel.findByIdAndUpdate(id, {
    ...book,
    ...(imageUrl && { imageUrl }), 
    userId,  
  }, { new: true });

  return updatedBook;
};

exports.deleteBook = async (id) => {
  return await BookModel.findByIdAndDelete(id);
};
