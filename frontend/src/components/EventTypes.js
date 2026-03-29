import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadEventTypes, saveEventTypes } from '../utils/eventTypesStorage';
import EventTypeCard from './EventTypeCard';
import EventTypeModal from './EventTypeModal';
import EventTypeToolbar from './EventTypeToolbar';

import { apiUrl } from '../config/api';

const EVENT_TYPES_URL = apiUrl('/api/event-types');

const COLOR_OPTIONS = [
  { id: 'blue', label: 'Blue', hex: '#2563EB' },
  { id: 'purple', label: 'Purple', hex: '#7C3AED' },
  { id: 'green', label: 'Green', hex: '#059669' },
  { id: 'orange', label: 'Orange', hex: '#EA580C' },
];

function colorHex(colorId) {
  return COLOR_OPTIONS.find((c) => c.id === colorId)?.hex || '#2563EB';
}

async function fetchEventTypes() {
  const resp = await fetch(EVENT_TYPES_URL);
  if (!resp.ok) throw new Error('Failed to fetch event types from API');
  return resp.json();
}

async function createEventType(eventPayload) {
  const resp = await fetch(EVENT_TYPES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventPayload),
  });
  if (!resp.ok) throw new Error('Failed to create event type');
  return resp.json();
}

async function updateEventType(id, eventPayload) {
  const resp = await fetch(`${EVENT_TYPES_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventPayload),
  });
  if (!resp.ok) throw new Error('Failed to update event type');
  return resp.json();
}

async function deleteEventTypeApi(id) {
  const resp = await fetch(`${EVENT_TYPES_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!resp.ok) throw new Error('Failed to delete event type');
  return true;
}

function EventTypes() {
  const [events, setEvents] = useState(() => loadEventTypes());
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const apiEvents = await fetchEventTypes();
        if (Array.isArray(apiEvents) && apiEvents.length > 0) {
          setEvents(apiEvents);
          return;
        }
      } catch (error) {
        console.warn('Backend unavailable, using local storage:', error.message);
      }
      setEvents(loadEventTypes());
    };
    load();
  }, []);

  useEffect(() => {
    saveEventTypes(events);
  }, [events]);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    duration: 30,
    color: 'blue',
    slug: '',
    location: '',
    description: '',
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q))
    );
  }, [events, search]);

  const slugify = (s) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const openNew = () => {
    setEditingId(null);
    setForm({
      title: '',
      duration: 30,
      color: 'blue',
      slug: '',
      location: '',
      description: '',
    });
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      duration: event.duration,
      color: event.color,
      slug: event.slug,
      location: event.location || '',
      description: event.description || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleFormChange = (updates) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = form.slug.trim() ? slugify(form.slug) : slugify(form.title);
    const payload = {
      title: form.title,
      duration: Number(form.duration),
      color: form.color,
      slug,
      location: form.location,
      description: form.description,
      enabled: true,
    };

    if (editingId) {
      try {
        const updated = await updateEventType(editingId, payload);
        setEvents((list) => list.map((x) => (x.id === editingId ? updated : x)));
      } catch (error) {
        console.warn('Update API failed, using local state:', error.message);
        setEvents((list) =>
          list.map((x) =>
            x.id === editingId
              ? {
                  ...x,
                  ...payload,
                  id: editingId,
                }
              : x
          )
        );
      }
    } else {
      try {
        const created = await createEventType(payload);
        setEvents((list) => [...list, created]);
      } catch (error) {
        console.warn('Create API failed, using local state:', error.message);
        setEvents((list) => [
          ...list,
          {
            ...payload,
            id: Date.now(),
          },
        ]);
      }
    }

    closeModal();
  };

  const toggleEnabled = async (id) => {
    const target = events.find((e) => e.id === id);
    if (!target) return;
    const toggled = { ...target, enabled: !target.enabled };

    try {
      const updated = await updateEventType(id, toggled);
      setEvents((list) => list.map((x) => (x.id === id ? updated : x)));
    } catch (error) {
      console.warn('Toggle API failed, using local state:', error.message);
      setEvents((list) => list.map((x) => (x.id === id ? toggled : x)));
    }
  };

  const copyLink = (slug) => {
    const url = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(url);
  };

  const preview = (slug) => {
    navigate(`/book/${slug}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEventTypeApi(id);
      setEvents((list) => list.filter((e) => e.id !== id));
    } catch (error) {
      console.warn('Delete API failed, using local state:', error.message);
      setEvents((list) => list.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="page-event-types">
      <header className="page-header">
        <div>
          <h1 className="page-title">Event Types</h1>
          <p className="page-subtitle">
            Create events to share for people to book on your calendar
          </p>
        </div>
      </header>

      <EventTypeToolbar
        search={search}
        onSearchChange={setSearch}
        onNewEvent={openNew}
      />

      <div className="event-card-grid">
        {filtered.map((event) => (
          <EventTypeCard
            key={event.id}
            event={event}
            colorHex={colorHex}
            onCopyLink={copyLink}
            onPreview={preview}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggleEnabled={toggleEnabled}
          />
        ))}
      </div>

      <EventTypeModal
        isOpen={modalOpen}
        isEditing={!!editingId}
        form={form}
        onClose={closeModal}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default EventTypes;
