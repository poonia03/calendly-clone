// src/pages/Meetings.js
// Shows all booked meetings split into Upcoming and Past tabs.
// You can cancel an upcoming meeting from here.

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getMeetings, cancelMeeting } from '../api';
import { useToast } from '../context/ToastContext';
import './Meetings.css';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatTime(timeStr) {
  // timeStr expected as "HH:MM"
  const [h, m] = timeStr.split(':');
  const d = new Date(); d.setHours(+h, +m);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState('upcoming'); // 'upcoming' | 'past'
  const toast = useToast();

  useEffect(() => {
    fetchMeetings();
  }, []);

  async function fetchMeetings() {
    try {
      const { data } = await getMeetings();
      setMeetings(data);
    } catch {
      toast('Failed to load meetings', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Cancel this meeting?')) return;
    try {
      await cancelMeeting(id);
      toast('Meeting cancelled', 'success');
      fetchMeetings();
    } catch {
      toast('Failed to cancel', 'error');
    }
  }

  const now = new Date();

  // Split meetings into upcoming / past
  const upcoming = meetings.filter(m => new Date(`${m.date}T${m.time}`) >= now);
  const past      = meetings.filter(m => new Date(`${m.date}T${m.time}`) <  now);
  const shown     = tab === 'upcoming' ? upcoming : past;

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1>Meetings</h1>
          <p>All your scheduled meetings in one place</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="meetings-tabs">
        <button
          className={`tab-btn ${tab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setTab('upcoming')}
        >
          Upcoming
          {upcoming.length > 0 && <span className="tab-count">{upcoming.length}</span>}
        </button>
        <button
          className={`tab-btn ${tab === 'past' ? 'active' : ''}`}
          onClick={() => setTab('past')}
        >
          Past
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : shown.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: 48 }}>{tab === 'upcoming' ? '📅' : '📁'}</div>
          <h3>No {tab} meetings</h3>
          <p>{tab === 'upcoming' ? 'New bookings will appear here' : 'Past meetings will show here'}</p>
        </div>
      ) : (
        <div className="meetings-list">
          {shown.map(meeting => (
            <div key={meeting.id} className="meeting-card card">
              <div className="meeting-info">
                <div className="meeting-date">
                  <span className="date-label">{formatDate(meeting.date)}</span>
                  <span className="time-label">
                    {formatTime(meeting.time)} · {meeting.duration} min
                  </span>
                </div>
                <div className="meeting-details">
                  <div className="meeting-event">{meeting.event_name}</div>
                  <div className="meeting-invitee">
                    <span>👤</span> {meeting.invitee_name}
                  </div>
                  <div className="meeting-email">
                    <span>✉️</span> {meeting.invitee_email}
                  </div>
                </div>
              </div>
              <div className="meeting-actions">
                {tab === 'upcoming' && (
                  <button className="btn btn-sm btn-danger" onClick={() => handleCancel(meeting.id)}>
                    Cancel
                  </button>
                )}
                {tab === 'past' && (
                  <span className="badge badge-gray">Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
