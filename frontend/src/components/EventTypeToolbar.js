import React from 'react';
import { Search } from 'lucide-react';

function EventTypeToolbar({ search, onSearchChange, onNewEvent }) {
  return (
    <div className="toolbar">
      <div className="search-wrap">
        <Search className="search-icon" size={18} strokeWidth={2} aria-hidden />
        <input
          type="search"
          className="search-input"
          placeholder="Search event types..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={onNewEvent}>
        + New Event Type
      </button>
    </div>
  );
}

export default EventTypeToolbar;
