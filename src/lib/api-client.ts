const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY  = process.env.NEXT_PUBLIC_X_API_KEY  || '';
const TIMEOUT_MS = 30_000;

/** Creates an AbortSignal that auto-cancels after TIMEOUT_MS */
function createSignal(): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), TIMEOUT_MS);
  return controller.signal;
}

export async function fetchWithAuth(url: string) {
  const headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  };

  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const res = await fetch(fullUrl, { headers, signal: createSignal() });
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText} (${res.status})`);
  }
  
  const data = await res.json();
  return data;
}

// Special fetcher for endpoint that should NOT automatically extract first element
// e.g. /api/v1/analytics/calls returns { results: [] }
export async function fetchRawWithAuth(url: string) {
  const headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  };

  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const res = await fetch(fullUrl, { headers, signal: createSignal() });
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText} (${res.status})`);
  }
  
  return res.json();
}

// POST helper — used by NLP chat-with-data query endpoint
export async function postWithAuth(url: string, body: unknown) {
  const headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  };

  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const res = await fetch(fullUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: createSignal(),
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText} (${res.status})`);
  }

  return res.json();
}
