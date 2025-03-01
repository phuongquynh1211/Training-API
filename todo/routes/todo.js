
const express = require('express');
const Todo = require('../models/todo');
const router = express.Router();
const mongoose = require('mongoose');

// Middleware để xác thực người dùng
const authenticateUser = (req, res, next) => {
    const userId = req.headers['user-id']; // Giả sử ID người dùng được gửi qua header
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = userId; // Lưu ID người dùng vào request
    next();
};

// Tạo Todo
router.post('/', authenticateUser, async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    const todo = new Todo({
        title,
        description,
        status,
        dueDate,
        createdBy: req.userId
    });
    await todo.save();
    res.status(201).json(todo);
});

// Lấy tất cả Todo
router.get('/', authenticateUser, async (req, res) => {
    const { status, search } = req.query;
    const filter = { createdBy: req.userId };
    if (status) {
        filter.status = status;
    }
    if (search) {
        filter.title = { $regex: search, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    }
    const todos = await Todo.find(filter);
    res.json(todos);
});

// Cập nhật Todo
router.put('/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;
    const todo = await Todo.findOneAndUpdate(
        { _id: id, createdBy: req.userId },
        { title, description, status, dueDate },
        { new: true, runValidators: true }
    );
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
});

// Xóa Todo
router.delete('/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, createdBy: req.userId });
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(204).send();
});

module.exports = router;