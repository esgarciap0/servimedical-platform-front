import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import type { SvgIconComponent } from '@mui/icons-material'

export type ModuleItem = {
  name: string
  path: string
  description: string
  icon: SvgIconComponent
}

export const modules: ModuleItem[] = [
  {
    name: 'Facturacion',
    path: '/facturacion',
    description: 'Gestion de cuentas, pagos, soportes y procesos de cobro.',
    icon: ReceiptLongIcon,
  },
  {
    name: 'Prehospitalizacion',
    path: '/prehospitalizacion',
    description: 'Coordinacion de atencion inicial, traslados y admisiones previas.',
    icon: MedicalServicesIcon,
  },
  {
    name: 'Hospitalizacion',
    path: '/hospitalizacion',
    description: 'Seguimiento de pacientes, camas, ordenes y evolucion clinica.',
    icon: LocalHospitalIcon,
  },
  {
    name: 'Contabilidad',
    path: '/contabilidad',
    description: 'Control financiero, conciliaciones, terceros y reportes contables.',
    icon: AccountBalanceIcon,
  },
  {
    name: 'Calidad',
    path: '/calidad',
    description: 'Indicadores, auditorias, hallazgos y mejora continua institucional.',
    icon: AssignmentTurnedInIcon,
  },
  {
    name: 'Estadisticas',
    path: '/estadisticas',
    description: 'Analitica operacional para seguimiento de gestion y resultados.',
    icon: AnalyticsIcon,
  },
  {
    name: 'Administracion',
    path: '/administracion',
    description: 'Configuracion general, usuarios, permisos y parametros del sistema.',
    icon: AdminPanelSettingsIcon,
  },
]
