// src/pages/BookingPage.js
// The PUBLIC page that invitees visit to book a meeting.
// URL: /book/:slug
//
// Flow:
//   Step 1 – Pick a date on the calendar
//   Step 2 – Pick a time slot
//   Step 3 – Fill in name + email and confirm
//   Step 4 – Confirmation screen

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from '../components/Calendar';
import { getEventTypeBySlug, getAvailableSlots, createBooking } from '../api';
import './BookingPage.css';

// Format a JS Date to "YYYY-MM-DD" (local time, not UTC)
function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// "HH:MM" → "9:00 AM"
function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour  = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

// STEP COMPONENTS ─────────────────────────────────────────────────────────────

// Step 1+2: Calendar + time slots side-by-side
function PickDateTime({ eventType, onConfirm }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots,        setSlots]        = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // availableDays comes from event type or defaults 1-5 (Mon-Fri)
  // Backend should return this; we default to Mon-Fri for the calendar UI
  const availableDays = eventType.available_days || [1, 2, 3, 4, 5];

  async function handleDateSelect(date) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlots([]);
    setLoadingSlots(true);
    try {
      const { data } = await getAvailableSlots(eventType.slug, toYMD(date));
      setSlots(data);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="booking-pick">
      {/* Left: calendar */}
      <div className="booking-cal-col">
        <h3>Select a Date</h3>
        <Calendar
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
          availableDays={availableDays}
        />
      </div>

      {/* Right: time slots (only shown after a date is picked) */}
      {selectedDate && (
        <div className="booking-slots-col">
          <h3>{formattedDate}</h3>

          {loadingSlots ? (
            <div className="spinner" />
          ) : slots.length === 0 ? (
            <p className="no-slots">No available slots for this day.</p>
          ) : (
            <div className="slots-list">
              {slots.map(slot => (
                <button
                  key={slot}
                  className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {formatTime(slot)}
                </button>
              ))}
            </div>
          )}

          {selectedSlot && (
            <button
              className="btn btn-primary confirm-slot-btn"
              onClick={() => onConfirm(selectedDate, selectedSlot)}
            >
              Confirm →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Step 3: Booking form
function BookingForm({ eventType, date, time, onBook, onBack }) {
  const [form, setForm]     = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onBook(form);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="booking-form-wrap">
      {/* Summary */}
      <div className="booking-summary">
        <div className="summary-row"><span>📅</span> {formattedDate}</div>
        <div className="summary-row"><span>🕐</span> {formatTime(time)} · {eventType.duration} min</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name *</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Jane Smith"
            required
          />
        </div>
        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="jane@example.com"
            required
          />
        </div>

        {error && <div className="booking-error">{error}</div>}

        <div className="booking-form-actions">
          <button type="button" className="btn btn-ghost" onClick={onBack}>← Back</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Scheduling…' : 'Schedule Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Step 4: Confirmation
function Confirmation({ eventType, date, time, invitee }) {
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="booking-confirmation">
      <div className="confirm-icon">✅</div>
      <h2>You're scheduled!</h2>
      <p className="confirm-sub">
        A calendar invitation has been sent to <strong>{invitee.email}</strong>
      </p>

      <div className="confirm-details card">
        <div className="confirm-row">
          <span className="confirm-label">Event</span>
          <span className="confirm-value">{eventType.name}</span>
        </div>
        <div className="confirm-row">
          <span className="confirm-label">Name</span>
          <span className="confirm-value">{invitee.name}</span>
        </div>
        <div className="confirm-row">
          <span className="confirm-label">Date</span>
          <span className="confirm-value">{formattedDate}</span>
        </div>
        <div className="confirm-row">
          <span className="confirm-label">Time</span>
          <span className="confirm-value">{formatTime(time)} · {eventType.duration} min</span>
        </div>
      </div>

      <a href="/" className="btn btn-outline" style={{ marginTop: 24 }}>
        Back to Home
      </a>
    </div>
  );
}

// MAIN PAGE ───────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const { slug } = useParams();

  const [eventType, setEventType] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);

  // step: 'pick' | 'form' | 'confirmed'
  const [step, setStep]           = useState('pick');
  const [pickedDate, setPickedDate] = useState(null);
  const [pickedTime, setPickedTime] = useState(null);
  const [invitee,    setInvitee]    = useState(null);

  useEffect(() => {
    getEventTypeBySlug(slug)
      .then(({ data }) => setEventType(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  function handleDateTimeConfirm(date, time) {
    setPickedDate(date);
    setPickedTime(time);
    setStep('form');
  }

  async function handleBook(formData) {
    await createBooking({
      event_type_id: eventType.id,
      date: toYMD(pickedDate),
      time: pickedTime,
      invitee_name:  formData.name,
      invitee_email: formData.email,
    });
    setInvitee(formData);
    setStep('confirmed');
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading)  return <div className="spinner" style={{ marginTop: 80 }} />;
  if (notFound) return (
    <div className="booking-page">
      <div className="booking-not-found">
        <div style={{ fontSize: 64 }}>🔍</div>
        <h2>Event not found</h2>
        <p>This booking link doesn't exist or may have been removed.</p>
      </div>
    </div>
  );

  return (
    <div className="booking-page">
      <div className={`booking-card card ${step === 'confirmed' ? 'narrow' : ''}`}>
        {/* Left info panel */}
        {step !== 'confirmed' && (
          <div className="booking-info">
            <div className="booking-host">
              <div className="host-avatar">JD</div>
              <span>John Doe</span>
            </div>
            <h2 className="booking-event-name">{eventType.name}</h2>
            <div className="booking-meta">
              <span>🕐 {eventType.duration} min</span>
            </div>
            {eventType.description && (
              <p className="booking-event-desc">{eventType.description}</p>
            )}
          </div>
        )}

        {/* Right content area */}
        <div className="booking-content">
          {step === 'pick' && (
            <PickDateTime
              eventType={eventType}
              onConfirm={handleDateTimeConfirm}
            />
          )}
          {step === 'form' && (
            <BookingForm
              eventType={eventType}
              date={pickedDate}
              time={pickedTime}
              onBook={handleBook}
              onBack={() => setStep('pick')}
            />
          )}
          {step === 'confirmed' && (
            <Confirmation
              eventType={eventType}
              date={pickedDate}
              time={pickedTime}
              invitee={invitee}
            />
          )}
        </div>
      </div>
    </div>
  );
}
