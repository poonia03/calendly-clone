/** Shown on the Meetings page when the API returns no bookings (local demo). */
export const DEMO_MEETINGS = [
  {
    id: 'demo-up-1',
    eventTitle: 'Strategy Session',
    attendee: 'Bob Smith',
    email: 'bob@example.com',
    dateLabel: 'Wednesday, April 8, 2026',
    timeLabel: '2:00 PM - 2:30 PM (30 min)',
    location: 'Zoom',
    bucket: 'upcoming',
  },
  {
    id: 'demo-up-2',
    eventTitle: 'Quick Chat',
    attendee: 'Alice Johnson',
    email: 'alice@example.com',
    dateLabel: 'Monday, April 6, 2026',
    timeLabel: '10:00 AM - 10:15 AM (15 min)',
    location: 'Google Meet',
    bucket: 'upcoming',
  },
  {
    id: 'demo-past-1',
    eventTitle: 'Product Demo',
    attendee: 'Casey Lee',
    email: 'casey@example.com',
    dateLabel: 'Friday, March 20, 2026',
    timeLabel: '3:00 PM - 3:45 PM (45 min)',
    location: 'Google Meet',
    bucket: 'past',
  },
  {
    id: 'demo-past-2',
    eventTitle: 'Deep Dive Workshop',
    attendee: 'Jordan Kim',
    email: 'jordan@example.com',
    dateLabel: 'Tuesday, March 10, 2026',
    timeLabel: '11:00 AM - 12:00 PM (60 min)',
    location: 'Zoom',
    bucket: 'past',
  },
];

export function isDemoMeetingId(id) {
  return typeof id === 'string' && id.startsWith('demo-');
}
