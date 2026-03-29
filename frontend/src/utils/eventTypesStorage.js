import { DEFAULT_EVENT_TYPES } from '../data/defaultEventTypes';

const KEY = 'calendly-event-types-v1';

export function loadEventTypes() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [...DEFAULT_EVENT_TYPES];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [...DEFAULT_EVENT_TYPES];
    return parsed;
  } catch {
    return [...DEFAULT_EVENT_TYPES];
  }
}

export function saveEventTypes(events) {
  try {
    localStorage.setItem(KEY, JSON.stringify(events));
  } catch {
    /* ignore quota */
  }
}

export function getEventMetaBySlug(slug) {
  if (!slug) return null;
  const list = loadEventTypes();
  const found = list.find((e) => e.slug === slug);
  return found || null;
}
