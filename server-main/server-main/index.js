const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internships');
const applicationRoutes = require('./routes/applications');

// Load environment variables
dotenv.config();

const app = express();

// Middleware

app.use(cors({
  origin: 'https://find-jobs-chi.vercel.app/', 
  credentials: true 
}));


app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Internship Job Board API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 