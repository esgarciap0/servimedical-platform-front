import { useEffect, useState } from 'react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Radio,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import Body, { type ExtendedBodyPart, type Slug } from 'react-muscle-highlighter'
import logo from '../assets/app-256.png'

type AphResponse = {
  id: number
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
  lesiones: string[]
  procedimientos: string[]
  materiales: string
  conductor: string
  documentoConductor: string
  paramedico: string
  documentoParamedico: string
  medico: string
  documentoMedico: string
  createdAt: string
  updatedAt: string
}

const API_BASE = 'http://localhost:8080/api/aph'

const columns = [
  'APH',
  'Fecha',
  'Ambulancia',
  'Aseguradora',
  'T.D.',
  'N° ID',
  'Paciente',
  'Origen',
  'Destino',
  'Paramedico',
  'Conductor',
  'Acciones',
]

const tabs = ['Paciente', 'Aseguradora', 'Causa externa', 'Examen fisico', 'Procedimiento', 'Materiales y drogas', 'Tripulacion']

type AphForm = {
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

const initialForm: AphForm = {
  codigo: '',
  movil: '',
  placa: '',
  traslado: 'PRIMARIO',
  tipoTraslado: 'BASICO',
  prioridad: '1',
  fechaAccidente: '',
  horaAccidente: '',
  lugarOcurrencia: '',
  zonaOrigen: '',
  departamentoOrigen: '',
  municipioOrigen: '',
  documento: '',
  primerApellido: '',
  segundoApellido: '',
  primerNombre: '',
  segundoNombre: '',
  estadoCivil: '',
  ocupacion: '',
  sexo: '',
  fechaNacimiento: '',
  edad: '',
  celular: '',
  telefono: '',
  acompanante: '',
  celularAcompanante: '',
  avisarA: '',
  parentesco: '',
  numeroParaAvisar: '',
  numeroParaAvisar2: '',
  direccion: '',
  zonaPaciente: '',
  departamento: '',
  ciudad: '',
  alergia: '',
  patologicos: '',
  medicacion: '',
  liquidos: '',
  aseguradora: '',
  poliza: '',
  planBeneficios: 'SOAT',
  horaLlegada: '',
  transportadoA: '',
  codigoHabilitacion: '',
  departamentoTraslado: '',
  ciudadTransporte: '',
  estadoPaciente: 'VIVO',
  causaExterna: '',
  presion: '',
  frecuenciaCardiaca: '',
  frecuenciaRespiratoria: '',
  temperatura: '',
  ro: '1',
  rv: '1',
  rm: '1',
  hallazgos: '',
  diagnosticos: '',
  materiales: '',
  conductor: '',
  documentoConductor: '',
  paramedico: '',
  documentoParamedico: '',
  medico: '',
  documentoMedico: '',
}

const causes = [
  'Enfermedad General',
  'Accidente comun',
  'Lesion por agresion',
  'Accidente de transito',
  'Lesion autoinfringida',
  'Accidente de trabajo',
  'Catastrofe',
  'Accidente rabico o fatidico',
  'Otro',
]

const trasladoOptions = ['PRIMARIO', 'SECUNDARIO']
const tipoTrasladoOptions = ['BASICO', 'MEDICALIZADO']
const prioridadOptions = ['1', '2', '3', '4']
const zonaOptions = ['U', 'R']
const sexoOptions = ['M', 'F']
const planBeneficiosOptions = ['SOAT', 'ARL', 'EPS', 'PARTICULAR']
const ambulanceOptions = ['001', '002', '003']

const bodyPartLabels: Record<Slug, string> = {
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

const procedures = [
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
]

const requiredFieldsByTab: Record<number, (keyof AphForm)[]> = {
  0: ['codigo', 'movil', 'placa', 'traslado', 'tipoTraslado', 'prioridad', 'fechaAccidente', 'horaAccidente', 'lugarOcurrencia', 'zonaOrigen', 'departamentoOrigen', 'municipioOrigen', 'documento', 'primerApellido', 'segundoApellido', 'primerNombre', 'segundoNombre', 'estadoCivil', 'ocupacion', 'sexo', 'fechaNacimiento', 'edad', 'celular', 'telefono', 'acompanante', 'celularAcompanante', 'avisarA', 'parentesco', 'direccion', 'zonaPaciente', 'departamento', 'ciudad', 'alergia', 'patologicos', 'medicacion', 'liquidos'],
  1: ['aseguradora', 'poliza', 'planBeneficios', 'horaLlegada', 'transportadoA', 'departamentoTraslado', 'ciudadTransporte', 'estadoPaciente'],
  2: ['causaExterna'],
  3: ['presion', 'frecuenciaCardiaca', 'frecuenciaRespiratoria', 'temperatura', 'ro', 'rv', 'rm', 'hallazgos', 'diagnosticos'],
  4: [],
  5: ['materiales'],
  6: ['conductor', 'documentoConductor', 'paramedico', 'documentoParamedico', 'medico', 'documentoMedico'],
}

export function Prehospitalizacion() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<AphForm>(initialForm)
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>([])
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([])
  const [rows, setRows] = useState<AphResponse[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})
  const [snackbar, setSnackbar] = useState<{ message: string; fields: string[]; severity: 'error' | 'success' } | null>(null)

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then(setRows)
      .catch(() => setRows([]))
  }, [])

  const updateField = (field: keyof AphForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
    }
  }

  const toggleInjury = (area: string) => {
    const newValues = selectedInjuries.includes(area) ? selectedInjuries.filter((v) => v !== area) : [...selectedInjuries, area]
    setSelectedInjuries(newValues)
    if (newValues.length > 0) setFieldErrors((prev) => { const n = { ...prev }; delete n['lesiones']; return n })
  }

  const toggleProcedure = (proc: string) => {
    const newValues = selectedProcedures.includes(proc) ? selectedProcedures.filter((v) => v !== proc) : [...selectedProcedures, proc]
    setSelectedProcedures(newValues)
    if (newValues.length > 0) setFieldErrors((prev) => { const n = { ...prev }; delete n['procedimientos']; return n })
  }

  const validateTab = (tabIndex: number): boolean => {
    const fields = requiredFieldsByTab[tabIndex]
    const errors: Record<string, boolean> = {}
    fields.forEach((field) => {
      if (!form[field] || form[field].trim() === '') errors[field] = true
    })
    if (tabIndex === 3 && selectedInjuries.length === 0) errors['lesiones'] = true
    if (tabIndex === 4 && selectedProcedures.length === 0) errors['procedimientos'] = true
    setFieldErrors((prev) => ({ ...prev, ...errors }))
    return Object.keys(errors).length === 0
  }

  const handleEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`)
      if (!res.ok) throw new Error('Error al obtener registro')
      const data: AphResponse = await res.json()
      const { lesiones, procedimientos, createdAt, updatedAt, ...formData } = data
      setForm({ ...initialForm, ...(formData as AphForm) })
      setSelectedInjuries(lesiones || [])
      setSelectedProcedures(procedimientos || [])
      setFieldErrors({})
      setEditId(id)
      setTab(0)
      setOpen(true)
    } catch {
      setSnackbar({ message: 'Error al cargar datos del registro', fields: [], severity: 'error' })
    }
  }

  const handleSave = async () => {
    const body = {
      ...form,
      lesiones: selectedInjuries,
      procedimientos: selectedProcedures,
      fechaAccidente: form.fechaAccidente || null,
      horaAccidente: form.horaAccidente || null,
      fechaNacimiento: form.fechaNacimiento || null,
      horaLlegada: form.horaLlegada || null,
    }
    const url = editId ? `${API_BASE}/${editId}` : API_BASE
    const method = editId ? 'PUT' : 'POST'
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!response.ok) {
        const text = await response.text()
        let errMsg = 'Error al guardar'
        let errFields: string[] = []
        try {
          const parsed = JSON.parse(text)
          if (parsed.message) errMsg = parsed.message
          if (parsed.fields) errFields = parsed.fields
        } catch { errMsg = text.slice(0, 200) }
        setSnackbar({ message: errMsg, fields: errFields, severity: 'error' })
        return
      }
      setOpen(false)
      setEditId(null)
      setFieldErrors({})
      setForm(initialForm)
      setSelectedInjuries([])
      setSelectedProcedures([])
      setTab(0)
      setSnackbar({ message: 'Registro guardado exitosamente', fields: [], severity: 'success' })
      const res = await fetch(API_BASE)
      setRows(await res.json())
    } catch (err) {
      setSnackbar({ message: 'Error de red: ' + (err instanceof Error ? err.message : 'desconocido'), fields: [], severity: 'error' })
    }
  }

  const handleDownloadPdf = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/pdf`)
      if (!res.ok) {
        const text = await res.text()
        let errMsg = 'Error al descargar PDF'
        let errFields: string[] = []
        try { const parsed = JSON.parse(text); if (parsed.message) errMsg = parsed.message; if (parsed.fields) errFields = parsed.fields } catch { errMsg = text.slice(0, 200) }
        setSnackbar({ message: errMsg, fields: errFields, severity: 'error' })
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `APH-${id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setSnackbar({ message: 'Error al descargar PDF', fields: [], severity: 'error' })
    }
  }

  const handleViewPdf = (id: number) => {
    window.open(`${API_BASE}/${id}/pdf`, '_blank', 'noopener,noreferrer')
  }

  return (
    <Stack spacing={3}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="primary" href="/">
          Inicio
        </Link>
        <Typography color="text.secondary">aph</Typography>
      </Breadcrumbs>

      <Card sx={{ overflow: 'hidden', borderRadius: 1.5 }}>
        <Box sx={{ bgcolor: '#0f766e', color: 'white', px: 2, py: 1.2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.3 }}>
            GESTION APH
          </Typography>
        </Box>

        <CardContent sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddBoxIcon />}
                onClick={() => { setFieldErrors({}); setOpen(true) }}
                size="small"
                sx={{ bgcolor: '#0f766e', '&:hover': { bgcolor: '#115e59' }, width: { xs: '100%', sm: 'auto' } }}
              >
                Nuevo APH
              </Button>
              <Button
                variant="contained"
                color="inherit"
                size="small"
                sx={{ bgcolor: '#334155', color: 'white', width: { xs: '100%', sm: 'auto' } }}
              >
                Exportar a Excel
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', alignItems: { xs: 'stretch', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Buscar</Typography>
              <TextField size="small" sx={{ width: { xs: '100%', sm: 220 } }} />
            </Box>

            <TableContainer sx={{ border: '1px solid #d9dee7', overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 1300 }}>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(#ffffff, #f4f6f8)' }}>
                    {columns.map((column) => (
                      <TableCell key={column} sx={{ fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap', py: 1 }}>
                        {column} <Box component="span" sx={{ color: '#aeb4bd' }}>↕</Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                        No hay registros disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.codigo || row.id}</TableCell>
                        <TableCell>{row.createdAt?.split('T')[0] || ''}</TableCell>
                        <TableCell>{row.movil || ''}</TableCell>
                        <TableCell>{row.aseguradora || ''}</TableCell>
                        <TableCell>{row.documento?.length === 10 ? 'CC' : row.documento?.length === 11 ? 'TI' : ''}</TableCell>
                        <TableCell>{row.documento || ''}</TableCell>
                        <TableCell sx={{ maxWidth: 210 }}>{`${row.primerNombre || ''} ${row.primerApellido || ''}`}</TableCell>
                        <TableCell sx={{ maxWidth: 260 }}>{row.lugarOcurrencia || ''}</TableCell>
                        <TableCell sx={{ maxWidth: 230 }}>{row.transportadoA || ''}</TableCell>
                        <TableCell>{row.paramedico || ''}</TableCell>
                        <TableCell>{row.conductor || ''}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.7} sx={{ alignItems: 'center' }}>
                            <IconButton size="small" onClick={() => handleViewPdf(row.id)} sx={{ bgcolor: '#0d6efd', color: 'white', borderRadius: 1 }}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleEdit(row.id)} sx={{ bgcolor: '#ffc107', color: 'white', borderRadius: 1 }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDownloadPdf(row.id)} sx={{ color: '#dc3545', borderRadius: 1 }}>
                              <PictureAsPdfIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => { setOpen(false); setEditId(null); setFieldErrors({}) }} fullScreen>
        <DialogTitle sx={{ bgcolor: '#0f766e', color: 'white', py: 1, pr: 7 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 15, sm: 18, md: 20 } }}>
            {editId ? `Editar APH #${editId}` : 'Registrar formato APH'}
          </Typography>
          <IconButton
            aria-label="Cerrar"
            onClick={() => { setOpen(false); setEditId(null); setFieldErrors({}) }}
            sx={{ position: 'absolute', right: { xs: 8, md: 16 }, top: { xs: 6, md: 10 }, color: 'white' }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) 320px' }, minHeight: 'calc(100vh - 56px)' }}>
            <Box sx={{ p: 1, overflow: 'auto' }}>
              <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  bgcolor: 'white',
                  borderBottom: '1px solid #dbe3ee',
                  mb: 1,
                  minHeight: 36,
                  '& .MuiTab-root': { minHeight: 36, py: 0.25, px: 1, fontSize: 12, textTransform: 'none', fontWeight: 800 },
                }}
              >
                {tabs.map((item) => (
                  <Tab key={item} label={item} sx={{ fontSize: 12, textTransform: 'none' }} />
                ))}
              </Tabs>

              <Paper sx={{ p: { xs: 1, md: 1.25 }, borderRadius: 2, border: '1px solid #dbe3ee' }} elevation={1}>
                {tab === 0 && <PatientTab form={form} updateField={updateField} fieldErrors={fieldErrors} />}
                {tab === 1 && <InsuranceTab form={form} updateField={updateField} fieldErrors={fieldErrors} />}
                {tab === 2 && <CauseTab form={form} updateField={updateField} fieldErrors={fieldErrors} />}
                {tab === 3 && (
                  <PhysicalExamTab
                    form={form}
                    updateField={updateField}
                    fieldErrors={fieldErrors}
                    selectedInjuries={selectedInjuries}
                    onToggleInjury={toggleInjury}
                  />
                )}
                {tab === 4 && (
                  <ProcedureTab
                    selectedProcedures={selectedProcedures}
                    onToggleProcedure={toggleProcedure}
                    fieldErrors={fieldErrors}
                  />
                )}
                {tab === 5 && <MaterialsTab form={form} updateField={updateField} fieldErrors={fieldErrors} />}
                {tab === 6 && <CrewTab form={form} updateField={updateField} fieldErrors={fieldErrors} />}
              </Paper>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'space-between', gap: 0.75, mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
                  {tab > 0 && (
                    <Button size="small" variant="outlined" onClick={() => setTab(tab - 1)} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                      ← Anterior
                    </Button>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
                  <Button size="small" variant="outlined" color="inherit" onClick={() => { setOpen(false); setEditId(null); setFieldErrors({}) }} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                    Cancelar
                  </Button>
                  {tab < tabs.length - 1 ? (
                    <Button size="small" variant="contained" onClick={() => { if (validateTab(tab)) setTab(tab + 1) }} sx={{ bgcolor: '#075db8', '&:hover': { bgcolor: '#064a94' }, width: { xs: '100%', sm: 'auto' } }}>
                      Siguiente →
                    </Button>
                  ) : (
                    <Button size="small" variant="contained" onClick={() => { if (validateTab(tab)) handleSave() }} sx={{ bgcolor: '#1f9d49', '&:hover': { bgcolor: '#18823c' }, width: { xs: '100%', sm: 'auto' } }}>
                      Guardar
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            <PdfPreview form={form} injuries={selectedInjuries} procedures={selectedProcedures} />
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar open={!!snackbar} autoHideDuration={6000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar(null)} severity={snackbar?.severity || 'error'} sx={{ width: '100%', whiteSpace: 'pre-line' }}>
          {snackbar?.message}
          {snackbar?.fields && snackbar.fields.length > 0 && (
            <Box component="ul" sx={{ mt: 0.5, mb: 0, pl: 2 }}>
              {snackbar.fields.map((f, i) => <li key={i}>{f}</li>)}
            </Box>
          )}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

function PatientTab({ form, updateField, fieldErrors }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean> }) {
  return (
    <Stack spacing={1}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Codigo APH" value={form.codigo} onChange={(value) => updateField('codigo', value)} error={!!fieldErrors['codigo']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Movil" select value={form.movil} onChange={(value) => updateField('movil', value)} options={ambulanceOptions} error={!!fieldErrors['movil']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Placa" value={form.placa} onChange={(value) => updateField('placa', value)} error={!!fieldErrors['placa']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Traslado" select value={form.traslado} onChange={(value) => updateField('traslado', value)} options={trasladoOptions} error={!!fieldErrors['traslado']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Tipo traslado" select value={form.tipoTraslado} onChange={(value) => updateField('tipoTraslado', value)} options={tipoTrasladoOptions} error={!!fieldErrors['tipoTraslado']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Prioridad" select value={form.prioridad} onChange={(value) => updateField('prioridad', value)} options={prioridadOptions} error={!!fieldErrors['prioridad']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Fecha Accidente" type="date" value={form.fechaAccidente} onChange={(value) => updateField('fechaAccidente', value)} error={!!fieldErrors['fechaAccidente']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Hora Accidente" type="time" value={form.horaAccidente} onChange={(value) => updateField('horaAccidente', value)} error={!!fieldErrors['horaAccidente']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Lugar de Ocurrencia" value={form.lugarOcurrencia} onChange={(value) => updateField('lugarOcurrencia', value)} error={!!fieldErrors['lugarOcurrencia']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Zona Origen" select value={form.zonaOrigen} onChange={(value) => updateField('zonaOrigen', value)} options={zonaOptions} error={!!fieldErrors['zonaOrigen']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Dep.Origen" value={form.departamentoOrigen} onChange={(value) => updateField('departamentoOrigen', value)} error={!!fieldErrors['departamentoOrigen']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Municipio Origen" value={form.municipioOrigen} onChange={(value) => updateField('municipioOrigen', value)} error={!!fieldErrors['municipioOrigen']} /></Grid>
      </Grid>

      <SectionTitle compact>Datos del paciente o victima</SectionTitle>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Numero de documento" value={form.documento} onChange={(value) => updateField('documento', value)} error={!!fieldErrors['documento']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Primer Apellido" value={form.primerApellido} onChange={(value) => updateField('primerApellido', value)} error={!!fieldErrors['primerApellido']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Segundo Apellido" value={form.segundoApellido} onChange={(value) => updateField('segundoApellido', value)} error={!!fieldErrors['segundoApellido']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Primer Nombre" value={form.primerNombre} onChange={(value) => updateField('primerNombre', value)} error={!!fieldErrors['primerNombre']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Segundo Nombre" value={form.segundoNombre} onChange={(value) => updateField('segundoNombre', value)} error={!!fieldErrors['segundoNombre']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Estado Civil" value={form.estadoCivil} onChange={(value) => updateField('estadoCivil', value)} error={!!fieldErrors['estadoCivil']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Ocupacion" value={form.ocupacion} onChange={(value) => updateField('ocupacion', value)} error={!!fieldErrors['ocupacion']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Sexo" select value={form.sexo} onChange={(value) => updateField('sexo', value)} options={sexoOptions} error={!!fieldErrors['sexo']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Fecha de Nacimiento" type="date" value={form.fechaNacimiento} onChange={(value) => updateField('fechaNacimiento', value)} error={!!fieldErrors['fechaNacimiento']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Edad" value={form.edad} onChange={(value) => updateField('edad', value)} error={!!fieldErrors['edad']} /></Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionTitle compact>Datos de contacto</SectionTitle>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 6 }}><FormInput compact requiredHint label="Celular Paciente" value={form.celular} onChange={(value) => updateField('celular', value)} error={!!fieldErrors['celular']} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><FormInput compact label="Telefono Paciente" value={form.telefono} onChange={(value) => updateField('telefono', value)} error={!!fieldErrors['telefono']} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><FormInput compact label="Avisar a" value={form.avisarA} onChange={(value) => updateField('avisarA', value)} error={!!fieldErrors['avisarA']} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><FormInput compact label="Parentesco" value={form.parentesco} onChange={(value) => updateField('parentesco', value)} error={!!fieldErrors['parentesco']} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><FormInput compact label="Numero Para Avisar" value={form.numeroParaAvisar} onChange={(value) => updateField('numeroParaAvisar', value)} error={!!fieldErrors['numeroParaAvisar']} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><FormInput compact label="Numero Para Avisar 2" value={form.numeroParaAvisar2} onChange={(value) => updateField('numeroParaAvisar2', value)} error={!!fieldErrors['numeroParaAvisar2']} /></Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionTitle compact>Datos acompanante</SectionTitle>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 8 }}><FormInput compact label="Nombre Acompanante" value={form.acompanante} onChange={(value) => updateField('acompanante', value)} error={!!fieldErrors['acompanante']} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Celular Acompanante" value={form.celularAcompanante} onChange={(value) => updateField('celularAcompanante', value)} error={!!fieldErrors['celularAcompanante']} /></Grid>
          </Grid>
        </Grid>
      </Grid>

      <SectionTitle compact>Ubicacion</SectionTitle>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}><FormInput compact requiredHint label="Direccion de Residencia" value={form.direccion} onChange={(value) => updateField('direccion', value)} error={!!fieldErrors['direccion']} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Zona Paciente" select value={form.zonaPaciente} onChange={(value) => updateField('zonaPaciente', value)} options={zonaOptions} error={!!fieldErrors['zonaPaciente']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Departamento" value={form.departamento} onChange={(value) => updateField('departamento', value)} error={!!fieldErrors['departamento']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Ciudad" value={form.ciudad} onChange={(value) => updateField('ciudad', value)} error={!!fieldErrors['ciudad']} /></Grid>
      </Grid>

      <SectionTitle compact>Antecedentes personales</SectionTitle>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Alergia" value={form.alergia} onChange={(value) => updateField('alergia', value)} error={!!fieldErrors['alergia']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Patologicos" value={form.patologicos} onChange={(value) => updateField('patologicos', value)} error={!!fieldErrors['patologicos']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Medicacion" value={form.medicacion} onChange={(value) => updateField('medicacion', value)} error={!!fieldErrors['medicacion']} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Liquidos y alimentos" value={form.liquidos} onChange={(value) => updateField('liquidos', value)} error={!!fieldErrors['liquidos']} /></Grid>
      </Grid>
    </Stack>
  )
}

function InsuranceTab({ form, updateField, fieldErrors }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean> }) {
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, md: 6 }}>
        <SectionTitle compact>Datos aseguradora</SectionTitle>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 8 }}><FormInput compact label="Aseguradora" value={form.aseguradora} onChange={(value) => updateField('aseguradora', value)} error={!!fieldErrors['aseguradora']} /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Numero Poliza" value={form.poliza} onChange={(value) => updateField('poliza', value)} error={!!fieldErrors['poliza']} /></Grid>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontWeight: 800, mb: 1, fontSize: 13, color: fieldErrors['planBeneficios'] ? '#d32f2f' : '#1f2937' }}>Plan de Beneficios *</Typography>
            {planBeneficiosOptions.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Radio
                    checked={form.planBeneficios === item}
                    onChange={() => updateField('planBeneficios', item)}
                  />
                }
                label={<Typography sx={{ fontSize: 13 }}>{item}</Typography>}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SectionTitle compact>Datos de traslado</SectionTitle>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Hora de llegada" type="time" value={form.horaLlegada} onChange={(value) => updateField('horaLlegada', value)} error={!!fieldErrors['horaLlegada']} /></Grid>
          <Grid size={{ xs: 12, md: 8 }}><FormInput compact label="Transportado a" value={form.transportadoA} onChange={(value) => updateField('transportadoA', value)} error={!!fieldErrors['transportadoA']} /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Cod. Habilitacion" value={form.codigoHabilitacion} onChange={(value) => updateField('codigoHabilitacion', value)} error={!!fieldErrors['codigoHabilitacion']} /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Departamento traslado" value={form.departamentoTraslado} onChange={(value) => updateField('departamentoTraslado', value)} error={!!fieldErrors['departamentoTraslado']} /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Ciudad de transporte" value={form.ciudadTransporte} onChange={(value) => updateField('ciudadTransporte', value)} error={!!fieldErrors['ciudadTransporte']} /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Estado Paciente" select value={form.estadoPaciente} onChange={(value) => updateField('estadoPaciente', value)} options={['VIVO', 'MUERTO']} error={!!fieldErrors['estadoPaciente']} /></Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

function CauseTab({ form, updateField, fieldErrors }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean> }) {
  return (
    <Stack spacing={1}>
      <SectionTitle compact sx={{ color: fieldErrors['causaExterna'] ? '#d32f2f' : undefined }}>Motivo del llamado de emergencia *</SectionTitle>
      <Grid container spacing={0.25}>
        {causes.map((cause) => (
          <Grid key={cause} size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControlLabel
              control={<Radio checked={form.causaExterna === cause} onChange={() => updateField('causaExterna', cause)} />}
              label={<Typography sx={{ fontWeight: 700, fontSize: 13 }}>{cause}</Typography>}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

function PhysicalExamTab({ form, updateField, fieldErrors, selectedInjuries, onToggleInjury }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean>; selectedInjuries: string[]; onToggleInjury: (area: string) => void }) {
  return (
    <Stack spacing={1}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 7 }}>
          <SectionTitle compact>Examen fisico</SectionTitle>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Presion Arterial" value={form.presion} onChange={(value) => updateField('presion', value)} error={!!fieldErrors['presion']} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Frec. Cardiaca" value={form.frecuenciaCardiaca} onChange={(value) => updateField('frecuenciaCardiaca', value)} error={!!fieldErrors['frecuenciaCardiaca']} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Frec. Respiratoria" value={form.frecuenciaRespiratoria} onChange={(value) => updateField('frecuenciaRespiratoria', value)} error={!!fieldErrors['frecuenciaRespiratoria']} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Temp. Corporal" value={form.temperatura} onChange={(value) => updateField('temperatura', value)} error={!!fieldErrors['temperatura']} /></Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <SectionTitle compact>Escala Glasgow</SectionTitle>
          <Grid container spacing={1}>
            <Grid size={{ xs: 4 }}><FormInput compact label="R.O" select value={form.ro} onChange={(value) => updateField('ro', value)} options={['1', '2', '3', '4']} error={!!fieldErrors['ro']} /></Grid>
            <Grid size={{ xs: 4 }}><FormInput compact label="R.V." select value={form.rv} onChange={(value) => updateField('rv', value)} options={['1', '2', '3', '4', '5']} error={!!fieldErrors['rv']} /></Grid>
            <Grid size={{ xs: 4 }}><FormInput compact label="R.M" select value={form.rm} onChange={(value) => updateField('rm', value)} options={['1', '2', '3', '4', '5', '6']} error={!!fieldErrors['rm']} /></Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ overflow: 'hidden', borderColor: fieldErrors['lesiones'] ? '#d32f2f' : '#dbe3ee', bgcolor: '#f8fafc' }}>
            <Box sx={{ px: 1.25, py: 0.75, borderBottom: '1px solid #dbe3ee' }}>
              <SectionTitle compact sx={{ color: fieldErrors['lesiones'] ? '#d32f2f' : undefined }}>Ubique las lesiones *</SectionTitle>
              <Typography sx={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>
                Toque una zona para marcarla. Puede seleccionar varias lesiones.
              </Typography>
            </Box>
            <AnatomicalBodySelector selected={selectedInjuries} onToggle={onToggleInjury} />
            {selectedInjuries.length > 0 && (
              <Box sx={{ px: 1.25, pb: 1.25, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {selectedInjuries.map((area) => (
                  <Box
                    key={area}
                    sx={{
                      px: 1,
                      py: 0.4,
                      borderRadius: 999,
                      bgcolor: '#dc2626',
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {formatInjuryLabel(area)}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={1}>
            <FormInput compact label="Describa los hallazgos" multiline rows={4} value={form.hallazgos} onChange={(value) => updateField('hallazgos', value)} error={!!fieldErrors['hallazgos']} />
            <FormInput compact label="Diagnosticos CIE 10" value={form.diagnosticos} onChange={(value) => updateField('diagnosticos', value)} error={!!fieldErrors['diagnosticos']} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}

function ProcedureTab({ selectedProcedures, onToggleProcedure, fieldErrors }: { selectedProcedures: string[]; onToggleProcedure: (procedure: string) => void; fieldErrors: Record<string, boolean> }) {
  return (
    <Stack spacing={1}>
      <SectionTitle compact sx={{ color: fieldErrors['procedimientos'] ? '#d32f2f' : undefined }}>Procedimientos realizados *</SectionTitle>
      <Grid container spacing={0.25}>
        {procedures.map((procedure) => (
          <Grid key={procedure} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={selectedProcedures.includes(procedure)} onChange={() => onToggleProcedure(procedure)} />}
              label={<Typography sx={{ fontWeight: 700, fontSize: 13 }}>{procedure}</Typography>}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

function MaterialsTab({ form, updateField, fieldErrors }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean> }) {
  return (
    <Stack spacing={1}>
      <SectionTitle compact>Materiales utilizados</SectionTitle>
      <FormInput compact label="Materiales y drogas" value={form.materiales} onChange={(value) => updateField('materiales', value)} error={!!fieldErrors['materiales']} />
    </Stack>
  )
}

function CrewTab({ form, updateField, fieldErrors }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean> }) {
  return (
    <Stack spacing={1}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionTitle compact>Datos de tripulacion</SectionTitle>
          <Stack spacing={1}>
            <FormInput compact label="Conductor" value={form.conductor} onChange={(value) => updateField('conductor', value)} error={!!fieldErrors['conductor']} />
            <FormInput compact label="Doc. conductor" value={form.documentoConductor} onChange={(value) => updateField('documentoConductor', value)} error={!!fieldErrors['documentoConductor']} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionTitle compact>&nbsp;</SectionTitle>
          <Stack spacing={1}>
            <FormInput compact label="Paramedico" value={form.paramedico} onChange={(value) => updateField('paramedico', value)} error={!!fieldErrors['paramedico']} />
            <FormInput compact label="Doc. paramedico" value={form.documentoParamedico} onChange={(value) => updateField('documentoParamedico', value)} error={!!fieldErrors['documentoParamedico']} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionTitle compact>Datos I.P.S. o prestador</SectionTitle>
          <Stack spacing={1}>
            <FormInput compact label="Medico y/o responsable I.P.S." value={form.medico} onChange={(value) => updateField('medico', value)} error={!!fieldErrors['medico']} />
            <FormInput compact label="Doc. ID" value={form.documentoMedico} onChange={(value) => updateField('documentoMedico', value)} error={!!fieldErrors['documentoMedico']} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}

function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  select = false,
  options = [],
  multiline = false,
  rows,
  error,
  compact = false,
  requiredHint = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  select?: boolean
  options?: string[]
  multiline?: boolean
  rows?: number
  error?: boolean
  compact?: boolean
  requiredHint?: boolean
}) {
  const showHint = requiredHint && value.trim() === ''
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type={type}
      select={select}
      multiline={multiline}
      rows={rows}
      error={error}
      size={compact ? 'small' : 'small'}
      helperText={showHint ? 'Campo obligatorio' : undefined}
      slotProps={type === 'date' || type === 'time' ? { inputLabel: { shrink: true } } : undefined}
      sx={{
        '& .MuiInputLabel-root': { fontWeight: 700, fontSize: 12, color: error ? '#d32f2f' : '#1f2937' },
        '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc', borderRadius: 1 },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: error ? '#d32f2f' : '#075db8' },
        '& .MuiInputBase-input': { py: compact ? 0.6 : 0.85, fontSize: 12.5 },
        '& .MuiInputBase-root': { minHeight: compact ? 34 : 38 },
        '& .MuiFormHelperText-root': { mt: 0.4, ml: 0.5, fontSize: 11, fontWeight: 700 },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>{option}</MenuItem>
      ))}
    </TextField>
  )
}

function SectionTitle({ children, sx, compact = false }: { children: React.ReactNode; sx?: Record<string, unknown>; compact?: boolean }) {
  return (
    <Typography
      variant="h6"
      sx={{
        color: '#0073f0',
        fontWeight: 800,
        textTransform: 'uppercase',
        fontSize: compact ? 12.5 : 14,
        lineHeight: 1.1,
        mb: compact ? 0.5 : 1,
        ...sx,
      }}
    >
      {children}
    </Typography>
  )
}

function makeInjuryKey(view: 'front' | 'back', slug: Slug, side?: 'left' | 'right') {
  return `${view}:${slug}:${side || 'both'}`
}

function parseInjuryKey(value: string): { view: 'front' | 'back'; slug: Slug; side?: 'left' | 'right' } | null {
  const [view, slug, side] = value.split(':')
  if ((view !== 'front' && view !== 'back') || !slug) return null
  return {
    view,
    slug: slug as Slug,
    side: side === 'left' || side === 'right' ? side : undefined,
  }
}

function formatInjuryLabel(value: string) {
  const parsed = parseInjuryKey(value)
  if (!parsed) return value

  const sideLabel = parsed.side === 'left' ? 'izquierda' : parsed.side === 'right' ? 'derecha' : ''
  const viewLabel = parsed.view === 'back' ? 'posterior' : 'anterior'
  return [bodyPartLabels[parsed.slug] || parsed.slug, sideLabel, viewLabel].filter(Boolean).join(' ')
}

function AnatomicalBodySelector({ selected, onToggle }: { selected: string[]; onToggle: (area: string) => void }) {
  const selectedParts = (view: 'front' | 'back'): ExtendedBodyPart[] =>
    selected
      .map(parseInjuryKey)
      .filter((item): item is NonNullable<ReturnType<typeof parseInjuryKey>> => !!item && item.view === view)
      .map(({ slug, side }) => ({
        slug,
        side,
        color: '#ff1f1f',
        styles: { fill: '#ff1f1f', stroke: '#ffffff', strokeWidth: 1.5 },
      }))

  const handlePress = (view: 'front' | 'back') => (part: ExtendedBodyPart, side?: 'left' | 'right') => {
    if (!part.slug) return
    onToggle(makeInjuryKey(view, part.slug, side))
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr' },
        alignItems: 'center',
        justifyItems: 'center',
        gap: { xs: 0.5, sm: 1 },
        px: { xs: 0.5, sm: 1 },
        py: 1,
        bgcolor: 'white',
      }}
    >
      {(['front', 'back'] as const).map((view) => (
        <Box
          key={view}
          sx={{
            width: '100%',
            maxWidth: 175,
            display: 'flex',
            justifyContent: 'center',
            '& svg': { width: '100%', height: 'auto' },
            '& path': { transition: 'fill 140ms ease' },
          }}
        >
          <Body
            data={selectedParts(view)}
            side={view}
            gender="male"
            scale={0.82}
            defaultFill="#050505"
            defaultStroke="#ffffff"
            defaultStrokeWidth={1.3}
            border="none"
            colors={['#ff1f1f']}
            onBodyPartPress={handlePress(view)}
          />
        </Box>
      ))}
    </Box>
  )
}

export function BodySelector({ selected, onToggle }: { selected: string[]; onToggle: (area: string) => void }) {
  const isSelected = (area: string) => selected.includes(area)
  const fill = (area: string) => isSelected(area) ? '#ff1f1f' : '#050505'
  const stroke = (area: string) => isSelected(area) ? '#b91c1c' : '#ffffff'

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', px: 1, py: 1.5 }}>
      <svg width="100%" height="auto" viewBox="0 0 480 520" role="img" aria-label="Selector de lesiones" style={{ maxWidth: 420 }}>
        <style>{'text{display:none}'}</style>
        <rect width="410" height="500" fill="#f8fafc" rx="12" />

        <text x="120" y="24" textAnchor="middle" fontSize="12" fontWeight="800" fill="#334155">Anterior</text>
        <text x="320" y="24" textAnchor="middle" fontSize="12" fontWeight="800" fill="#334155">Posterior</text>

        <g transform="translate(42 46)">
          <g transform="translate(75 0)">
            <path d="M-20 18 C-20 8,-11 0,0 0 C11 0,20 8,20 18 C20 38,11 48,0 48 C-11 48,-20 38,-20 18Z"
              fill={fill('Cabeza')} stroke={stroke('Cabeza')} strokeWidth="2" onClick={() => onToggle('Cabeza')} style={{ cursor: 'pointer' }} />
          </g>
          <path d="M35 54 L75 54 L82 160 L68 230 L42 230 L28 160Z"
            fill={fill('Torax')} stroke={stroke('Torax')} strokeWidth="2.2" onClick={() => onToggle('Torax')} style={{ cursor: 'pointer' }} />
          <path d="M34 160 L76 160 L80 228 C80 246,70 258,55 262 C40 258,30 246,30 228Z"
            fill={fill('Abdomen')} stroke={stroke('Abdomen')} strokeWidth="2.2" onClick={() => onToggle('Abdomen')} style={{ cursor: 'pointer' }} />
          <path d="M18 60 L36 84 L34 154 L16 164 L5 140 L8 100Z"
            fill={fill('Brazo izquierdo')} stroke={stroke('Brazo izquierdo')} strokeWidth="2.2" onClick={() => onToggle('Brazo izquierdo')} style={{ cursor: 'pointer' }} />
          <path d="M74 60 L92 100 L95 140 L84 164 L66 154 L64 84Z"
            fill={fill('Brazo derecho')} stroke={stroke('Brazo derecho')} strokeWidth="2.2" onClick={() => onToggle('Brazo derecho')} style={{ cursor: 'pointer' }} />
          <path d="M39 262 L50 262 L48 360 L42 405 C41 414,34 418,28 418 C22 418,18 412,19 404 L25 324 L18 286 C16 274,23 264,39 262Z"
            fill={fill('Pierna izquierda')} stroke={stroke('Pierna izquierda')} strokeWidth="2.2" onClick={() => onToggle('Pierna izquierda')} style={{ cursor: 'pointer' }} />
          <path d="M60 262 L71 264 C87 266,94 276,92 288 L85 324 L91 404 C92 412,88 418,82 418 C76 418,69 414,68 405 L62 360Z"
            fill={fill('Pierna derecha')} stroke={stroke('Pierna derecha')} strokeWidth="2.2" onClick={() => onToggle('Pierna derecha')} style={{ cursor: 'pointer' }} />
          <text x="55" y="130" textAnchor="middle" fontSize="9" fontWeight="700" fill={isSelected('Torax') ? '#fff' : '#cbd5e1'} pointerEvents="none">Tórax</text>
          <g pointerEvents="none" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
            <path d="M45 104 L55 178 L66 208 L78 178 L88 104" />
            <path d="M35 122 L66 112 L97 122" />
            <path d="M40 144 L66 134 L92 144" />
            <path d="M38 169 L66 158 L94 169" />
            <path d="M44 194 L66 185 L87 194" />
            <path d="M40 222 L66 244 L91 222" />
            <path d="M36 284 L66 316 L94 284" />
            <path d="M50 274 L43 382 M81 274 L90 382" />
            <path d="M28 421 L52 421 M78 421 L102 421" />
          </g>
        </g>

        <g transform="translate(252 46)">
          <path d="M55 0 C67 0,76 8,76 18 C76 38,67 48,55 48 C43 48,34 38,34 18 C34 8,43 0,55 0Z"
            fill={fill('Cabeza posterior')} stroke={stroke('Cabeza posterior')} strokeWidth="2" onClick={() => onToggle('Cabeza posterior')} style={{ cursor: 'pointer' }} />
          <path d="M35 54 L75 54 L82 154 L67 166 L56 160 L43 166 L28 154Z"
            fill={fill('Espalda')} stroke={stroke('Espalda')} strokeWidth="2.2" onClick={() => onToggle('Espalda')} style={{ cursor: 'pointer' }} />
          <path d="M35 154 L75 154 L80 213 L56 223 L30 213Z"
            fill={fill('Zona lumbar')} stroke={stroke('Zona lumbar')} strokeWidth="2.2" onClick={() => onToggle('Zona lumbar')} style={{ cursor: 'pointer' }} />
          <path d="M18 60 L35 90 L32 158 L15 166 L5 142 L9 100Z"
            fill={fill('Brazo izquierdo posterior')} stroke={stroke('Brazo izquierdo posterior')} strokeWidth="2.2" onClick={() => onToggle('Brazo izquierdo posterior')} style={{ cursor: 'pointer' }} />
          <path d="M76 60 L94 100 L98 142 L88 166 L71 158 L68 90Z"
            fill={fill('Brazo derecho posterior')} stroke={stroke('Brazo derecho posterior')} strokeWidth="2.2" onClick={() => onToggle('Brazo derecho posterior')} style={{ cursor: 'pointer' }} />
          <path d="M42 223 L52 223 L52 328 L48 405 C47 414,40 418,34 418 C28 418,23 412,24 404 L29 330 L21 289 C19 277,25 226,42 223Z"
            fill={fill('Pierna izquierda posterior')} stroke={stroke('Pierna izquierda posterior')} strokeWidth="2.2" onClick={() => onToggle('Pierna izquierda posterior')} style={{ cursor: 'pointer' }} />
          <path d="M58 223 L68 226 C85 228,91 277,89 289 L81 330 L86 404 C87 412,83 418,77 418 C71 418,64 414,63 405 L59 328Z"
            fill={fill('Pierna derecha posterior')} stroke={stroke('Pierna derecha posterior')} strokeWidth="2.2" onClick={() => onToggle('Pierna derecha posterior')} style={{ cursor: 'pointer' }} />
          <text x="55" y="130" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={isSelected('Cabeza posterior') ? '#fff' : '#cbd5e1'} pointerEvents="none">Cabeza</text>
          <text x="55" y="126" textAnchor="middle" fontSize="9" fontWeight="700" fill={isSelected('Espalda') ? '#fff' : '#cbd5e1'} pointerEvents="none">Espalda</text>
          <text x="55" y="193" textAnchor="middle" fontSize="9" fontWeight="700" fill={isSelected('Zona lumbar') ? '#fff' : '#cbd5e1'} pointerEvents="none">Lumbar</text>
          <text x="20" y="128" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={isSelected('Brazo izquierdo posterior') ? '#fff' : '#cbd5e1'} pointerEvents="none">Brazo Izq</text>
          <text x="89" y="128" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={isSelected('Brazo derecho posterior') ? '#fff' : '#cbd5e1'} pointerEvents="none">Brazo Der</text>
          <text x="33" y="339" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={isSelected('Pierna izquierda posterior') ? '#fff' : '#cbd5e1'} pointerEvents="none">Pierna Izq</text>
          <text x="77" y="339" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={isSelected('Pierna derecha posterior') ? '#fff' : '#cbd5e1'} pointerEvents="none">Pierna Der</text>
          <g pointerEvents="none" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
            <path d="M52 96 L72 111 L94 96" />
            <path d="M42 124 L72 111 L104 125" />
            <path d="M37 161 L72 184 L110 161" />
            <path d="M42 203 L73 224 L105 203" />
            <path d="M49 272 L73 289 L98 272" />
            <path d="M38 309 L73 330 L108 309" />
            <path d="M56 350 L60 410 M90 350 L86 410" />
            <path d="M48 426 L69 426 M77 426 L98 426" />
          </g>
        </g>
      </svg>
    </Box>
  )
}

function PdfPreview({ form, injuries, procedures }: { form: AphForm; injuries: string[]; procedures: string[] }) {
  const fullName = [form.primerNombre, form.segundoNombre, form.primerApellido, form.segundoApellido].filter(Boolean).join(' ')

  return (
    <Box sx={{ display: { xs: 'none', xl: 'block' }, bgcolor: '#e5e7eb', borderLeft: '1px solid #cbd5e1', p: 1, overflow: 'auto' }}>
      <Typography sx={{ mb: 0.5, fontWeight: 800, fontSize: 12, color: '#075db8' }}>Previsualizacion PDF</Typography>
      <Paper sx={{ width: 320, minHeight: 500, mx: 'auto', p: 1.25, bgcolor: 'white', color: '#111827', fontFamily: 'Arial, sans-serif' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box component="img" src={logo} alt="Servimedical" sx={{ width: 58, height: 'auto', flex: '0 0 auto' }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, lineHeight: 1.05 }}>ATENCION PRE-HOSPITALARIA</Typography>
            <Typography sx={{ fontSize: 8.5, lineHeight: 1.05 }}>FAPH v1 - 01/03/2025</Typography>
          </Box>
          <Box sx={{ textAlign: 'right', flex: '0 0 auto' }}>
            <Typography sx={{ fontSize: 8.5, lineHeight: 1.05 }}>Placa</Typography>
            <Typography sx={{ fontSize: 8.5, fontWeight: 700, lineHeight: 1.05 }}>{form.placa || '-'}</Typography>
          </Box>
        </Box>
        <PreviewBar>DATOS DEL PACIENTE</PreviewBar>
        <PreviewTable rows={[
          ['Tipo ID', 'CC', 'Identificacion', form.documento],
          ['Nombres y Apellidos', fullName, 'Sexo', form.sexo],
          ['Codigo CUPS', form.codigo, 'Prioridad', form.prioridad],
          ['Traslado', form.traslado, 'Tipo', form.tipoTraslado],
        ]} />
        <PreviewBar>CAUSA EXTERNA</PreviewBar>
        <Typography sx={{ fontSize: 9, minHeight: 18 }}>{form.causaExterna || 'Sin seleccionar'}</Typography>
        <PreviewBar>ANTECEDENTES PERSONALES</PreviewBar>
        <PreviewTable rows={[
          ['Alergias', form.alergia, 'Liquidos', form.liquidos],
          ['Medicacion', form.medicacion, 'Patologicos', form.patologicos],
        ]} />
        <PreviewBar>EXAMEN FISICO / GLASGOW</PreviewBar>
        <PreviewTable rows={[
          ['PA', form.presion, 'FC', form.frecuenciaCardiaca],
          ['FR', form.frecuenciaRespiratoria, 'Temp', form.temperatura],
          ['RO', form.ro, 'RV', form.rv],
          ['RM', form.rm, 'Hallazgos', form.hallazgos.slice(0, 40)],
        ]} />
        <PreviewBar>UBICACION DE LAS LESIONES</PreviewBar>
        <Typography sx={{ fontSize: 9, minHeight: 18 }}>{injuries.join(', ') || 'Sin lesiones seleccionadas'}</Typography>
        <PreviewBar>DIAGNOSTICOS / HALLAZGOS</PreviewBar>
        <Box sx={{ border: '1px solid #d1d5db', p: 0.8 }}>
          <Typography sx={{ fontSize: 8.5, fontWeight: 700, lineHeight: 1.1 }}>Diagnosticos CIE10</Typography>
          <Typography sx={{ fontSize: 8.5, lineHeight: 1.15 }}>{form.diagnosticos}</Typography>
        </Box>
        <Box sx={{ border: '1px solid #d1d5db', p: 0.8, mt: 0.6 }}>
          <Typography sx={{ fontSize: 8.5, fontWeight: 700, lineHeight: 1.1 }}>Hallazgos</Typography>
          <Typography sx={{ fontSize: 8.5, lineHeight: 1.15 }}>{form.hallazgos}</Typography>
        </Box>
        <PreviewBar>PROCEDIMIENTOS REALIZADOS</PreviewBar>
        <Typography sx={{ fontSize: 9 }}>{procedures.join(', ')}</Typography>
        <PreviewBar>MATERIALES Y DROGAS UTILIZADAS</PreviewBar>
        <Typography sx={{ fontSize: 9 }}>{form.materiales}</Typography>
        <PreviewBar>FIRMAS / SELLOS</PreviewBar>
        <PreviewTable rows={[
          ['Conductor', form.conductor, 'Paramedico', form.paramedico],
          ['Quien recibe', form.medico, 'Doc. Medico', form.documentoMedico],
        ]} />
      </Paper>
    </Box>
  )
}

function PreviewBar({ children }: { children: React.ReactNode }) {
  return <Box sx={{ bgcolor: '#9ca3af', color: '#111827', textAlign: 'center', fontSize: 9, fontWeight: 800, mt: 1, py: 0.2 }}>{children}</Box>
}

function PreviewTable({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <Box sx={{ display: 'table', width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
      {rows.map(([l1, v1, l2, v2]) => (
        <Box key={`${l1}-${l2}`} sx={{ display: 'table-row' }}>
          <Cell label={l1} value={v1} />
          <Cell label={l2} value={v2} />
        </Box>
      ))}
    </Box>
  )
}

function Cell({ label, value }: { label: string; value: string }) {
  const numeric = value !== '' && /^-?\d+([.,]\d+)?$/.test(value)
  return (
    <Box sx={{ display: 'table-cell', width: '25%', border: '1px solid #d1d5db', px: 0.6, py: 0.35, verticalAlign: 'top' }}>
      <Typography sx={{ fontSize: 7, fontWeight: 800, lineHeight: 1.1 }}>{label}</Typography>
      <Typography sx={{ fontSize: 8, lineHeight: 1.1, textAlign: numeric ? 'right' : 'left' }}>{value}</Typography>
    </Box>
  )
}
