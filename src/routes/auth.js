const express = require('express');
const bcrypt = require('bcrypt');

const { register, login, loginAdmin, getProfile, getAllUsers, getUserById, updateProfile } = require('../controllers/auth');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/loginadmin', loginAdmin);

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

router.get('/users', authMiddleware, getAllUsers);  
router.get('/users/:userId', authMiddleware, getUserById);  

module.exports = router;
