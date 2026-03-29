// src/api/index.js
// All API calls to the backend in one place.
// Base URL uses CRA proxy (see package.json "proxy": "http://localhost:5000")

import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// ── Event Types ──────────────────────────────────────────
export const getEventTypes    = ()        => api.get('/event-types');
export const createEventType  = (data)    => api.post('/event-types', data);
export const updateEventType  = (id, data)=> api.put(`/event-types/${id}`, data);
export const deleteEventType  = (id)      => api.delete(`/event-types/${id}`);
export const getEventTypeBySlug = (slug)  => api.get(`/event-types/slug/${slug}`);

// ── Availability ─────────────────────────────────────────
export const getAvailability    = ()      => api.get('/availability');
export const updateAvailability = (data)  => api.put('/availability', data);

// ── Slots (public – used on booking page) ────────────────
export const getAvailableSlots = (slug, date) =>
  api.get(`/bookings/slots/${slug}`, { params: { date } });

// ── Bookings ─────────────────────────────────────────────
export const createBooking  = (data)  => api.post('/bookings', data);
export const getMeetings    = ()      => api.get('/bookings');
export const cancelMeeting  = (id)    => api.delete(`/bookings/${id}`);
