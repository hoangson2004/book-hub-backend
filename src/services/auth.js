const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

exports.registerUser = async (userData) => {
  try {
    const user = new UserModel(userData);
    await user.save(); 
    return user;
  } catch (err) {
    throw new Error('Error registering user: ' + err.message);
  }
};

// Đăng nhập người dùng
exports.loginUser = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  return user;
};

exports.updateUserProfile = async (userId, updateData) => {
  try {
    const updateFields = {};

    const allowedFields = ['phoneNumber', 'dateOfBirth', 'password', 'email'];
    
    if (updateData.email) {
      const existingEmailUser = await UserModel.findOne({ email: updateData.email });
      if (existingEmailUser && existingEmailUser._id !== userId) {
        throw new Error('Email is already in use');
      }
      updateFields.email = updateData.email;
    }

    for (let field of allowedFields) {
      if (updateData[field] && field !== 'email') {
        updateFields[field] = updateData[field];
      }
    }

    if (updateFields.password) {
      updateFields.password = await bcrypt.hash(updateFields.password, 10);
    }
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateFields, { new: true });

    if (!updatedUser) throw new Error('User not found');
    
    return updatedUser;
  } catch (err) {
    throw new Error('Error updating user profile: ' + err.message);
  }
};



exports.getAllUsers = async () => {
  try {
    return await UserModel.find().select('-password'); 
  } catch (err) {
    throw new Error('Error fetching users: ' + err.message);
  }
};

// Lấy người dùng theo ID
exports.getUserById = async (userId) => {
  try {
    return await UserModel.findById(userId).select('-password'); 
  } catch (err) {
    throw new Error('User not found: ' + err.message);
  }
};
