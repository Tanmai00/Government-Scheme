// src/lib/api.js
// Normalize API base URL and guard against accidental whitespace
// Default should be the backend root (not including paths)
const rawApiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const API_BASE = (typeof rawApiBase === 'string' ? rawApiBase.trim() : rawApiBase) || 'http://localhost:4000';

export function setToken(newToken) {
  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
  }
}

async function request(path, options = {}) {
  // ensure path is a string and trim accidental whitespace
  let p = (path || '').toString().trim();
  // ensure path begins with a single '/'
  if (!p.startsWith('/')) p = `/${p}`;
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const finalUrl = `${API_BASE}${p}`;
  // Helpful debug log in development
  if (import.meta.env.DEV) console.debug('[api] request ->', finalUrl, options);
  const res = await fetch(finalUrl, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = { error: text };
  }
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
};