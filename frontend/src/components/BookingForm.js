import React from 'react';

function BookingForm({
  title,
  duration,
  selectedDateLong,
  selectedTime,
  bookingData,
  onDataChange,
  onSubmit,
}) {
  return (
    <>
      <button
        type="button"
        className="booking-back"
        onClick={() => onDataChange({ step: 1 })}
      >
        ← Back
      </button>
      <div className="booking-form-panel">
        <div className="booking-selection-banner">
          <p className="booking-selection-title">{title}</p>
          <p className="booking-selection-when">
            {selectedDateLong} at {selectedTime}
          </p>
          <p className="booking-selection-duration">{duration} minutes</p>
        </div>
        <form
          className="booking-form booking-form--full"
          onSubmit={onSubmit}
        >
          <label className="field">
            <span className="field-label">Name *</span>
            <input
              required
              type="text"
              className="input"
              placeholder="Your full name"
              value={bookingData.name}
              onChange={(e) =>
                onDataChange({ name: e.target.value })
              }
            />
          </label>
          <label className="field">
            <span className="field-label">Email *</span>
            <input
              required
              type="email"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              className="input"
              placeholder="your@email.com"
              value={bookingData.email}
              onChange={(e) =>
                onDataChange({ email: e.target.value })
              }
              title="Please enter a valid email address"
            />
          </label>
          <label className="field">
            <span className="field-label">Notes (optional)</span>
            <textarea
              className="input textarea"
              rows={4}
              placeholder="Share anything that will help prepare for our meeting..."
              value={bookingData.notes}
              onChange={(e) =>
                onDataChange({ notes: e.target.value })
              }
            />
          </label>
          <button type="submit" className="booking-submit booking-submit--block">
            Schedule Meeting
          </button>
        </form>
      </div>
    </>
  );
}

export default BookingForm;
