import React from 'react';
import { X } from 'lucide-react';

const COLOR_OPTIONS = [
  { id: 'blue', label: 'Blue', hex: '#2563EB' },
  { id: 'purple', label: 'Purple', hex: '#7C3AED' },
  { id: 'green', label: 'Green', hex: '#059669' },
  { id: 'orange', label: 'Orange', hex: '#EA580C' },
];

const DURATION_OPTIONS = [15, 30, 45, 60];

function EventTypeModal({
  isOpen,
  isEditing,
  form,
  onClose,
  onFormChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditing ? 'Edit Event Type' : 'New Event Type'}
          </h2>
          <button
            type="button"
            className="btn-icon-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          <label className="field">
            <span className="field-label">Event Name</span>
            <input
              className="input"
              required
              placeholder="e.g. Quick Chat"
              value={form.title}
              onChange={(e) => onFormChange({ title: e.target.value })}
            />
          </label>
          <div className="field-row">
            <label className="field">
              <span className="field-label">Duration</span>
              <select
                className="input select"
                value={form.duration}
                onChange={(e) =>
                  onFormChange({ duration: Number(e.target.value) })
                }
              >
                {DURATION_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Color</span>
              <select
                className="input select"
                value={form.color}
                onChange={(e) => onFormChange({ color: e.target.value })}
              >
                {COLOR_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span className="field-label">URL Slug</span>
            <div className="slug-input">
              <span className="slug-prefix">/book/</span>
              <input
                className="input slug-field"
                placeholder="your-link"
                value={form.slug}
                onChange={(e) => onFormChange({ slug: e.target.value })}
              />
            </div>
          </label>
          <label className="field">
            <span className="field-label">Location</span>
            <input
              className="input"
              placeholder="e.g. Zoom, Google Meet, Phone"
              value={form.location}
              onChange={(e) => onFormChange({ location: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="field-label">Description</span>
            <textarea
              className="input textarea"
              rows={4}
              placeholder="Add a description..."
              value={form.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block">
            {isEditing ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EventTypeModal;
