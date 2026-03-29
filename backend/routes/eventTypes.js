const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM event_types ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { rows } = await db.query('SELECT * FROM event_types WHERE slug = $1', [slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Event type not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, duration, location, slug, color, enabled } = req.body;
    const result = await db.query(
      `INSERT INTO event_types (title, description, duration, location, slug, color, enabled)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [title, description, duration, location, slug, color, enabled ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, duration, location, slug, color, enabled } = req.body;
    const result = await db.query(
      `UPDATE event_types
       SET title=$1, description=$2, duration=$3, location=$4, slug=$5, color=$6, enabled=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [title, description, duration, location, slug, color, enabled, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Event type not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM event_types WHERE id=$1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Event type not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
