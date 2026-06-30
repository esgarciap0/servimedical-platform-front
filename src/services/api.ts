import { env } from '../config/env'

export type ApiErrorPayload = {
  message?: string
  fields?: string[]
}

export class ApiError extends Error {
  status: number
  fields: string[]

  constructor(message: string, status: number, fields: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

type RequestOptions = {
  method?: string
  headers?: HeadersInit
  body?: unknown
  signal?: AbortSignal
  credentials?: RequestCredentials
  cache?: RequestCache
  mode?: RequestMode
}

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${env.apiUrl}${normalized}`
}

async function parseError(response: Response): Promise<ApiError> {
  const text = await response.text().catch(() => '')

  let message = `Error ${response.status}`
  let fields: string[] = []

  if (text) {
    try {
      const parsed = JSON.parse(text) as ApiErrorPayload
      if (parsed.message) message = parsed.message
      if (parsed.fields) fields = parsed.fields
    } catch {
      message = text.slice(0, 200)
    }
  }

  return new ApiError(message, response.status, fields)
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options
  const isJsonBody = body !== undefined && !(body instanceof FormData)

  const init: RequestInit = {
    ...rest,
    headers: {
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  }

  if (body !== undefined) {
    init.body = isJsonBody ? JSON.stringify(body) : (body as BodyInit)
  }

  const response = await fetch(buildUrl(path), init)

  if (!response.ok) {
    throw await parseError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return (await response.json()) as T
  }

  return (await response.text()) as unknown as T
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
  getBlob: async (path: string, options?: RequestOptions): Promise<Blob> => {
    const { body: _body, headers, signal, credentials, cache, mode } = options ?? {}
    void _body
    const response = await fetch(buildUrl(path), {
      method: 'GET',
      headers,
      signal,
      credentials,
      cache,
      mode,
    })
    if (!response.ok) throw await parseError(response)
    return response.blob()
  },
}
