const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const eventTypesRouter = require('./routes/eventTypes');
const availabilityRouter = require('./routes/availability');
const bookingsRouter = require('./routes/bookings');
const { testConnection } = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Calendly backend is running' });
});

app.get('/api/health', async (req, res) => {
  try {
    await testConnection();
    res.json({ ok: true, database: 'connected' });
  } catch (err) {
    res.status(503).json({ ok: false, database: 'disconnected', error: err.message });
  }
});

app.use('/api/event-types', eventTypesRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/bookings', bookingsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack); // eslint-disable-line no-console
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
