const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerPost = require('./Routes/posts'); // Corrected the casing of 'posts' to 'Posts'

const app = express();

// Middleware
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb+srv://quynhle:17112003@cluster0.9sscx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});




// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message
    });
    // ... existing code ...

// Routes
app.use('/api/users', routerUser);
app.use('/api/posts', routerPost); // Thêm route cho posts

// ... existing code ...
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`); 
});