const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const bookRoutes = require('./src/routes/book');
const cartRoutes = require('./src/routes/cart');
const authRoutes = require('./src/routes/auth');  // Import routes của auth

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.get("/", (req, res) => {
  res.send("Welcome to the Book Hub API!");
});

// Đăng ký các routes
app.use('/book', bookRoutes);
app.use('/cart', cartRoutes);
app.use('/auth', authRoutes);  // Thêm route auth

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
