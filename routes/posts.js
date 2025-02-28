const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
router.post('/', async (req, res) => {
    const { author, title, content, status } = req.body;
    
    try {
        const user = await User.findById(author);
        if (!user) {
            return res.status(400).json({ message: 'Invalid author ID' });
        }

        const post = new Post({ author, title, content, status });
        const savedPost = await Post.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'email');
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (post) {
            res.json({ message: 'Post deleted' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tìm kiếm bài post theo tên tác giả và trạng thái
router.get('/search', async (req, res) => {
    const { authorName, status } = req.query;
    try {
        const users = await User.find({ email: { $regex: authorName, $options: 'i' } }); // Tìm kiếm user theo tên
        const authorIds = users.map(user => user._id); // Lấy ID của các user tìm được

        const posts = await Post.find({ author: { $in: authorIds }, status });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy tất cả bài post của một user cụ thể
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy tất cả bài post của một user cụ thể đã tạo trong tháng hiện tại
router.get('/user/:userId/current-month', async (req, res) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0); // Lấy ngày cuối cùng của tháng hiện tại

    try {
        const posts = await Post.find({
            author: req.params.userId,
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Đếm số lượng bài post của một user cụ thể
router.get('/user/:userId/count', async (req, res) => {
    try {
        const count = await Post.countDocuments({ author: req.params.userId });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;