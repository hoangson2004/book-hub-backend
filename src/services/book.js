const BookModel = require('../models/Book');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getAllBooks = async () => {
  return await BookModel.find();
};

exports.createBook = async (book, file) => {
  let imageUrl = null;

  // Xử lý upload ảnh nếu có file
  if (file) {
    imageUrl = await uploadToCloudinary(file.buffer, 'books');
  }

  // Tạo sách mới với URL ảnh (nếu có)
  return await BookModel.create({
    ...book,
    imageUrl,
  });
};

exports.getBookById = async (id) => {
  return await BookModel.findById(id);
};

exports.updateBook = async (id, book, file) => {
  let imageUrl = null;

  // Xử lý upload ảnh nếu có file
  if (file) {
    imageUrl = await uploadToCloudinary(file.buffer, 'books');
  }

  // Cập nhật sách
  return await BookModel.findByIdAndUpdate(
    id,
    {
      ...book,
      ...(imageUrl && { imageUrl }),
    },
    { new: true }
  );
};

exports.deleteBook = async (id) => {
  return await BookModel.findByIdAndDelete(id);
};
