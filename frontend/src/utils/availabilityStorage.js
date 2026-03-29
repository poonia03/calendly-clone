const AVAILABILITY_KEY = 'calendly-availability-v1';

const DEFAULT_AVAILABILITY = {
  timezone: 'America/New_York',
  schedule: [
    { day: 'Sunday', active: false, start: '09:00', end: '17:00' },
    { day: 'Monday', active: true, start: '09:00', end: '17:00' },
    { day: 'Tuesday', active: true, start: '09:00', end: '17:00' },
    { day: 'Wednesday', active: true, start: '09:00', end: '17:00' },
    { day: 'Thursday', active: true, start: '09:00', end: '17:00' },
    { day: 'Friday', active: true, start: '09:00', end: '17:00' },
    { day: 'Saturday', active: false, start: '09:00', end: '17:00' },
  ],
};

export function loadAvailability() {
  try {
    const raw = localStorage.getItem(AVAILABILITY_KEY);
    if (!raw) return { ...DEFAULT_AVAILABILITY };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_AVAILABILITY, ...parsed };
  } catch {
    return { ...DEFAULT_AVAILABILITY };
  }
}

export function saveAvailability(availability) {
  try {
    localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(availability));
  } catch {
    /* ignore quota */
  }
}