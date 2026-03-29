// src/App.js
// Root component. Sets up routing:
//   /            → Event Types (admin)
//   /availability → Availability (admin)
//   /meetings     → Meetings (admin)
//   /book/:slug   → Public Booking Page (no sidebar)

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';

import EventTypes   from './pages/EventTypes';
import Availability from './pages/Availability';
import Meetings     from './pages/Meetings';
import BookingPage  from './pages/BookingPage';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin routes (all have the Sidebar via AdminLayout inside each page) */}
          <Route path="/"            element={<EventTypes />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/meetings"    element={<Meetings />} />

          {/* Public booking page – no sidebar */}
          <Route path="/book/:slug"  element={<BookingPage />} />

          {/* 404 fallback */}
          <Route path="*" element={
            <div style={{ textAlign:'center', padding:'80px 20px' }}>
              <div style={{ fontSize: 64 }}>🤷</div>
              <h2 style={{ marginTop: 16 }}>Page not found</h2>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
