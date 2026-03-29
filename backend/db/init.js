const fs = require('fs');
const path = require('path');
const db = require('../db');

const DEFAULT_EVENT_TYPES = [
  [
    'Quick Chat',
    'A short 15-minute catch-up call for quick questions or introductions.',
    15,
    'Google Meet',
    'quick-chat',
    'blue',
    true,
  ],
  [
    'Strategy Session',
    'Dive into roadmap, priorities, and next steps with your team.',
    30,
    'Zoom',
    'strategy-session',
    'purple',
    true,
  ],
  [
    'Product Demo',
    'Walk through features tailored to your use case and questions.',
    45,
    'Google Meet',
    'product-demo',
    'green',
    true,
  ],
  [
    'Deep Dive Workshop',
    'Hands-on working session for advanced topics and implementation.',
    60,
    'Zoom',
    'deep-dive-workshop',
    'orange',
    true,
  ],
];

/** day_of_week: 0 = Sunday … 6 = Saturday */
const DEFAULT_AVAILABILITY = [
  [0, false, '09:00', '17:00', 'America/New_York'],
  [1, true, '09:00', '17:00', 'America/New_York'],
  [2, true, '09:00', '17:00', 'America/New_York'],
  [3, true, '09:00', '17:00', 'America/New_York'],
  [4, true, '09:00', '17:00', 'America/New_York'],
  [5, true, '09:00', '17:00', 'America/New_York'],
  [6, false, '09:00', '17:00', 'America/New_York'],
];

async function run() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await db.query(schema);
    console.log('Database schema applied.');

    for (const row of DEFAULT_EVENT_TYPES) {
      await db.query(
        `INSERT INTO event_types (title, description, duration, location, slug, color, enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO NOTHING`,
        row
      );
    }
    console.log('Event types seeded (skipped existing slugs).');

    for (const row of DEFAULT_AVAILABILITY) {
      await db.query(
        `INSERT INTO availability (day_of_week, active, start_time, end_time, timezone)
         VALUES ($1, $2, $3::time, $4::time, $5)
         ON CONFLICT (day_of_week) DO UPDATE SET
           active = EXCLUDED.active,
           start_time = EXCLUDED.start_time,
           end_time = EXCLUDED.end_time,
           timezone = EXCLUDED.timezone,
           updated_at = NOW()`,
        row
      );
    }
    console.log('Availability defaults applied.');

    process.exit(0);
  } catch (err) {
    console.error('Database init failed:', err.message);
    process.exit(1);
  }
}

run();
