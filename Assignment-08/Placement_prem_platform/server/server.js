const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route files
const experienceRoutes = require('./routes/experienceRoutes');
const aiRoutes = require('./routes/aiRoutes');
const companyRoutes = require('./routes/companyRoutes');
const authRoutes = require('./routes/authRoutes');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api', experienceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('DriveInsight API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
