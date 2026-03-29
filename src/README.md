# Calendly Clone – Frontend

React SPA that replicates core Calendly functionality.

## Tech Stack
- **React 18** (Create React App)
- **React Router v6** – client-side routing
- **Axios** – HTTP client
- **CSS Variables** – theming (no external UI library needed)

## Project Structure

```
src/
├── api/
│   └── index.js          ← All API calls in one place
├── components/
│   ├── AdminLayout.js/css ← Sidebar wrapper for admin pages
│   ├── Sidebar.js/css     ← Navigation sidebar
│   └── Calendar.js/css    ← Reusable month calendar
├── context/
│   └── ToastContext.js    ← Global toast notifications
├── pages/
│   ├── EventTypes.js/css  ← Create / edit / delete event types
│   ├── Availability.js/css← Set weekly availability hours
│   ├── Meetings.js/css    ← View upcoming & past meetings
│   └── BookingPage.js/css ← Public booking flow (3 steps)
├── App.js                 ← Routing
├── index.js               ← Entry point
└── index.css              ← Global styles + utility classes
```

## Setup

### Prerequisites
- Node.js 16+
- Backend running on `http://localhost:5000`

### Install & Run
```bash
cd frontend
npm install
npm start        # Runs on http://localhost:3000
```

The `"proxy": "http://localhost:5000"` in `package.json` forwards all
`/api/*` calls to the backend automatically – no CORS config needed during development.

## Pages & Routes

| Route | Description | Auth |
|---|---|---|
| `/` | Event Types – list, create, edit, delete | Admin (no login) |
| `/availability` | Set weekly available hours + timezone | Admin |
| `/meetings` | View upcoming/past meetings, cancel | Admin |
| `/book/:slug` | Public booking page for invitees | Public |

## Key Design Decisions

- **No login required** – a default "John Doe" user is assumed logged in for all admin pages.
- **3-step booking flow**: pick date → pick time slot → fill form → confirmation
- **API proxy** – all backend calls go through `/api` prefix (see `src/api/index.js`)
- **Global toasts** – `useToast()` hook available anywhere for success/error feedback
- **Responsive** – booking page stacks vertically on mobile; sidebar collapses

## API Endpoints Expected (Backend)

```
GET    /api/event-types
POST   /api/event-types
PUT    /api/event-types/:id
DELETE /api/event-types/:id
GET    /api/event-types/slug/:slug

GET    /api/availability
PUT    /api/availability

GET    /api/bookings/slots/:slug?date=YYYY-MM-DD
POST   /api/bookings
GET    /api/bookings
DELETE /api/bookings/:id
```
