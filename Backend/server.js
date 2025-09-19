const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected...'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth');
app.use("/api/auth", authRoutes);

const opportunitiesRoutes = require('./routes/opportunities');
app.use("/api/opportunities", opportunitiesRoutes);

app.get('/', (req, res) => {
  res.send('API Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));