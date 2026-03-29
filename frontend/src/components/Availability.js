import React, { useState, useEffect, useRef } from 'react';
import { Globe, Clock } from 'lucide-react';
import { apiUrl, fetchJsonSafe } from '../config/api';
import { loadAvailability, saveAvailability } from '../utils/availabilityStorage';

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'UTC',
];

function buildTimeOptions() {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hour12 = h % 12 || 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      const label = `${hour12}:${m === 0 ? '00' : '30'} ${ampm}`;
      const value = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
      opts.push({ value, label });
    }
  }
  return opts;
}

const TIME_OPTIONS = buildTimeOptions();

function fetchAvailability() {
  return fetchJsonSafe(apiUrl('/api/availability'));
}

async function putAvailability(body) {
  const r = await fetch(apiUrl('/api/availability'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error('Failed to save availability');
  return r.json();
}

function Availability() {
  const [availability, setAvailability] = useState(() => loadAvailability());
  const [hydrated, setHydrated] = useState(false);
  const skipNextSave = useRef(false);

  const { timezone, schedule } = availability;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAvailability();
        if (!cancelled && data?.schedule) {
          skipNextSave.current = true;
          setAvailability(data);
        }
      } catch {
        if (!cancelled) setAvailability(loadAvailability());
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    saveAvailability(availability);
  }, [availability]);

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    const t = setTimeout(() => {
      putAvailability(availability).catch(() => {
        /* offline / API down — localStorage still updated */
      });
    }, 400);
    return () => clearTimeout(t);
  }, [availability, hydrated]);

  const handleToggleDay = (index) => {
    setAvailability((prev) => ({
      ...prev,
      schedule: prev.schedule.map((item, i) =>
        i === index ? { ...item, active: !item.active } : item
      ),
    }));
  };

  const handleTimeChange = (index, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      schedule: prev.schedule.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <div className="page-availability">
      <header className="page-header">
        <div>
          <h1 className="page-title">Availability</h1>
          <p className="page-subtitle">Set when you&apos;re available for bookings</p>
        </div>
      </header>

      <section className="settings-card">
        <div className="settings-card-head">
          <div className="settings-card-icon" aria-hidden>
            <Globe size={18} strokeWidth={2} />
          </div>
          <div>
            <h2 className="settings-card-title">Timezone</h2>
            <p className="settings-card-hint">All times are displayed in this timezone</p>
          </div>
        </div>
        <label className="sr-only" htmlFor="tz-select">
          Timezone
        </label>
        <select
          id="tz-select"
          className="input select full"
          value={timezone}
          onChange={(e) =>
            setAvailability((prev) => ({ ...prev, timezone: e.target.value }))
          }
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </section>

      <section className="settings-card settings-card--wide">
        <div className="settings-card-head">
          <div className="settings-card-icon" aria-hidden>
            <Clock size={18} strokeWidth={2} />
          </div>
          <div>
            <h2 className="settings-card-title">Weekly Hours</h2>
            <p className="settings-card-hint">Set your available hours for each day</p>
          </div>
        </div>
        <div className="weekly-list">
          {schedule.map((item, index) => (
            <div key={item.day} className="weekly-row">
              <button
                type="button"
                className={`switch ${item.active ? 'switch--on' : ''}`}
                onClick={() => handleToggleDay(index)}
                aria-pressed={item.active}
                aria-label={`${item.day} ${item.active ? 'available' : 'unavailable'}`}
              >
                <span className="switch-knob" />
              </button>
              <span className="weekly-day">{item.day}</span>
              {item.active ? (
                <div className="weekly-times">
                  <select
                    className="input select time-select"
                    value={item.start}
                    onChange={(e) =>
                      handleTimeChange(index, 'start', e.target.value)
                    }
                    aria-label={`${item.day} start`}
                  >
                    {TIME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <span className="weekly-to">to</span>
                  <select
                    className="input select time-select"
                    value={item.end}
                    onChange={(e) =>
                      handleTimeChange(index, 'end', e.target.value)
                    }
                    aria-label={`${item.day} end`}
                  >
                    {TIME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="weekly-unavailable">Unavailable</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Availability;
