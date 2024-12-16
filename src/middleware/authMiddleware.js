const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
    req.user = decoded; 

    // // Kiểm tra nếu người dùng là admin
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Access denied, admin only' });
    // }

    next(); // Tiến hành xử lý tiếp
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
