const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const User = require('./models/User');
const Appointment = require('./models/Appointment');

const app = express();
const PORT = 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/hospital-appointments')
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---

// Register
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Simple validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(400).json({ error: 'Registration failed. Email might already exist.' });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email and matching password
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Book Appointment
app.post('/appointments', async (req, res) => {
    try {
        const { patientName, doctorName, date } = req.body;
        
        if (!patientName || !doctorName || !date) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newAppointment = new Appointment({ patientName, doctorName, date });
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to book appointment.' });
    }
});

// Get Appointments
app.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch appointments.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
