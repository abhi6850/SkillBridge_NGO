const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Add this line

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err));

// Middleware
app.use(express.json()); // Add this line
app.use(cors()); // Add this line

// Define a simple route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Define Auth Routes
app.use('/api/auth', require('./routes/auth')); // Add this line

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));