import React from 'react';
import { CalendarDays, Clock, Globe, MapPin } from 'lucide-react';

function BookingSidebar({ title, duration, timezone, location, description }) {
  return (
    <aside className="booking-sidebar">
      <div className="booking-sidebar-icon" aria-hidden>
        <CalendarDays size={28} strokeWidth={2} />
      </div>
      <h1 className="booking-event-title">{title}</h1>
      <p className="booking-meta">
        <Clock size={16} strokeWidth={2} aria-hidden />
        {duration} min
      </p>
      <p className="booking-meta">
        <Globe size={16} strokeWidth={2} aria-hidden />
        {timezone.replace(/_/g, ' ')}
      </p>
      <p className="booking-meta">
        <MapPin size={16} strokeWidth={2} aria-hidden />
        {location}
      </p>
      <p className="booking-desc">{description}</p>
    </aside>
  );
}

export default BookingSidebar;
