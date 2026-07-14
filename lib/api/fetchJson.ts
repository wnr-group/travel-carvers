/**
 * A utility to fetch JSON from an endpoint and handle standard errors.
 */
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || errorBody.message || 'API request failed');
  }

  // If the response is 204 No Content, return an empty object or null
  if (res.status === 204) {
    return {} as T;
  }

  const body = await res.json();
  // Standardised response wrapper uses { data: ... }
  return (body.data !== undefined ? body.data : body) as T;
}
