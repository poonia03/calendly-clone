import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventMetaBySlug } from '../utils/eventTypesStorage';
import { loadAvailability } from '../utils/availabilityStorage';
import { apiUrl, fetchJsonSafe } from '../config/api';
import { toScheduledAtIso } from '../utils/dateTime';
import BookingSidebar from './BookingSidebar';
import BookingCalendar from './BookingCalendar';
import BookingTimeSlots from './BookingTimeSlots';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildTimeSlotsForDate(date, availability, duration) {
  if (!date || !availability?.schedule) return [];

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const daySchedule = availability.schedule.find((s) => s.day === dayName);

  if (!daySchedule || !daySchedule.active) return [];

  const [startHour, startMin] = daySchedule.start.split(':').map(Number);
  const [endHour, endMin] = daySchedule.end.split(':').map(Number);

  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  const slots = [];
  for (let time = startTime; time + duration <= endTime; time += duration) {
    const hour = Math.floor(time / 60);
    const min = time % 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const mm = min === 0 ? '00' : min.toString();
    slots.push(`${hour12}:${mm} ${period}`);
  }

  return slots;
}

function titleFromSlug(slug) {
  if (!slug) return 'Meeting';
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fetchEventBySlug(slug) {
  return fetchJsonSafe(
    apiUrl(`/api/event-types/${encodeURIComponent(slug)}`)
  );
}

function fetchAvailabilityApi() {
  return fetchJsonSafe(apiUrl('/api/availability'));
}

function PublicBooking() {
  const { slug } = useParams();
  const fallbackMeta = useMemo(() => getEventMetaBySlug(slug), [slug]);

  const [apiMeta, setApiMeta] = useState(null);
  const [availability, setAvailability] = useState(() => loadAvailability());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [ev, av] = await Promise.all([
        fetchEventBySlug(slug),
        fetchAvailabilityApi(),
      ]);
      if (cancelled) return;
      if (ev) setApiMeta(ev);
      if (av?.schedule) setAvailability(av);
      else setAvailability(loadAvailability());
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const meta = apiMeta || fallbackMeta;

  const title = meta?.title || titleFromSlug(slug);
  const duration = meta?.duration ?? 30;
  const location = meta?.location || 'Video call';
  const description =
    meta?.description ||
    'Web conferencing details provided upon confirmation.';
  const eventTypeId = apiMeta?.id ?? fallbackMeta?.id;

  const today = useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    notes: '',
  });

  const timeSlots = useMemo(
    () => buildTimeSlotsForDate(selectedDate, availability, duration),
    [selectedDate, availability, duration]
  );

  const selectedDateLabel =
    selectedDate &&
    selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

  const selectedDateLong =
    selectedDate &&
    selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  const shiftMonth = (delta) => {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const isDisabled = (date, inCurrentMonth) => {
    if (!inCurrentMonth) return true;
    if (startOfDay(date) < today) return true;
    const slots = buildTimeSlotsForDate(date, availability, duration);
    return slots.length === 0;
  };

  const handleSelectTime = (timeLabel) => {
    setSelectedTime(timeLabel);
    setStep(2);
  };

  const handleBookingDataChange = (updates) => {
    if ('step' in updates) {
      setStep(updates.step);
    } else {
      setBookingData((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const scheduledAt = toScheduledAtIso(selectedDate, selectedTime);
    if (eventTypeId && scheduledAt) {
      try {
        await fetch(apiUrl('/api/bookings'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type_id: eventTypeId,
            name: bookingData.name,
            email: bookingData.email,
            notes: bookingData.notes || null,
            scheduled_at: scheduledAt,
          }),
        });
      } catch {
        /* still show confirmation — booking may be offline */
      }
    }
    setStep(3);
  };

  if (step === 3) {
    return (
      <BookingConfirmation
        title={title}
        selectedDateLong={selectedDateLong}
        selectedTime={selectedTime}
        bookingData={bookingData}
      />
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-shell booking-shell--wide">
        <BookingSidebar
          title={title}
          duration={duration}
          timezone={availability.timezone}
          location={location}
          description={description}
        />

        <div className="booking-main booking-main--pad">
          {step === 1 && (
            <>
              <h2 className="booking-section-title">Select a Date &amp; Time</h2>
              <div className="booking-pick-grid">
                <BookingCalendar
                  view={view}
                  onShiftMonth={shiftMonth}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  isDisabled={isDisabled}
                />
                <BookingTimeSlots
                  selectedDate={selectedDate}
                  selectedDateLabel={selectedDateLabel}
                  timeSlots={timeSlots}
                  onSelectTime={handleSelectTime}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <BookingForm
              title={title}
              duration={duration}
              selectedDateLong={selectedDateLong}
              selectedTime={selectedTime}
              bookingData={bookingData}
              onDataChange={handleBookingDataChange}
              onSubmit={handleFormSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicBooking;
