/** Backend base URL (no trailing slash). Example: http://localhost:4000 */
export const API_ORIGIN = (
  process.env.REACT_APP_API_URL || 'http://localhost:4000'
).replace(/\/$/, '');

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_ORIGIN}${p}`;
}

/**
 * fetch + JSON.parse; returns null on network failure, non-OK response, or invalid JSON.
 * Does not throw — use for optional API calls when the backend may be offline.
 */
export async function fetchJsonSafe(url, init) {
  try {
    const r = await fetch(url, init);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}
