import type { AphForm, AphSortKey } from '../../types/aph'

export const tabs = [
  'Paciente',
  'Aseguradora',
  'Causa externa',
  'Examen fisico',
  'Procedimiento',
  'Materiales y drogas',
  'Tripulacion',
] as const

export const causes = [
  'Enfermedad General',
  'Accidente comun',
  'Lesion por agresion',
  'Accidente de transito',
  'Lesion autoinfringida',
  'Accidente de trabajo',
  'Catastrofe',
  'Accidente rabico o fatidico',
  'Otro',
] as const

export const trasladoOptions = ['PRIMARIO', 'SECUNDARIO'] as const
export const tipoTrasladoOptions = ['BASICO', 'MEDICALIZADO'] as const
export const prioridadOptions = ['1', '2', '3', '4'] as const
export const zonaOptions = ['U', 'R'] as const
export const sexoOptions = ['M', 'F'] as const
export const planBeneficiosOptions = ['SOAT', 'ARL', 'EPS', 'PARTICULAR'] as const
export const ambulanceOptions = ['001', '002', '003'] as const

/**
 * Tipos de documento soportados por el backend.
 * CC: Cédula de ciudadanía, TI: Tarjeta de identidad, CE: Cédula de extranjería,
 * RC: Registro civil, PA: Pasaporte, MS: Menor sin identificar,
 * AS: Adulto sin identificar, NU: NUIP.
 */
export const tipoDocumentoOptions = ['CC', 'TI', 'CE', 'RC', 'PA', 'MS', 'AS', 'NU'] as const

export const procedures = [
  'Oxigenacion',
  'Hemoplastia',
  'Medicacion',
  'Aspiracion',
  'Desfibrilacion',
  'Parto',
  'Ventilacion',
  'Inmovilizacion',
  'Canalizacion',
  'Entubacion',
  'Vendaje',
  'Curacion',
  'RCP',
  'Asepsia',
  'Apoyo Psicologico',
  'Sutura',
  'Liquidos',
  'Collar cervical',
  'Otro',
] as const

export const requiredFieldsByTab: Record<number, (keyof AphForm)[]> = {
  0: [
    'codigo',
    'movil',
    'placa',
    'traslado',
    'tipoTraslado',
    'prioridad',
    'fechaAccidente',
    'horaAccidente',
    'lugarOcurrencia',
    'zonaOrigen',
    'departamentoOrigen',
    'municipioOrigen',
    'documento',
    'tipoDocumento',
    'primerApellido',
    'segundoApellido',
    'primerNombre',
    'segundoNombre',
    'estadoCivil',
    'ocupacion',
    'sexo',
    'fechaNacimiento',
    'edad',
    'celular',
    'telefono',
    'acompanante',
    'celularAcompanante',
    'avisarA',
    'parentesco',
    'direccion',
    'zonaPaciente',
    'departamento',
    'ciudad',
    'alergia',
    'patologicos',
    'medicacion',
    'liquidos',
  ],
  1: [
    'aseguradora',
    'poliza',
    'planBeneficios',
    'horaLlegada',
    'transportadoA',
    'departamentoTraslado',
    'ciudadTransporte',
    'estadoPaciente',
  ],
  2: ['causaExterna'],
  3: ['presion', 'frecuenciaCardiaca', 'frecuenciaRespiratoria', 'temperatura', 'ro', 'rv', 'rm', 'hallazgos', 'diagnosticos'],
  4: [],
  5: ['materiales'],
  6: ['conductor', 'documentoConductor', 'paramedico', 'documentoParamedico', 'medico', 'documentoMedico'],
}

export type TableColumn = {
  label: string
  sortKey?: AphSortKey
  width?: number
  minWidth?: number
  maxWidth?: number
  sticky?: boolean
}

export const tableColumns: TableColumn[] = [
  { label: 'APH', sortKey: 'codigo', width: 72 },
  { label: 'Fecha', sortKey: 'createdAt', width: 112 },
  { label: 'Ambulancia', sortKey: 'movil', width: 118 },
  { label: 'Aseguradora', sortKey: 'aseguradora', width: 140 },
  { label: 'T.D.', width: 64 },
  { label: 'N° ID', sortKey: 'documento', width: 130 },
  { label: 'Paciente', sortKey: 'paciente', width: 230 },
  { label: 'Origen', sortKey: 'origen', width: 150 },
  { label: 'Destino', sortKey: 'destino', width: 190 },
  { label: 'Paramedico', sortKey: 'paramedico', width: 160 },
  { label: 'Conductor', sortKey: 'conductor', width: 160 },
  { label: 'Acciones', width: 124, sticky: true },
]

export const stickyActionHeaderSx = {
  position: 'sticky',
  right: 0,
  zIndex: 5,
  bgcolor: '#f8fafc',
  boxShadow: '-10px 0 16px -14px rgba(15, 23, 42, 0.55)',
  minWidth: 124,
  width: 124,
} as const

export const stickyActionBodySx = {
  position: 'sticky',
  right: 0,
  zIndex: 4,
  bgcolor: '#ffffff',
  boxShadow: '-10px 0 16px -14px rgba(15, 23, 42, 0.45)',
  minWidth: 124,
  width: 124,
} as const

export const actionButtonSx = {
  width: 30,
  height: 30,
  minWidth: 30,
  borderRadius: 1.2,
  p: 0,
  '& svg': {
    fontSize: 18,
  },
} as const

import type { Slug } from 'react-muscle-highlighter'

export const bodyPartLabels: Record<Slug, string> = {
  abs: 'Abdomen',
  adductors: 'Aductores',
  ankles: 'Tobillos',
  biceps: 'Biceps',
  calves: 'Pantorrillas',
  chest: 'Torax',
  deltoids: 'Hombros',
  feet: 'Pies',
  forearm: 'Antebrazos',
  gluteal: 'Cadera / gluteos',
  hamstring: 'Muslos posteriores',
  hands: 'Manos',
  hair: 'Cabello',
  head: 'Cabeza',
  knees: 'Rodillas',
  'lower-back': 'Zona lumbar',
  neck: 'Cuello',
  obliques: 'Flancos',
  quadriceps: 'Muslos anteriores',
  tibialis: 'Piernas anteriores',
  trapezius: 'Trapecio',
  triceps: 'Brazos posteriores',
  'upper-back': 'Espalda superior',
}
