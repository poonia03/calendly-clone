import React from 'react';

function BookingTimeSlots({ selectedDate, selectedDateLabel, timeSlots, onSelectTime }) {
  return (
    <div className="booking-times-wrap">
      {selectedDate ? (
        <>
          <div className="booking-times-head">
            <strong className="booking-times-date">{selectedDateLabel}</strong>
            <span className="booking-times-count">
              {timeSlots.length} time slots available
            </span>
          </div>
          <div className="booking-times-scroll">
            {timeSlots.map((t) => (
              <button
                key={t}
                type="button"
                className="time-slot-btn time-slot-btn--outline"
                onClick={() => onSelectTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="booking-times-placeholder">
          Select a date to see available times.
        </p>
      )}
    </div>
  );
}

export default BookingTimeSlots;
