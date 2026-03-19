const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes placeholders
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/about', require('./routes/about'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/hero', require('./routes/hero'));
app.use('/api/technical-levels', require('./routes/technical-levels'));
app.use('/api/availability', require('./routes/availability'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
