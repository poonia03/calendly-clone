# Calendly Clone Backend

This backend is built with Node.js, Express, and PostgreSQL. It exposes REST APIs for:
- Event types (`/api/event-types`)
- Availability (`/api/availability`)
- Bookings (`/api/bookings`)

## Setup

1. Install dependencies:
   - `cd backend && npm install`
2. Create a PostgreSQL database and set `DATABASE_URL` in `.env`.
3. Run migrations:
   - `npm run migrate`
4. Start the server:
   - `npm run dev`

## Recommended `.env`

```
DATABASE_URL=postgresql://username:password@localhost:5432/calendly_clone
PORT=4000
```

## API routes

- GET `/api/event-types`
- GET `/api/event-types/:slug`
- POST `/api/event-types`
- PUT `/api/event-types/:id`
- DELETE `/api/event-types/:id`

- GET `/api/availability`
- PUT `/api/availability/:id`

- GET `/api/bookings`
- POST `/api/bookings`
- DELETE `/api/bookings/:id`

