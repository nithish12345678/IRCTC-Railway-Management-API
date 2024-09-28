const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const db = require('./config/db');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
const PORT = process.env.PORT || 5000;

app.get("/", function (req, res) {
    res.send("Response for Get request");
}
)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});