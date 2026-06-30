import { api } from './api'
import type { AphPayload, AphResponse } from '../types/aph'

const RESOURCE = '/aph'

export const aphService = {
  list: (signal?: AbortSignal) => api.get<AphResponse[]>(RESOURCE, { signal }),

  getById: (id: number, signal?: AbortSignal) =>
    api.get<AphResponse>(`${RESOURCE}/${id}`, { signal }),

  create: (payload: AphPayload) => api.post<AphResponse>(RESOURCE, payload),

  update: (id: number, payload: AphPayload) =>
    api.put<AphResponse>(`${RESOURCE}/${id}`, payload),

  remove: (id: number) => api.delete<void>(`${RESOURCE}/${id}`),

  getPdfBlob: (id: number) => api.getBlob(`${RESOURCE}/${id}/pdf`),
}
