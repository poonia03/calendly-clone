import React from 'react';

function BookingConfirmation({ title, selectedDateLong, selectedTime, bookingData }) {
  return (
    <div className="booking-page">
      <div className="booking-confirm">
        <h2>Confirmed!</h2>
        <p className="booking-confirm-lead">You are scheduled with the host.</p>
        <div className="booking-summary">
          <p>
            <strong>Event:</strong> {title}
          </p>
          <p>
            <strong>When:</strong> {selectedDateLong} at {selectedTime}
          </p>
          <p>
            <strong>Who:</strong> {bookingData.name} ({bookingData.email})
          </p>
          {bookingData.notes ? (
            <p>
              <strong>Notes:</strong> {bookingData.notes}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
