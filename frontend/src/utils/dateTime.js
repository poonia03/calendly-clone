/**
 * Combine a calendar date with a 12h label like "2:30 PM" → ISO UTC string.
 */
export function toScheduledAtIso(date, timeLabel) {
  if (!date || !timeLabel) return null;
  const parts = timeLabel.trim().split(/\s+/);
  const timePart = parts[0];
  const period = (parts[1] || 'AM').toUpperCase();
  const [hs, ms] = timePart.split(':');
  let h = parseInt(hs, 10);
  const m = parseInt(ms || '0', 10);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}
