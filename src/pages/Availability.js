// src/pages/Availability.js
// Set which days of the week are available and the time range for each day.

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getAvailability, updateAvailability } from '../api';
import { useToast } from '../context/ToastContext';
import './Availability.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIMEZONES = [
  'Asia/Kolkata', 'America/New_York', 'America/Los_Angeles',
  'America/Chicago', 'Europe/London', 'Europe/Paris',
  'Asia/Tokyo', 'Australia/Sydney', 'UTC',
];

// Default schedule – Mon to Fri, 9am-5pm
const DEFAULT_SCHEDULE = DAYS.map(day => ({
  day,
  enabled: !['Saturday', 'Sunday'].includes(day),
  start: '09:00',
  end:   '17:00',
}));

export default function Availability() {
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [timezone, setTimezone]  = useState('Asia/Kolkata');
  const [loading, setLoading]    = useState(true);
  const [saving, setSaving]      = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchAvailability();
  }, []);

  async function fetchAvailability() {
    try {
      const { data } = await getAvailability();
      if (data.schedule) setSchedule(data.schedule);
      if (data.timezone) setTimezone(data.timezone);
    } catch {
      // If nothing saved yet, use defaults – that's fine
    } finally {
      setLoading(false);
    }
  }

  // Toggle a day on/off
  function toggleDay(index) {
    setSchedule(prev =>
      prev.map((d, i) => i === index ? { ...d, enabled: !d.enabled } : d)
    );
  }

  // Change start or end time for a day
  function changeTime(index, field, value) {
    setSchedule(prev =>
      prev.map((d, i) => i === index ? { ...d, [field]: value } : d)
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateAvailability({ schedule, timezone });
      toast('Availability saved!', 'success');
    } catch {
      toast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1>Availability</h1>
          <p>Set when you're available for meetings</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="avail-container card">
          {/* Timezone selector */}
          <div className="avail-section">
            <h3>Timezone</h3>
            <div className="form-group" style={{ maxWidth: 300, marginTop: 12 }}>
              <select value={timezone} onChange={e => setTimezone(e.target.value)}>
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
          </div>

          <div className="avail-divider" />

          {/* Weekly schedule */}
          <div className="avail-section">
            <h3>Weekly Hours</h3>
            <p className="avail-hint">Set your available hours for each day of the week</p>

            <div className="day-list">
              {schedule.map((item, i) => (
                <div key={item.day} className={`day-row ${item.enabled ? 'enabled' : 'disabled'}`}>
                  {/* Toggle + day name */}
                  <div className="day-left">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={() => toggleDay(i)}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <span className="day-name">{item.day}</span>
                  </div>

                  {/* Time range */}
                  {item.enabled ? (
                    <div className="day-times">
                      <input
                        type="time"
                        value={item.start}
                        onChange={e => changeTime(i, 'start', e.target.value)}
                      />
                      <span className="time-dash">–</span>
                      <input
                        type="time"
                        value={item.end}
                        onChange={e => changeTime(i, 'end', e.target.value)}
                      />
                    </div>
                  ) : (
                    <span className="unavailable-label">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
