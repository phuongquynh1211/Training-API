const express = require('express');
const User = require('../models/users');
const router = express.Router();
const crypto = require('crypto');



// Giả lập lưu trữ phiên làm việc
let sessions = {}; // Để lưu trữ phiên làm việc của người dùng

// Đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Xác thực dữ liệu
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Tạo phiên làm việc
        const sessionId = new mongoose.Types.ObjectId().toString();
        sessions[sessionId] = user._id; // Lưu ID người dùng vào phiên

        res.json({ message: 'Login successful', sessionId });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Hàm mã hóa mật khẩu
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');  // SHA-256 hash
};

// API đăng ký user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }

        const hashedPassword = hashPassword(password);  // Mã hóa mật khẩu

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// Đăng xuất
router.post('/logout', (req, res) => {
    const { sessionId } = req.body;

    // Xóa phiên làm việc
    if (sessions[sessionId]) {
        delete sessions[sessionId];
        return res.json({ message: 'Logout successful' });
    }

    res.status(400).json({ message: 'Invalid session' });
});

module.exports = router;
