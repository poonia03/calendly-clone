import React, { useState } from 'react';
import { Clock, Link2, Copy, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import Toast from './Toast';

function EventTypeCard({
  event,
  colorHex,
  onCopyLink,
  onPreview,
  onEdit,
  onDelete,
  onToggleEnabled,
}) {
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleCopyLink = (slug) => {
    onCopyLink(slug);
    setShowCopyToast(true);
  };
  return (
    <article className="event-card">
      <Toast
        message="Link copied to clipboard!"
        isVisible={showCopyToast}
        onClose={() => setShowCopyToast(false)}
      />
      <div
        className="event-card-accent"
        style={{ backgroundColor: colorHex(event.color) }}
      />
      <div className="event-card-inner">
        <div className="event-card-header-row">
          <h2 className="event-card-title">{event.title}</h2>
          <button
            type="button"
            className={`switch ${event.enabled ? 'switch--on' : ''}`}
            onClick={() => onToggleEnabled(event.id)}
            aria-pressed={event.enabled}
            aria-label={event.enabled ? 'Disable event' : 'Enable event'}
          >
            <span className="switch-knob" />
          </button>
        </div>
        <p className="event-card-desc">
          {event.description || 'Add a description so guests know what to expect.'}
        </p>
        <div className="event-card-meta">
          <span>
            <Clock size={16} strokeWidth={2} aria-hidden />
            {event.duration} min
          </span>
          <span>
            <Link2 size={16} strokeWidth={2} aria-hidden />
            {event.location || '—'}
          </span>
        </div>
        <div className="event-card-divider" />
        <div className="event-card-actions">
          <button
            type="button"
            className="btn btn-soft btn-sm"
            onClick={() => handleCopyLink(event.slug)}
          >
            <Copy size={14} strokeWidth={2} />
            Copy Link
          </button>
          <button
            type="button"
            className="btn btn-soft btn-sm"
            onClick={() => onPreview(event.slug)}
            disabled={!event.enabled}
          >
            <ExternalLink size={14} strokeWidth={2} />
            Preview
          </button>
          <span className="event-card-actions-spacer" aria-hidden />
          <button
            type="button"
            className="btn-icon-muted"
            onClick={() => onEdit(event)}
            aria-label="Edit event type"
          >
            <Pencil size={18} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="btn-icon-muted btn-icon-danger"
            onClick={() => onDelete(event.id)}
            aria-label="Delete event type"
          >
            <Trash2 size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default EventTypeCard;
