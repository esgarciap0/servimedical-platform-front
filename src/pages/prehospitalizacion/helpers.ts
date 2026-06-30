import type { AphForm, AphResponse, AphSortKey } from '../../types/aph'
import type { Slug } from 'react-muscle-highlighter'
import { bodyPartLabels } from './constants'

export function getPatientName(
  row: Pick<AphResponse, 'primerNombre' | 'segundoNombre' | 'primerApellido' | 'segundoApellido'>,
): string {
  return [row.primerNombre, row.segundoNombre, row.primerApellido, row.segundoApellido]
    .filter(Boolean)
    .join(' ')
}

export function getDocumentType(tipoDocumento?: string): string {
  return tipoDocumento || ''
}

export function getSortValue(row: AphResponse, key: AphSortKey): string | number {
  switch (key) {
    case 'codigo': {
      const value = Number(row.codigo || row.id)
      return Number.isNaN(value) ? row.codigo || String(row.id) : value
    }

    case 'createdAt': {
      const value = new Date(row.createdAt || '').getTime()
      return Number.isNaN(value) ? 0 : value
    }

    case 'movil':
      return row.movil || ''

    case 'aseguradora':
      return row.aseguradora || ''

    case 'documento':
      return row.documento || ''

    case 'paciente':
      return getPatientName(row)

    case 'origen':
      return row.lugarOcurrencia || ''

    case 'destino':
      return row.transportadoA || ''

    case 'paramedico':
      return row.paramedico || ''

    case 'conductor':
      return row.conductor || ''

    default:
      return ''
  }
}

export function compareSortValues(first: string | number, second: string | number): number {
  if (typeof first === 'number' && typeof second === 'number') {
    return first - second
  }

  return String(first).localeCompare(String(second), 'es', {
    numeric: true,
    sensitivity: 'base',
  })
}

export function makeInjuryKey(view: 'front' | 'back', slug: Slug, side?: 'left' | 'right'): string {
  return `${view}:${slug}:${side || 'both'}`
}

export type InjuryKey = { view: 'front' | 'back'; slug: Slug; side?: 'left' | 'right' }

export function parseInjuryKey(value: string): InjuryKey | null {
  const [view, slug, side] = value.split(':')

  if ((view !== 'front' && view !== 'back') || !slug) {
    return null
  }

  return {
    view,
    slug: slug as Slug,
    side: side === 'left' || side === 'right' ? side : undefined,
  }
}

export function formatInjuryLabel(value: string): string {
  const parsed = parseInjuryKey(value)

  if (!parsed) {
    return value
  }

  const sideLabel = parsed.side === 'left' ? 'izquierda' : parsed.side === 'right' ? 'derecha' : ''
  const viewLabel = parsed.view === 'back' ? 'posterior' : 'anterior'

  return [bodyPartLabels[parsed.slug] || parsed.slug, sideLabel, viewLabel].filter(Boolean).join(' ')
}

/**
 * Devuelve solo los campos del formulario presentes en `data`, ignorando
 * cualquier propiedad extra del backend. Útil al cargar para editar.
 */
export function pickFormFields(data: Partial<AphResponse>, base: AphForm): AphForm {
  const next: AphForm = { ...base }
  ;(Object.keys(base) as (keyof AphForm)[]).forEach((key) => {
    const value = data[key]
    if (typeof value === 'string') {
      next[key] = value
    }
  })
  return next
}
