import React, { useMemo, useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  MapPin,
  X,
} from 'lucide-react';
import { apiUrl, fetchJsonSafe } from '../config/api';
import { DEMO_MEETINGS, isDemoMeetingId } from '../data/demoMeetings';

function mapRowToCard(row) {
  const start = new Date(row.scheduled_at);
  const durationMin = Number(row.event_duration) || 30;
  const end = new Date(start.getTime() + durationMin * 60 * 1000);
  const now = new Date();
  const bucket = start >= now ? 'upcoming' : 'past';

  const dateLabel = start.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const tf = { hour: 'numeric', minute: '2-digit' };
  const timeLabel = `${start.toLocaleTimeString('en-US', tf)} - ${end.toLocaleTimeString(
    'en-US',
    tf
  )} (${durationMin} min)`;

  return {
    id: row.id,
    eventTitle: row.event_title || 'Meeting',
    attendee: row.name,
    email: row.email,
    dateLabel,
    timeLabel,
    location: row.event_location || '—',
    bucket,
  };
}

async function fetchBookings() {
  const data = await fetchJsonSafe(apiUrl('/api/bookings'));
  return Array.isArray(data) ? data : [];
}

async function deleteBookingApi(id) {
  const r = await fetch(apiUrl(`/api/bookings/${id}`), { method: 'DELETE' });
  if (!r.ok && r.status !== 204) throw new Error('Failed to delete');
}

function Meetings() {
  /** Show demo rows on first paint; replace when API returns real bookings. */
  const [meetings, setMeetings] = useState(() => [...DEMO_MEETINGS]);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchBookings();
        if (cancelled || !Array.isArray(rows)) return;
        const mapped = rows.map(mapRowToCard);
        if (mapped.length > 0) {
          setMeetings(mapped);
        }
      } catch {
        /* keep initial demo */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcomingCount = useMemo(
    () => meetings.filter((m) => m.bucket === 'upcoming').length,
    [meetings]
  );
  const pastCount = useMemo(
    () => meetings.filter((m) => m.bucket === 'past').length,
    [meetings]
  );

  const visible = meetings.filter((m) => m.bucket === tab);

  const dismiss = async (id) => {
    if (!isDemoMeetingId(id)) {
      try {
        await deleteBookingApi(id);
      } catch {
        /* still remove locally */
      }
    }
    setMeetings((list) => list.filter((m) => m.id !== id));
  };

  return (
    <div className="page-meetings">
      <header className="page-header">
        <div>
          <h1 className="page-title">Meetings</h1>
          <p className="page-subtitle">View and manage your scheduled meetings</p>
        </div>
      </header>

      <div className="tab-pills" role="tablist" aria-label="Meeting filters">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'upcoming'}
          className={`tab-pill ${tab === 'upcoming' ? 'tab-pill--active' : ''}`}
          onClick={() => setTab('upcoming')}
        >
          <Calendar size={18} strokeWidth={2} aria-hidden />
          Upcoming ({upcomingCount})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'past'}
          className={`tab-pill ${tab === 'past' ? 'tab-pill--active' : ''}`}
          onClick={() => setTab('past')}
        >
          <Clock size={18} strokeWidth={2} aria-hidden />
          Past &amp; Cancelled ({pastCount})
        </button>
      </div>

      <div className="meeting-list">
        {visible.length === 0 && (
          <p className="empty-hint">No meetings in this view.</p>
        )}
        {visible.map((m) => (
          <article key={m.id} className="meeting-card">
            <div className="meeting-card-head">
              <h2 className="meeting-card-title">{m.eventTitle}</h2>
              {tab === 'upcoming' && (
                <button
                  type="button"
                  className="btn-icon-muted meeting-dismiss"
                  aria-label="Cancel or remove meeting"
                  onClick={() => dismiss(m.id)}
                >
                  <X size={18} strokeWidth={2} />
                </button>
              )}
            </div>
            <ul className="meeting-details">
              <li>
                <Calendar size={16} strokeWidth={2} aria-hidden />
                {m.dateLabel}
              </li>
              <li>
                <Clock size={16} strokeWidth={2} aria-hidden />
                {m.timeLabel}
              </li>
              <li>
                <User size={16} strokeWidth={2} aria-hidden />
                {m.attendee}
              </li>
              <li>
                <Mail size={16} strokeWidth={2} aria-hidden />
                {m.email}
              </li>
              <li>
                <MapPin size={16} strokeWidth={2} aria-hidden />
                {m.location}
              </li>
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Meetings;
