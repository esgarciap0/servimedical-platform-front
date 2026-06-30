const rawApiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

export const env = {
  apiUrl: rawApiUrl.replace(/\/+$/, ''),
} as const
