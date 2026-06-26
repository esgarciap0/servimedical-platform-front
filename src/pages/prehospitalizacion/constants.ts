import type { AphForm, AphSortKey } from '../../types/aph'
import type { Slug } from 'react-muscle-highlighter'

export const tabs = [
  'Paciente',
  'Aseguradora',
  'Causa externa',
  'Examen fisico',
  'Procedimiento',
  'Materiales y drogas',
  'Tripulacion',
  'Datos Vehiculo',
  'Datos Propietario',
  'Datos Conductor',
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
export const atencionInicialOptions = ['1', '2', '3', '4', '5', '6', '7', '8'] as const
export const zonaOptions = [
  { value: 'U', label: 'Urbano' },
  { value: 'R', label: 'Rural' },
] as const
export const zonaOrigenOptions = [
  { value: '02', label: 'Urbana' },
  { value: '01', label: 'Rural' },
] as const
export const sexoOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
] as const
export const planBeneficiosOptions = ['SOAT', 'ARL', 'EPS', 'PARTICULAR'] as const
export const ambulanceOptions = ['001', '002', '003'] as const
export const documentTypeOptions = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'CD', label: 'Carné diplomático' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'PE', label: 'Permiso especial de permanencia' },
  { value: 'RC', label: 'Registro civil de nacimiento' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'CN', label: 'Certificado de nacido vivo' },
  { value: 'DE', label: 'Documento extranjero' },
  { value: 'PT', label: 'Permiso por protección temporal' },
  { value: 'SC', label: 'Salvoconducto' },
  { value: 'AS', label: 'Adulto sin identificar' },
  { value: 'MS', label: 'Menor sin identificar' },
] as const
export const poblacionOptions = [
  { value: '01', label: 'Población Habitante de calle' },
  { value: '02', label: 'Niños, niñas, adolescentes y jóvenes en proceso administrativo para el restablecimiento de sus derechos' },
  { value: '10', label: 'Población infantil vulnerable bajo protección de instituciones diferentes al ICBF' },
  {
    value: '14',
    label:
      'Población privada de la libertad a cargo de las entidades territoriales del orden departamental, distrital o municipal e inimputables por trastorno mental en cumplimiento de medida de seguridad',
  },
  { value: '16', label: 'Adultos mayores de escasos recursos y en estado de abandono en centros de protección' },
  { value: '17', label: 'Comunidades indígenas incluida la población recluida en centros de armonización' },
  {
    value: '22',
    label:
      'Personas en prisión domiciliaria a cargo del INPEC que no pertenecen al Régimen Contributivo o a un Régimen Especial o de Excepción',
  },
  { value: '25', label: 'Adolescentes y jóvenes a cargo del ICBF en el sistema de responsabilidad penal para adolescentes' },
] as const
export const naturalezaOptions = [
  { value: '01', label: 'Accidente de tránsito' },
  { value: '02', label: 'Sismo' },
  { value: '03', label: 'Maremoto' },
  { value: '04', label: 'Erupción volcánica' },
  { value: '05', label: 'Deslizamiento de tierra' },
  { value: '06', label: 'Inundación' },
  { value: '07', label: 'Avalancha' },
  { value: '08', label: 'Incendio natural' },
  { value: '09', label: 'Explosión terrorista' },
  { value: '10', label: 'Incendio terrorista' },
  { value: '11', label: 'Combate' },
  { value: '12', label: 'Ataques a Municipios' },
  { value: '13', label: 'Masacre' },
  { value: '14', label: 'Desplazados' },
  { value: '15', label: 'Mina antipersonal' },
  { value: '16', label: 'Huracán' },
  { value: '17', label: 'Otro' },
  { value: '25', label: 'Rayo' },
  { value: '26', label: 'Vendaval' },
  { value: '27', label: 'Tornado' },
] as const
export const condicionOptions = [
  { value: '01', label: 'Conductor' },
  { value: '02', label: 'Peatón' },
  { value: '03', label: 'Ocupante' },
  { value: '04', label: 'Ciclista' },
] as const
export const aseguramientoOptions = [
  { value: '2', label: 'No asegurado' },
  { value: '3', label: 'Vehículo fantasma' },
  { value: '4', label: 'Póliza falsa' },
  { value: '6', label: 'Cobertura tarifa diferencial Decreto 2497/2022' },
  { value: '7', label: 'No Asegurado: propietario indeterminado o sin información' },
  { value: '8', label: 'Vehículo sin Placa' },
] as const
export const tipoVehiculoOptions = [
  { value: '01', label: 'Automóvil' },
  { value: '02', label: 'Bus' },
  { value: '03', label: 'Buseta' },
  { value: '04', label: 'Camión' },
  { value: '05', label: 'Camioneta' },
  { value: '06', label: 'Campero' },
  { value: '07', label: 'Microbús' },
  { value: '08', label: 'Tractocamión' },
  { value: '09', label: 'Transporte escolar' },
  { value: '10', label: 'Motocicleta' },
  { value: '14', label: 'Motocarro' },
  { value: '17', label: 'Moto triciclo' },
  { value: '19', label: 'Cuatrimoto' },
  { value: '20', label: 'Moto Extranjera' },
  { value: '21', label: 'Vehículo Extranjero' },
  { value: '22', label: 'Volqueta' },
  { value: '23', label: 'Transporte masivo' },
] as const
export const tipoDocumentoPropietarioOptions = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'CD', label: 'Carné diplomático' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'PE', label: 'Permiso especial de permanencia' },
  { value: 'DE', label: 'Documento extranjero' },
  { value: 'PT', label: 'Permiso de Protección Temporal' },
  { value: 'NI', label: 'NIT' },
] as const
export const tipoDocumentoConductorOptions = [
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'CD', label: 'Carné diplomático' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'PE', label: 'Permiso especial de permanencia' },
  { value: 'DE', label: 'Documento extranjero' },
  { value: 'PT', label: 'Permiso de protección temporal' },
  { value: 'SC', label: 'Salvoconducto' },
  { value: 'AS', label: 'Adulto sin identificación' },
  { value: 'MS', label: 'Menor sin identificación' },
] as const
export const municipioOptions = [
  { value: '23001', label: 'MONTERÍA' },
  { value: '23068', label: 'AYAPEL' },
  { value: '23079', label: 'BUENAVISTA' },
  { value: '23090', label: 'CANALETE' },
  { value: '23162', label: 'CERETÉ' },
  { value: '23168', label: 'CHIMÁ' },
  { value: '23182', label: 'CHINÚ' },
  { value: '23189', label: 'CIÉNAGA DE ORO' },
  { value: '23300', label: 'COTORRA' },
  { value: '23350', label: 'LA APARTADA' },
  { value: '23417', label: 'LORICA' },
  { value: '23419', label: 'LOS CÓRDOBAS' },
  { value: '23464', label: 'MOMIL' },
  { value: '23466', label: 'MONTELÍBANO' },
  { value: '23500', label: 'MOÑITOS' },
  { value: '23555', label: 'PLANETA RICA' },
  { value: '23570', label: 'PUEBLO NUEVO' },
  { value: '23574', label: 'PUERTO ESCONDIDO' },
  { value: '23580', label: 'PUERTO LIBERTADOR' },
  { value: '23586', label: 'PURÍSIMA DE LA CONCEPCIÓN' },
  { value: '23660', label: 'SAHAGÚN' },
  { value: '23670', label: 'SAN ANDRÉS DE SOTAVENTO' },
  { value: '23672', label: 'SAN ANTERO' },
  { value: '23675', label: 'SAN BERNARDO DEL VIENTO' },
  { value: '23678', label: 'SAN CARLOS' },
  { value: '23682', label: 'SAN JOSÉ DE URÉ' },
  { value: '23686', label: 'SAN PELAYO' },
  { value: '23807', label: 'TIERRALTA' },
  { value: '23815', label: 'TUCHÍN' },
  { value: '23855', label: 'VALENCIA' },
] as const

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
    'naturalezaEvento',
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
  7: [],
  8: [],
  9: [],
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
