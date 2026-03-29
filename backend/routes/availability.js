const express = require('express');
const db = require('../db');

const router = express.Router();

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function timeToHHMM(t) {
  if (!t) return '09:00';
  const s = String(t);
  return s.length >= 5 ? s.slice(0, 5) : s;
}

function rowsToPayload(rows) {
  const timezone = rows[0]?.timezone || 'America/New_York';
  const schedule = rows.map((r) => ({
    day: DAY_NAMES[r.day_of_week],
    active: r.active,
    start: timeToHHMM(r.start_time),
    end: timeToHHMM(r.end_time),
  }));
  return { timezone, schedule };
}

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM availability ORDER BY day_of_week ASC'
    );
    res.json(rowsToPayload(rows));
  } catch (err) {
    next(err);
  }
});

/** Full sync: { timezone, schedule: [{ day, active, start, end }] } */
router.put('/', async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const { timezone, schedule } = req.body;
    if (!timezone || !Array.isArray(schedule)) {
      return res.status(400).json({ error: 'Expected { timezone, schedule: [...] }' });
    }

    const dayToIndex = Object.fromEntries(DAY_NAMES.map((d, i) => [d, i]));

    await client.query('BEGIN');
    for (const row of schedule) {
      const dow = dayToIndex[row.day];
      if (dow === undefined) continue;
      await client.query(
        `UPDATE availability
         SET active = $1,
             start_time = $2::time,
             end_time = $3::time,
             timezone = $4,
             updated_at = NOW()
         WHERE day_of_week = $5`,
        [row.active, row.start, row.end, timezone, dow]
      );
    }
    await client.query('COMMIT');

    const { rows } = await db.query(
      'SELECT * FROM availability ORDER BY day_of_week ASC'
    );
    res.json(rowsToPayload(rows));
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally {
    client.release();
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active, start_time, end_time, timezone } = req.body;
    const result = await db.query(
      `UPDATE availability
       SET active=$1, start_time=$2::time, end_time=$3::time, timezone=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [active, start_time, end_time, timezone, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Availability row not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
