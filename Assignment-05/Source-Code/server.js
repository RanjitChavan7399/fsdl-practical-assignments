const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3005;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/travelBookingDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Models
const User = require('./models/User');
const Booking = require('./models/Booking');

// --- Routes ---

// Register
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.json({ success: true, message: 'Registration successful. Please login.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            // Very simple login (no JWT/sessions for basic assignment)
            res.json({ success: true, message: 'Login successful', username: user.name });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Book Package
app.post('/book', async (req, res) => {
    try {
        const { name, packageName, date } = req.body;
        const newBooking = new Booking({ name, packageName, date });
        await newBooking.save();
        res.json({ success: true, message: 'Booking successful!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Get Bookings
app.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ _id: -1 });
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
