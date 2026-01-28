require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/* ✅ OPEN CORS (REQUIRED FOR NETLIFY) */
app.use(cors({
  origin: 'https://sales-roda.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use(express.json());

/* ✅ MONGO CONNECTION */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB error:', err));

/* ✅ API ROUTES */
app.use('/api/sales', require('./routes/sales.routes'));
app.use('/api/oems', require('./routes/oem.routes'));
app.use('/api/states', require('./routes/state.routes'));

/* ✅ HEALTH CHECK */
app.get('/', (req, res) => {
  res.send('Sales Backend API is running 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



