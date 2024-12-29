const jwt = require('jsonwebtoken');
const authService = require('../services/auth');
const coinService = require('../services/coin');
const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { username, email, password, phoneNumber, dateOfBirth } = req.body;

    if (!username || !email || !password || !phoneNumber || !dateOfBirth) {
        return res.status(400).json({ error: 'All fields (username, email, password, phoneNumber, dateOfBirth) are required' });
    }

    try {
        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({ error: `${field} already exists` });
        }

        const user = await authService.registerUser({ username, email, password, phoneNumber, dateOfBirth });
        
        try {
            await coinService.createCoinBalance(user._id); 
        } catch (coinError) {
            return res.status(500).json({ 
                error: `User registered successfully but failed to initialize coin balance: ${coinError.message}` 
            });
        }
        res.json({ message: 'User registered successfully', user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authService.loginUser(email, password);
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.user.userId;
    const { phoneNumber, dateOfBirth, password, email } = req.body;

    try {
        const updatedUser = await authService.updateUserProfile(userId, {
            phoneNumber,
            dateOfBirth,
            password,
            email
        });

        res.json({
            message: 'User profile updated successfully',
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                dateOfBirth: updatedUser.dateOfBirth
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await authService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await authService.getUserById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
