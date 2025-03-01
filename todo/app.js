const express = require('express');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todo');
const authRoutes = require('./routes/auth');
const User = require('./models/users'); 



const app = express();
app.use(express.json());
//kết nối mongo
mongoose.connect('mongodb+srv://quynhle:17112003@cluster0.9sscx.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
