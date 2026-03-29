// src/pages/EventTypes.js
// Lists all event types. You can create, edit, and delete them.
// Each event type has a shareable public booking link.

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getEventTypes, createEventType, updateEventType, deleteEventType } from '../api';
import { useToast } from '../context/ToastContext';
import './EventTypes.css';

// ── Small modal for Create / Edit ───────────────────────────────────────────
function EventTypeModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { name: '', duration: 30, slug: '', description: '' }
  );

  // Auto-generate slug from name
  function handleNameChange(e) {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm(f => ({ ...f, name, slug }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.slug || !form.duration) return;
    onSave(form);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{initial ? 'Edit Event Type' : 'New Event Type'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name *</label>
            <input
              value={form.name}
              onChange={handleNameChange}
              placeholder="e.g. 30 Minute Meeting"
              required
            />
          </div>
          <div className="form-group">
            <label>URL Slug *</label>
            <div className="slug-input">
              <span className="slug-prefix">/book/</span>
              <input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="30-minute-meeting"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Duration (minutes) *</label>
            <select
              value={form.duration}
              onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}
            >
              {[15, 20, 30, 45, 60, 90].map(d => (
                <option key={d} value={d}>{d} min</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description for invitees"
              rows={2}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {initial ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function EventTypes() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null); // event type being edited
  const toast = useToast();

  // Load event types on mount
  useEffect(() => {
    fetchEventTypes();
  }, []);

  async function fetchEventTypes() {
    try {
      const { data } = await getEventTypes();
      setEventTypes(data);
    } catch {
      toast('Failed to load event types', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(form) {
    try {
      if (editing) {
        await updateEventType(editing.id, form);
        toast('Event type updated!', 'success');
      } else {
        await createEventType(form);
        toast('Event type created!', 'success');
      }
      setShowModal(false);
      setEditing(null);
      fetchEventTypes();
    } catch (err) {
      toast(err.response?.data?.error || 'Something went wrong', 'error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this event type?')) return;
    try {
      await deleteEventType(id);
      toast('Deleted successfully', 'success');
      fetchEventTypes();
    } catch {
      toast('Failed to delete', 'error');
    }
  }

  function openEdit(et) {
    setEditing(et);
    setShowModal(true);
  }

  // Copy booking link to clipboard
  function copyLink(slug) {
    const url = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(url);
    toast('Link copied!', 'success');
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1>Event Types</h1>
          <p>Manage the types of events people can book with you</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditing(null); setShowModal(true); }}
        >
          + New Event Type
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : eventTypes.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: 48 }}>📅</div>
          <h3>No event types yet</h3>
          <p>Create your first event type to get a booking link</p>
        </div>
      ) : (
        <div className="event-type-grid">
          {eventTypes.map(et => (
            <div key={et.id} className="event-card card">
              {/* Color strip */}
              <div className="event-card-strip" />

              <div className="event-card-body">
                <div className="event-card-top">
                  <h3 className="event-name">{et.name}</h3>
                  <span className="badge badge-blue">{et.duration} min</span>
                </div>
                {et.description && (
                  <p className="event-desc">{et.description}</p>
                )}
                <div className="event-slug">
                  <span>📎</span>
                  <span>/book/{et.slug}</span>
                </div>
              </div>

              <div className="event-card-footer">
                <button className="btn btn-sm btn-ghost" onClick={() => copyLink(et.slug)}>
                  Copy Link
                </button>
                <a
                  href={`/book/${et.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline"
                >
                  View
                </a>
                <button className="btn btn-sm btn-ghost" onClick={() => openEdit(et)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(et.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <EventTypeModal
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}
    </AdminLayout>
  );
}
