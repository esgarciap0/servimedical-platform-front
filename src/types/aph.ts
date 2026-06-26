/**
 * Tipos compartidos del módulo APH (Atención Prehospitalaria).
 *
 * - `AphForm`: campos editables en el formulario (todos string).
 * - `AphPayload`: cuerpo enviado al backend al crear/editar (form + listas + imagen).
 * - `AphResponse`: registro tal como lo devuelve el backend (payload + id + timestamps).
 *
 * Al agregar un campo nuevo, solo hay que tocar `AphForm` (y `initialForm`).
 * `AphPayload` y `AphResponse` se derivan automáticamente.
 */

export type AphForm = {
  codigo: string
  movil: string
  placa: string
  traslado: string
  tipoTraslado: string
  prioridad: string
  fechaAccidente: string
  horaAccidente: string
  lugarOcurrencia: string
  zonaOrigen: string
  departamentoOrigen: string
  municipioOrigen: string
  documento: string
  primerApellido: string
  segundoApellido: string
  primerNombre: string
  segundoNombre: string
  estadoCivil: string
  ocupacion: string
  sexo: string
  fechaNacimiento: string
  edad: string
  celular: string
  telefono: string
  acompanante: string
  celularAcompanante: string
  avisarA: string
  parentesco: string
  numeroParaAvisar: string
  numeroParaAvisar2: string
  direccion: string
  zonaPaciente: string
  departamento: string
  ciudad: string
  alergia: string
  patologicos: string
  medicacion: string
  liquidos: string
  aseguradora: string
  poliza: string
  planBeneficios: string
  horaLlegada: string
  transportadoA: string
  codigoHabilitacion: string
  departamentoTraslado: string
  ciudadTransporte: string
  estadoPaciente: string
  causaExterna: string
  presion: string
  frecuenciaCardiaca: string
  frecuenciaRespiratoria: string
  temperatura: string
  ro: string
  rv: string
  rm: string
  hallazgos: string
  diagnosticos: string
  materiales: string
  conductor: string
  documentoConductor: string
  paramedico: string
  documentoParamedico: string
  medico: string
  documentoMedico: string
}

export type AphPayload = AphForm & {
  lesiones: string[]
  procedimientos: string[]
  lesionesImagen?: string | null
}

export type AphResponse = AphPayload & {
  id: number
  createdAt: string
  updatedAt: string
}

export type AphSortKey =
  | 'codigo'
  | 'createdAt'
  | 'movil'
  | 'aseguradora'
  | 'documento'
  | 'paciente'
  | 'origen'
  | 'destino'
  | 'paramedico'
  | 'conductor'

export type SortOrder = 'asc' | 'desc'
