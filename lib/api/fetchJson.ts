interface ApiEnvelope<T> {
  data?: T
  error?: string
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  const json: ApiEnvelope<T> | null = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(json?.error ?? `Request failed (${res.status})`)
  }

  if (!json || json.data === undefined) {
    throw new Error('Malformed response from server')
  }

  return json.data
}
