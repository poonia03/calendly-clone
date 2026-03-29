import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarWeeks(year, month) {
  const start = new Date(year, month, 1);
  start.setDate(1 - start.getDay());
  const weeks = [];
  const cur = new Date(start);
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const cell = new Date(cur);
      row.push({
        date: cell,
        inCurrentMonth: cell.getMonth() === month,
      });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(row);
  }
  return weeks;
}

function BookingCalendar({
  view,
  onShiftMonth,
  selectedDate,
  onSelectDate,
  isDisabled,
}) {
  const weeks = useMemo(
    () => buildCalendarWeeks(view.year, view.month),
    [view.year, view.month]
  );

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' }
  );

  return (
    <div className="booking-calendar-wrap">
      <div className="booking-cal-nav">
        <button
          type="button"
          className="booking-cal-nav-btn"
          onClick={() => onShiftMonth(-1)}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <span className="booking-cal-month">{monthLabel}</span>
        <button
          type="button"
          className="booking-cal-nav-btn"
          onClick={() => onShiftMonth(1)}
          aria-label="Next month"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>
      <div className="booking-cal-weekdays">
        {WEEKDAYS.map((d) => (
          <span key={d} className="booking-cal-wd">
            {d}
          </span>
        ))}
      </div>
      <div className="booking-cal-grid">
        {weeks.map((row, wi) => (
          <div key={wi} className="booking-cal-row">
            {row.map(({ date, inCurrentMonth }, di) => {
              const disabled = isDisabled(date, inCurrentMonth);
              const isToday = isSameDay(date, new Date());
              const isSelected =
                selectedDate && isSameDay(date, selectedDate);
              return (
                <button
                  key={di}
                  type="button"
                  disabled={disabled}
                  className={`booking-cal-cell ${
                    !inCurrentMonth ? 'booking-cal-cell--muted' : ''
                  } ${isSelected ? 'booking-cal-cell--selected' : ''} ${
                    isToday ? 'booking-cal-cell--today' : ''
                  }`}
                  onClick={() => {
                    if (!disabled) onSelectDate(new Date(date));
                  }}
                >
                  <span className="booking-cal-num">{date.getDate()}</span>
                  {isToday && !isSelected ? (
                    <span className="booking-cal-dot" />
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingCalendar;
