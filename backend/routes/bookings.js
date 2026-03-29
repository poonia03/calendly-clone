const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT b.*,
              e.title AS event_title,
              e.slug AS event_slug,
              e.location AS event_location,
              e.duration AS event_duration
       FROM bookings b
       LEFT JOIN event_types e ON b.event_type_id = e.id
       ORDER BY b.scheduled_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { event_type_id, name, email, notes, scheduled_at } = req.body;
    if (!event_type_id || !name || !email || !scheduled_at) {
      return res.status(400).json({
        error: 'event_type_id, name, email, and scheduled_at are required',
      });
    }
    const result = await db.query(
      `INSERT INTO bookings (event_type_id, name, email, notes, scheduled_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [event_type_id, name, email, notes || null, scheduled_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM bookings WHERE id=$1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Booking not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
