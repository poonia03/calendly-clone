// src/components/Calendar.js
// A simple month calendar. Highlights available dates and lets the user pick one.

import React, { useState } from 'react';
import './Calendar.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS   = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// availableDays: array of day-of-week numbers that are enabled (0=Sun…6=Sat)
export default function Calendar({ selectedDate, onSelectDate, availableDays = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  // Build the grid of days for this month
  function buildDays() {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0-6
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];

    // Empty cells before the 1st
    for (let i = 0; i < firstDay; i++) cells.push(null);

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return cells;
  }

  const days = buildDays();

  function isDisabled(day) {
    if (!day) return true;
    const date = new Date(viewYear, viewMonth, day);
    date.setHours(0, 0, 0, 0);
    if (date < today) return true;                         // past date
    if (!availableDays.includes(date.getDay())) return true; // not available weekday
    return false;
  }

  function isSelected(day) {
    if (!day || !selectedDate) return false;
    const date = new Date(viewYear, viewMonth, day);
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth()    === selectedDate.getMonth()    &&
      date.getDate()     === selectedDate.getDate()
    );
  }

  function isToday(day) {
    if (!day) return false;
    const date = new Date(viewYear, viewMonth, day);
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth()    === today.getMonth()    &&
      date.getDate()     === today.getDate()
    );
  }

  function handleClick(day) {
    if (isDisabled(day)) return;
    onSelectDate(new Date(viewYear, viewMonth, day));
  }

  return (
    <div className="calendar">
      {/* Header: prev / month-year / next */}
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}>‹</button>
        <span className="cal-title">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="cal-nav" onClick={nextMonth}>›</button>
      </div>

      {/* Weekday labels */}
      <div className="cal-grid">
        {WEEKDAYS.map(d => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}

        {/* Day cells */}
        {days.map((day, i) => (
          <button
            key={i}
            className={[
              'cal-day',
              !day          ? 'empty'    : '',
              isDisabled(day) ? 'disabled' : 'available',
              isSelected(day) ? 'selected' : '',
              isToday(day)    ? 'today'    : '',
            ].join(' ')}
            onClick={() => handleClick(day)}
            disabled={isDisabled(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
