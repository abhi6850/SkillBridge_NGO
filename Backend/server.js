const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Connect to MongoDB using the URI from environment variables
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected...'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
// Enable JSON body parsing for incoming requests
app.use(express.json()); 
// Enable CORS to allow cross-origin requests from the frontend
app.use(cors());

// Test Route to check if the API is running
app.get('/', (req, res) => {
  res.send('API Running...');
});

// Import and use auth routes
const authRoutes = require('./routes/auth');
app.use("/api/auth", authRoutes);

// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
