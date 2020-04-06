const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const connectDB = require('./config/db');

app.use(express.json({ extended : false}))

//Connect db
connectDB();

app.get('/', (req, res) => res.send("Hello World"));

//Define route

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'))

app.listen(port, () => console.log(`Server started at ${port}`));