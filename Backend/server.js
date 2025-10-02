const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { initSocket } = require('./lib/socket');

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected...'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use(express.json());
app.use(cors({
  origin: (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map(s => s.trim()),
  credentials: true,
}));

const authRoutes = require('./routes/auth');
app.use("/api/auth", authRoutes);

const opportunitiesRoutes = require('./routes/opportunities');
app.use("/api/opportunities", opportunitiesRoutes);

const messageRoutes = require('./routes/messages');
app.use("/api/messages",messageRoutes)

app.get('/', (req, res) => {
  res.send('API Running...');
});

// Initialize Socket.IO on the same HTTP server
initSocket(httpServer, process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || 'http://localhost:3000,http://localhost:3001');

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));