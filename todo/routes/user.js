const mongoose = require('mongoose');
const User = require('../models/users');
const router = require('express').Router();


// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create user
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.remove();
            res.json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const createUser = async (username, password, email) => {
    // Xác thực dữ liệu
    if (!username || !password || !email) {
        throw new Error('Username, password, and email are required');
    }

    const newUser = new User({
        username,
        password, 
        email
    });

    try {
        const savedUser = await newUser.save();
        console.log('User created:', savedUser);
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

// Kết nối đến MongoDB và tạo người dùng
const run = async () => {
    await mongoose.connect('mongodb+srv://quynhle:17112003@cluster0.9sscx.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
    await createUser('pquynh', '12345', 'quynhle03@gmail.com');
    mongoose.connection.close();
};

run();