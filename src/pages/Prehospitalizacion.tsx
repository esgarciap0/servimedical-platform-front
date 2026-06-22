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
  departamentoTraslado: string
  ciudadTransporte: string
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
  paramedico: string
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
  departamentoTraslado: string
  ciudadTransporte: string
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
  paramedico: string
  medico: string
  documentoMedico: string
}

type FieldErrors = Partial<Record<keyof AphForm | 'lesiones' | 'procedimientos', string>>
type TouchedFields = Partial<Record<keyof AphForm | 'lesiones' | 'procedimientos', boolean>>

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
  departamentoTraslado: '',
  ciudadTransporte: '',
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
  paramedico: '',
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

const requiredFieldLabels: Partial<Record<keyof AphForm, string>> = {
  codigo: 'Codigo APH',
  movil: 'Movil',
  placa: 'Placa',
  traslado: 'Traslado',
  tipoTraslado: 'Tipo traslado',
  prioridad: 'Prioridad',
  fechaAccidente: 'Fecha Accidente',
  horaAccidente: 'Hora Accidente',
  lugarOcurrencia: 'Lugar de Ocurrencia',
  zonaOrigen: 'Zona Origen',
  departamentoOrigen: 'Dep.Origen',
  municipioOrigen: 'Municipio Origen',
  documento: 'Numero de documento',
  primerApellido: 'Primer Apellido',
  primerNombre: 'Primer Nombre',
  estadoCivil: 'Estado Civil',
  ocupacion: 'Ocupacion',
  sexo: 'Sexo',
  fechaNacimiento: 'Fecha de Nacimiento',
  edad: 'Edad',
  celular: 'Celular Paciente',
  direccion: 'Direccion de Residencia',
  zonaPaciente: 'Zona Paciente',
  departamento: 'Departamento',
  ciudad: 'Ciudad',
  aseguradora: 'Aseguradora',
  poliza: 'Numero Poliza',
  planBeneficios: 'Plan de Beneficios',
  horaLlegada: 'Hora de llegada',
  transportadoA: 'Transportado a',
  departamentoTraslado: 'Departamento traslado',
  ciudadTransporte: 'Ciudad de transporte',
  causaExterna: 'Causa externa',
  presion: 'Presion Arterial',
  frecuenciaCardiaca: 'Frec. Cardiaca',
  frecuenciaRespiratoria: 'Frec. Respiratoria',
  temperatura: 'Temp. Corporal',
  hallazgos: 'Hallazgos',
  diagnosticos: 'Diagnosticos CIE 10',
  materiales: 'Materiales y drogas',
  conductor: 'Conductor',
  paramedico: 'Paramedico',
  medico: 'Medico y/o responsable I.P.S.',
  documentoMedico: 'Doc. ID',
}

export function Prehospitalizacion() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [form, setForm] = useState<AphForm>(initialForm)
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>([])
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([])
  const [rows, setRows] = useState<AphResponse[]>([])
  const [snackbar, setSnackbar] = useState<{ message: string; fields: string[]; severity: 'error' | 'success' } | null>(null)
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({})
  const [errors, setErrors] = useState<FieldErrors>({})

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then(setRows)
      .catch(() => setRows([]))
  }, [])

  const updateField = (field: keyof AphForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setTouchedFields((current) => ({ ...current, [field]: true }))
    setErrors((current) => {
      if (!value.trim()) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const validateAll = () => {
    const nextErrors: FieldErrors = {}
    const requiredFields: (keyof AphForm)[] = [
      'codigo', 'movil', 'placa', 'traslado', 'tipoTraslado', 'prioridad', 'fechaAccidente', 'horaAccidente',
      'lugarOcurrencia', 'zonaOrigen', 'departamentoOrigen', 'municipioOrigen', 'documento', 'primerApellido',
      'primerNombre', 'estadoCivil', 'ocupacion', 'sexo', 'fechaNacimiento', 'edad', 'celular', 'direccion',
      'zonaPaciente', 'departamento', 'ciudad', 'aseguradora', 'poliza', 'planBeneficios', 'horaLlegada',
      'transportadoA', 'departamentoTraslado', 'ciudadTransporte', 'causaExterna', 'presion', 'frecuenciaCardiaca',
      'frecuenciaRespiratoria', 'temperatura', 'hallazgos', 'diagnosticos', 'materiales', 'conductor', 'paramedico',
      'medico', 'documentoMedico',
    ]
    requiredFields.forEach((field) => {
      if (!form[field].trim()) nextErrors[field] = `${requiredFieldLabels[field] || field} es obligatorio`
    })
    if (selectedInjuries.length === 0) nextErrors.lesiones = 'Selecciona al menos una zona de lesion'
    if (selectedProcedures.length === 0) nextErrors.procedimientos = 'Selecciona al menos un procedimiento'
    if (!form.causaExterna) nextErrors.causaExterna = 'Causa externa es obligatoria'
    setErrors(nextErrors)
    setTouchedFields({
      codigo: true, movil: true, placa: true, traslado: true, tipoTraslado: true, prioridad: true, fechaAccidente: true,
      horaAccidente: true, lugarOcurrencia: true, zonaOrigen: true, departamentoOrigen: true, municipioOrigen: true,
      documento: true, primerApellido: true, primerNombre: true, estadoCivil: true, ocupacion: true, sexo: true,
      fechaNacimiento: true, edad: true, celular: true, direccion: true, zonaPaciente: true, departamento: true,
      ciudad: true, aseguradora: true, poliza: true, planBeneficios: true, horaLlegada: true, transportadoA: true,
      departamentoTraslado: true, ciudadTransporte: true, causaExterna: true, presion: true, frecuenciaCardiaca: true,
      frecuenciaRespiratoria: true, temperatura: true, hallazgos: true, diagnosticos: true, materiales: true,
      conductor: true, paramedico: true, medico: true, documentoMedico: true,
      lesiones: true,
      procedimientos: true,
    })
    return nextErrors
  }

  const toggleItem = (item: string, values: string[], setter: (items: string[]) => void) => {
    setter(values.includes(item) ? values.filter((value) => value !== item) : [...values, item])
  }

  const handleSave = async () => {
    const nextErrors = validateAll()
    if (Object.keys(nextErrors).length > 0) {
      setSnackbar({ message: 'Revisa los campos obligatorios marcados en rojo.', fields: Object.values(nextErrors).slice(0, 8), severity: 'error' })
      return
    }
    const body = {
      ...form,
      lesiones: selectedInjuries,
      procedimientos: selectedProcedures,
      fechaAccidente: form.fechaAccidente || null,
      horaAccidente: form.horaAccidente || null,
      fechaNacimiento: form.fechaNacimiento || null,
      horaLlegada: form.horaLlegada || null,
    }
    try {
      const response = await fetch(API_BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
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
        <Box sx={{ bgcolor: '#25a8b7', color: 'white', px: 3, py: 1.8 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            GESTION APH
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<AddBoxIcon />}
                onClick={() => setOpen(true)}
                sx={{ bgcolor: '#1fa2b5', '&:hover': { bgcolor: '#168da0' }, width: { xs: '100%', sm: 'auto' } }}
              >
                Nuevo APH
              </Button>
              <Button
                variant="contained"
                color="inherit"
                sx={{ bgcolor: '#6c757d', color: 'white', width: { xs: '100%', sm: 'auto' } }}
              >
                Exportar a Excel
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', alignItems: { xs: 'stretch', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ fontSize: { xs: 13, sm: 14 } }}>Buscar:</Typography>
              <TextField size="small" sx={{ width: { xs: '100%', sm: 230 } }} />
            </Box>

            <TableContainer sx={{ border: '1px solid #d9dee7', overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 1500 }}>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(#ffffff, #f4f6f8)' }}>
                    {columns.map((column) => (
                      <TableCell key={column} sx={{ fontWeight: 800, fontSize: 16, whiteSpace: 'nowrap' }}>
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
                            <IconButton size="small" sx={{ bgcolor: '#ffc107', color: 'white', borderRadius: 1 }}>
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

      <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
        <DialogTitle sx={{ bgcolor: '#25a8b7', color: 'white', py: { xs: 1.2, md: 1.5 }, pr: 7 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 16, sm: 20, md: 24 } }}>
            Registrar formato APH
          </Typography>
          <IconButton
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: { xs: 8, md: 16 }, top: { xs: 6, md: 10 }, color: 'white' }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) 430px' }, minHeight: 'calc(100vh - 64px)' }}>
            <Box sx={{ p: 2, overflow: 'auto' }}>
              <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ bgcolor: 'white', borderBottom: '1px solid #dbe3ee', mb: 2 }}
              >
                {tabs.map((item) => (
                  <Tab key={item} label={item} sx={{ fontSize: 17, textTransform: 'none' }} />
                ))}
              </Tabs>

              <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #dbe3ee' }} elevation={1}>
                {tab === 0 && <PatientTab form={form} updateField={updateField} errors={errors} touchedFields={touchedFields} />}
                {tab === 1 && <InsuranceTab form={form} updateField={updateField} errors={errors} touchedFields={touchedFields} />}
                {tab === 2 && <CauseTab form={form} updateField={updateField} errors={errors} touchedFields={touchedFields} />}
                {tab === 3 && (
                  <PhysicalExamTab
                    form={form}
                    updateField={updateField}
                    selectedInjuries={selectedInjuries}
                    onToggleInjury={(area) => toggleItem(area, selectedInjuries, setSelectedInjuries)}
                    errors={errors}
                    touchedFields={touchedFields}
                  />
                )}
                {tab === 4 && (
                  <ProcedureTab
                    selectedProcedures={selectedProcedures}
                    onToggleProcedure={(procedure) => toggleItem(procedure, selectedProcedures, setSelectedProcedures)}
                    error={touchedFields.procedimientos ? errors.procedimientos : undefined}
                  />
                )}
                {tab === 5 && <MaterialsTab form={form} updateField={updateField} errors={errors} touchedFields={touchedFields} />}
                {tab === 6 && <CrewTab form={form} updateField={updateField} errors={errors} touchedFields={touchedFields} />}
              </Paper>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'space-between', gap: 1, mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
                  {tab > 0 && (
                    <Button variant="outlined" onClick={() => setTab(tab - 1)} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                      ← Anterior
                    </Button>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
                  <Button variant="outlined" color="inherit" onClick={() => setOpen(false)} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                    Cancelar
                  </Button>
                  {tab < tabs.length - 1 ? (
                    <Button variant="contained" onClick={() => setTab(tab + 1)} sx={{ bgcolor: '#075db8', '&:hover': { bgcolor: '#064a94' }, width: { xs: '100%', sm: 'auto' } }}>
                      Siguiente →
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#1f9d49', '&:hover': { bgcolor: '#18823c' }, width: { xs: '100%', sm: 'auto' } }}>
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

function PatientTab({
  form,
  updateField,
  errors,
  touchedFields,
}: {
  form: AphForm
  updateField: (field: keyof AphForm, value: string) => void
  errors: FieldErrors
  touchedFields: TouchedFields
}) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Codigo APH" value={form.codigo} onChange={(value) => updateField('codigo', value)} error={!!errors.codigo && !!touchedFields.codigo} helperText={touchedFields.codigo ? errors.codigo : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Movil" select value={form.movil} onChange={(value) => updateField('movil', value)} options={['001', '002', '003']} error={!!errors.movil && !!touchedFields.movil} helperText={touchedFields.movil ? errors.movil : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Placa" value={form.placa} onChange={(value) => updateField('placa', value)} error={!!errors.placa && !!touchedFields.placa} helperText={touchedFields.placa ? errors.placa : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Traslado" value={form.traslado} onChange={(value) => updateField('traslado', value)} error={!!errors.traslado && !!touchedFields.traslado} helperText={touchedFields.traslado ? errors.traslado : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Tipo traslado" value={form.tipoTraslado} onChange={(value) => updateField('tipoTraslado', value)} error={!!errors.tipoTraslado && !!touchedFields.tipoTraslado} helperText={touchedFields.tipoTraslado ? errors.tipoTraslado : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Prioridad" value={form.prioridad} onChange={(value) => updateField('prioridad', value)} error={!!errors.prioridad && !!touchedFields.prioridad} helperText={touchedFields.prioridad ? errors.prioridad : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Fecha Accidente" type="date" value={form.fechaAccidente} onChange={(value) => updateField('fechaAccidente', value)} error={!!errors.fechaAccidente && !!touchedFields.fechaAccidente} helperText={touchedFields.fechaAccidente ? errors.fechaAccidente : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Hora Accidente" type="time" value={form.horaAccidente} onChange={(value) => updateField('horaAccidente', value)} error={!!errors.horaAccidente && !!touchedFields.horaAccidente} helperText={touchedFields.horaAccidente ? errors.horaAccidente : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Lugar de Ocurrencia" value={form.lugarOcurrencia} onChange={(value) => updateField('lugarOcurrencia', value)} error={!!errors.lugarOcurrencia && !!touchedFields.lugarOcurrencia} helperText={touchedFields.lugarOcurrencia ? errors.lugarOcurrencia : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Zona Origen" select value={form.zonaOrigen} onChange={(value) => updateField('zonaOrigen', value)} options={['U', 'R']} error={!!errors.zonaOrigen && !!touchedFields.zonaOrigen} helperText={touchedFields.zonaOrigen ? errors.zonaOrigen : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Dep.Origen" value={form.departamentoOrigen} onChange={(value) => updateField('departamentoOrigen', value)} error={!!errors.departamentoOrigen && !!touchedFields.departamentoOrigen} helperText={touchedFields.departamentoOrigen ? errors.departamentoOrigen : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Municipio Origen" value={form.municipioOrigen} onChange={(value) => updateField('municipioOrigen', value)} error={!!errors.municipioOrigen && !!touchedFields.municipioOrigen} helperText={touchedFields.municipioOrigen ? errors.municipioOrigen : undefined} /></Grid>
      </Grid>

      <SectionTitle>Datos del paciente o victima</SectionTitle>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}><FormInput required label="Numero de documento" value={form.documento} onChange={(value) => updateField('documento', value)} error={!!errors.documento && !!touchedFields.documento} helperText={touchedFields.documento ? errors.documento : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Primer Apellido" value={form.primerApellido} onChange={(value) => updateField('primerApellido', value)} error={!!errors.primerApellido && !!touchedFields.primerApellido} helperText={touchedFields.primerApellido ? errors.primerApellido : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput label="Segundo Apellido" value={form.segundoApellido} onChange={(value) => updateField('segundoApellido', value)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Primer Nombre" value={form.primerNombre} onChange={(value) => updateField('primerNombre', value)} error={!!errors.primerNombre && !!touchedFields.primerNombre} helperText={touchedFields.primerNombre ? errors.primerNombre : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput label="Segundo Nombre" value={form.segundoNombre} onChange={(value) => updateField('segundoNombre', value)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Estado Civil" value={form.estadoCivil} onChange={(value) => updateField('estadoCivil', value)} error={!!errors.estadoCivil && !!touchedFields.estadoCivil} helperText={touchedFields.estadoCivil ? errors.estadoCivil : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Ocupacion" value={form.ocupacion} onChange={(value) => updateField('ocupacion', value)} error={!!errors.ocupacion && !!touchedFields.ocupacion} helperText={touchedFields.ocupacion ? errors.ocupacion : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Sexo" select value={form.sexo} onChange={(value) => updateField('sexo', value)} options={['M', 'F']} error={!!errors.sexo && !!touchedFields.sexo} helperText={touchedFields.sexo ? errors.sexo : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Fecha de Nacimiento" type="date" value={form.fechaNacimiento} onChange={(value) => updateField('fechaNacimiento', value)} error={!!errors.fechaNacimiento && !!touchedFields.fechaNacimiento} helperText={touchedFields.fechaNacimiento ? errors.fechaNacimiento : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Edad" value={form.edad} onChange={(value) => updateField('edad', value)} error={!!errors.edad && !!touchedFields.edad} helperText={touchedFields.edad ? errors.edad : undefined} /></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionTitle>Datos de contacto</SectionTitle>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}><FormInput required label="Celular Paciente" value={form.celular} onChange={(value) => updateField('celular', value)} error={!!errors.celular && !!touchedFields.celular} helperText={touchedFields.celular ? errors.celular : undefined} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><FormInput label="Telefono Paciente" value={form.telefono} onChange={(value) => updateField('telefono', value)} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><FormInput label="Avisar a" value={form.avisarA} onChange={(value) => updateField('avisarA', value)} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><FormInput label="Parentesco" value={form.parentesco} onChange={(value) => updateField('parentesco', value)} /></Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionTitle>Datos acompanante</SectionTitle>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}><FormInput label="Nombre Acompanante" value={form.acompanante} onChange={(value) => updateField('acompanante', value)} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><FormInput label="Celular Acompanante" value={form.celularAcompanante} onChange={(value) => updateField('celularAcompanante', value)} /></Grid>
          </Grid>
        </Grid>
      </Grid>

      <SectionTitle>Ubicacion</SectionTitle>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}><FormInput required label="Direccion de Residencia" value={form.direccion} onChange={(value) => updateField('direccion', value)} error={!!errors.direccion && !!touchedFields.direccion} helperText={touchedFields.direccion ? errors.direccion : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 2 }}><FormInput required label="Zona Paciente" select value={form.zonaPaciente} onChange={(value) => updateField('zonaPaciente', value)} options={['U', 'R']} error={!!errors.zonaPaciente && !!touchedFields.zonaPaciente} helperText={touchedFields.zonaPaciente ? errors.zonaPaciente : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Departamento" value={form.departamento} onChange={(value) => updateField('departamento', value)} error={!!errors.departamento && !!touchedFields.departamento} helperText={touchedFields.departamento ? errors.departamento : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Ciudad" value={form.ciudad} onChange={(value) => updateField('ciudad', value)} error={!!errors.ciudad && !!touchedFields.ciudad} helperText={touchedFields.ciudad ? errors.ciudad : undefined} /></Grid>
      </Grid>

      <SectionTitle>Antecedentes personales</SectionTitle>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}><FormInput label="Alergia" value={form.alergia} onChange={(value) => updateField('alergia', value)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput label="Patologicos" value={form.patologicos} onChange={(value) => updateField('patologicos', value)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput label="Medicacion" value={form.medicacion} onChange={(value) => updateField('medicacion', value)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormInput label="Liquidos y alimentos" value={form.liquidos} onChange={(value) => updateField('liquidos', value)} /></Grid>
      </Grid>
    </Stack>
  )
}

function InsuranceTab({
  form,
  updateField,
  errors,
  touchedFields,
}: {
  form: AphForm
  updateField: (field: keyof AphForm, value: string) => void
  errors: FieldErrors
  touchedFields: TouchedFields
}) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <SectionTitle>Datos aseguradora</SectionTitle>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}><FormInput required label="Aseguradora" value={form.aseguradora} onChange={(value) => updateField('aseguradora', value)} error={!!errors.aseguradora && !!touchedFields.aseguradora} helperText={touchedFields.aseguradora ? errors.aseguradora : undefined} /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><FormInput required label="Numero Poliza" value={form.poliza} onChange={(value) => updateField('poliza', value)} error={!!errors.poliza && !!touchedFields.poliza} helperText={touchedFields.poliza ? errors.poliza : undefined} /></Grid>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontWeight: 800, mb: 1, color: touchedFields.planBeneficios && errors.planBeneficios ? 'error.main' : 'text.primary' }}>
              Plan de Beneficios *
            </Typography>
            {['SOAT', 'ARL', 'EPS'].map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Radio
                    checked={form.planBeneficios === item}
                    onChange={() => updateField('planBeneficios', item)}
                  />
                }
                label={item}
              />
            ))}
            {touchedFields.planBeneficios && errors.planBeneficios && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                {errors.planBeneficios}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SectionTitle>Datos de traslado</SectionTitle>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}><FormInput required label="Hora de llegada" type="time" value={form.horaLlegada} onChange={(value) => updateField('horaLlegada', value)} error={!!errors.horaLlegada && !!touchedFields.horaLlegada} helperText={touchedFields.horaLlegada ? errors.horaLlegada : undefined} /></Grid>
          <Grid size={{ xs: 12, md: 8 }}><FormInput required label="Transportado a" value={form.transportadoA} onChange={(value) => updateField('transportadoA', value)} error={!!errors.transportadoA && !!touchedFields.transportadoA} helperText={touchedFields.transportadoA ? errors.transportadoA : undefined} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><FormInput required label="Departamento traslado" value={form.departamentoTraslado} onChange={(value) => updateField('departamentoTraslado', value)} error={!!errors.departamentoTraslado && !!touchedFields.departamentoTraslado} helperText={touchedFields.departamentoTraslado ? errors.departamentoTraslado : undefined} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><FormInput required label="Ciudad de transporte" value={form.ciudadTransporte} onChange={(value) => updateField('ciudadTransporte', value)} error={!!errors.ciudadTransporte && !!touchedFields.ciudadTransporte} helperText={touchedFields.ciudadTransporte ? errors.ciudadTransporte : undefined} /></Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

function CauseTab({
  form,
  updateField,
  errors,
  touchedFields,
}: {
  form: AphForm
  updateField: (field: keyof AphForm, value: string) => void
  errors: FieldErrors
  touchedFields: TouchedFields
}) {
  return (
    <Stack spacing={2}>
      <SectionTitle>Motivo del llamado de emergencia</SectionTitle>
      {touchedFields.causaExterna && errors.causaExterna && (
        <Typography color="error" variant="body2">{errors.causaExterna}</Typography>
      )}
      <Grid container spacing={1}>
        {causes.map((cause) => (
          <Grid key={cause} size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControlLabel
              control={<Radio checked={form.causaExterna === cause} onChange={() => updateField('causaExterna', cause)} />}
              label={<Typography sx={{ fontWeight: 800, color: touchedFields.causaExterna && errors.causaExterna ? 'error.main' : 'text.primary' }}>{cause}</Typography>}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

function PhysicalExamTab({
  form,
  updateField,
  selectedInjuries,
  onToggleInjury,
  errors,
  touchedFields,
}: {
  form: AphForm
  updateField: (field: keyof AphForm, value: string) => void
  selectedInjuries: string[]
  onToggleInjury: (area: string) => void
  errors: FieldErrors
  touchedFields: TouchedFields
}) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <SectionTitle>Examen fisico</SectionTitle>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Presion Arterial" value={form.presion} onChange={(value) => updateField('presion', value)} error={!!errors.presion && !!touchedFields.presion} helperText={touchedFields.presion ? errors.presion : undefined} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Frec. Cardiaca" value={form.frecuenciaCardiaca} onChange={(value) => updateField('frecuenciaCardiaca', value)} error={!!errors.frecuenciaCardiaca && !!touchedFields.frecuenciaCardiaca} helperText={touchedFields.frecuenciaCardiaca ? errors.frecuenciaCardiaca : undefined} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Frec. Respiratoria" value={form.frecuenciaRespiratoria} onChange={(value) => updateField('frecuenciaRespiratoria', value)} error={!!errors.frecuenciaRespiratoria && !!touchedFields.frecuenciaRespiratoria} helperText={touchedFields.frecuenciaRespiratoria ? errors.frecuenciaRespiratoria : undefined} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><FormInput required label="Temp. Corporal" value={form.temperatura} onChange={(value) => updateField('temperatura', value)} error={!!errors.temperatura && !!touchedFields.temperatura} helperText={touchedFields.temperatura ? errors.temperatura : undefined} /></Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <SectionTitle>Escala Glasgow</SectionTitle>
          <Grid container spacing={2}>
            <Grid size={{ xs: 4 }}><FormInput label="R.O" select value={form.ro} onChange={(value) => updateField('ro', value)} options={['1', '2', '3', '4']} /></Grid>
            <Grid size={{ xs: 4 }}><FormInput label="R.V." select value={form.rv} onChange={(value) => updateField('rv', value)} options={['1', '2', '3', '4', '5']} /></Grid>
            <Grid size={{ xs: 4 }}><FormInput label="R.M" select value={form.rm} onChange={(value) => updateField('rm', value)} options={['1', '2', '3', '4', '5', '6']} /></Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #dbe3ee' }}>
              <SectionTitle>Ubique las lesiones</SectionTitle>
            </Box>
            <BodySelector selected={selectedInjuries} onToggle={onToggleInjury} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2}>
            <FormInput required label="Describa los hallazgos" multiline rows={6} value={form.hallazgos} onChange={(value) => updateField('hallazgos', value)} error={!!errors.hallazgos && !!touchedFields.hallazgos} helperText={touchedFields.hallazgos ? errors.hallazgos : undefined} />
            <FormInput required label="Diagnosticos CIE 10" multiline rows={5} value={form.diagnosticos} onChange={(value) => updateField('diagnosticos', value)} error={!!errors.diagnosticos && !!touchedFields.diagnosticos} helperText={touchedFields.diagnosticos ? errors.diagnosticos : undefined} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}

function ProcedureTab({ selectedProcedures, onToggleProcedure, error }: { selectedProcedures: string[]; onToggleProcedure: (procedure: string) => void; error?: string }) {
  return (
    <Stack spacing={2}>
      <SectionTitle>Procedimientos realizados</SectionTitle>
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <Grid container spacing={1}>
        {procedures.map((procedure) => (
          <Grid key={procedure} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={selectedProcedures.includes(procedure)} onChange={() => onToggleProcedure(procedure)} />}
              label={<Typography sx={{ fontWeight: 800 }}>{procedure}</Typography>}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

function MaterialsTab({
  form,
  updateField,
  errors,
  touchedFields,
}: {
  form: AphForm
  updateField: (field: keyof AphForm, value: string) => void
  errors: FieldErrors
  touchedFields: TouchedFields
}) {
  return (
    <Stack spacing={2}>
      <SectionTitle>Materiales utilizados</SectionTitle>
      <FormInput required label="Ingrese los materiales y drogas utilizados separados por coma" multiline rows={10} value={form.materiales} onChange={(value) => updateField('materiales', value)} error={!!errors.materiales && !!touchedFields.materiales} helperText={touchedFields.materiales ? errors.materiales : undefined} />
    </Stack>
  )
}

function CrewTab({
  form,
  updateField,
  errors,
  touchedFields,
}: {
  form: AphForm
  updateField: (field: keyof AphForm, value: string) => void
  errors: FieldErrors
  touchedFields: TouchedFields
}) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}><FormInput required label="Conductor" select value={form.conductor} onChange={(value) => updateField('conductor', value)} options={['Luis Ramos', 'Oscar Soto', 'Oscar Castro']} error={!!errors.conductor && !!touchedFields.conductor} helperText={touchedFields.conductor ? errors.conductor : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><FormInput required label="Paramedico" select value={form.paramedico} onChange={(value) => updateField('paramedico', value)} options={['Eliana Florez', 'Deiba Puche']} error={!!errors.paramedico && !!touchedFields.paramedico} helperText={touchedFields.paramedico ? errors.paramedico : undefined} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionTitle>Datos I.P.S. o prestador</SectionTitle>
          <Stack spacing={2}>
            <FormInput required label="Medico y/o responsable I.P.S." value={form.medico} onChange={(value) => updateField('medico', value)} error={!!errors.medico && !!touchedFields.medico} helperText={touchedFields.medico ? errors.medico : undefined} />
            <FormInput required label="Doc. ID" value={form.documentoMedico} onChange={(value) => updateField('documentoMedico', value)} error={!!errors.documentoMedico && !!touchedFields.documentoMedico} helperText={touchedFields.documentoMedico ? errors.documentoMedico : undefined} />
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
  required = false,
  error = false,
  helperText,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  select?: boolean
  options?: string[]
  multiline?: boolean
  rows?: number
  required?: boolean
  error?: boolean
  helperText?: string
}) {
  return (
    <TextField
      fullWidth
      label={required ? `${label} *` : label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type={type}
      select={select}
      multiline={multiline}
      rows={rows}
      required={required}
      error={error}
      helperText={helperText}
      slotProps={type === 'date' || type === 'time' ? { inputLabel: { shrink: true } } : undefined}
      sx={{
        '& .MuiInputLabel-root': { fontWeight: 800, color: error ? '#dc2626' : '#1f2937' },
        '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#075db8' },
        '& .MuiFormHelperText-root': { fontWeight: 700 },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>{option}</MenuItem>
      ))}
    </TextField>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h6" sx={{ color: '#0073f0', fontWeight: 800, textTransform: 'uppercase' }}>
      {children}
    </Typography>
  )
}

function BodySelector({ selected, onToggle }: { selected: string[]; onToggle: (area: string) => void }) {
  const isSelected = (area: string) => selected.includes(area)
  const fill = (area: string) => isSelected(area) ? '#dc2626' : '#e5e7eb'
  const stroke = (area: string) => isSelected(area) ? '#991b1b' : '#9ca3af'

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <svg width="280" height="420" viewBox="0 0 280 420" role="img" aria-label="Selector de lesiones">
        <rect width="280" height="420" fill="#ffffff" rx="8" />
        <text x="140" y="18" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">Toque la zona afectada</text>

        <g transform="translate(140 0)">
          <path d="M-22 30 C-22 14,-14 4,0 4 C14 4,22 14,22 30 C22 46,14 52,0 52 C-14 52,-22 46,-22 30Z"
            fill={fill('Cabeza')} stroke={stroke('Cabeza')} strokeWidth="2"
            onClick={() => onToggle('Cabeza')} style={{ cursor: 'pointer' }} />
          <text x="0" y="32" textAnchor="middle" fontSize="8" fill={isSelected('Cabeza') ? 'white' : '#4b5563'} pointerEvents="none">Cabeza</text>

          <path d="M-30 56 L-28 160 C-28 170,-18 176,0 176 C18 176,28 170,28 160 L30 56Z"
            fill={fill('Torax')} stroke={stroke('Torax')} strokeWidth="2"
            onClick={() => onToggle('Torax')} style={{ cursor: 'pointer' }} />
          <text x="0" y="116" textAnchor="middle" fontSize="8" fill={isSelected('Torax') ? 'white' : '#4b5563'} pointerEvents="none">Torax</text>

          <path d="M-26 178 L-24 250 C-24 262,-14 268,0 268 C14 268,24 262,24 250 L26 178Z"
            fill={fill('Abdomen')} stroke={stroke('Abdomen')} strokeWidth="2"
            onClick={() => onToggle('Abdomen')} style={{ cursor: 'pointer' }} />
          <text x="0" y="224" textAnchor="middle" fontSize="8" fill={isSelected('Abdomen') ? 'white' : '#4b5563'} pointerEvents="none">Abdomen</text>

          <path d="M-30 56 L-62 130 C-66 140,-60 148,-48 148 L-34 136 L-28 170Z"
            fill={fill('Brazo izquierdo')} stroke={stroke('Brazo izquierdo')} strokeWidth="2"
            onClick={() => onToggle('Brazo izquierdo')} style={{ cursor: 'pointer' }} />
          <text x="-48" y="108" textAnchor="middle" fontSize="7" fill={isSelected('Brazo izquierdo') ? 'white' : '#4b5563'} pointerEvents="none">Brazo Izq</text>

          <path d="M30 56 L62 130 C66 140,60 148,48 148 L34 136 L28 170Z"
            fill={fill('Brazo derecho')} stroke={stroke('Brazo derecho')} strokeWidth="2"
            onClick={() => onToggle('Brazo derecho')} style={{ cursor: 'pointer' }} />
          <text x="48" y="108" textAnchor="middle" fontSize="7" fill={isSelected('Brazo derecho') ? 'white' : '#4b5563'} pointerEvents="none">Brazo Der</text>

          <path d="M-14 270 L-14 386 C-14 396,-8 402,0 402 C8 402,14 396,14 386 L14 270 C6 274,-6 274,-14 270Z"
            fill={fill('Pierna izquierda')} stroke={stroke('Pierna izquierda')} strokeWidth="2"
            onClick={() => onToggle('Pierna izquierda')} style={{ cursor: 'pointer' }} />
          <text x="0" y="340" textAnchor="middle" fontSize="8" fill={isSelected('Pierna izquierda') ? 'white' : '#4b5563'} pointerEvents="none">Pierna Izq</text>

          <path d="M12 270 L12 386 C12 396,6 402,0 402 C-6 402,-12 396,-12 386 L-12 270 C-6 274,6 274,12 270Z"
            fill={fill('Pierna derecha')} stroke={stroke('Pierna derecha')} strokeWidth="2"
            onClick={() => onToggle('Pierna derecha')} style={{ cursor: 'pointer' }} />
          <text x="0" y="400" textAnchor="middle" fontSize="8" fill={isSelected('Pierna derecha') ? 'white' : '#4b5563'} pointerEvents="none">Pierna Der</text>
        </g>
      </svg>
    </Box>
  )
}

function PdfPreview({ form, injuries, procedures }: { form: AphForm; injuries: string[]; procedures: string[] }) {
  const fullName = [form.primerNombre, form.segundoNombre, form.primerApellido, form.segundoApellido].filter(Boolean).join(' ')

  return (
    <Box sx={{ display: { xs: 'none', xl: 'block' }, bgcolor: '#e5e7eb', borderLeft: '1px solid #cbd5e1', p: 2, overflow: 'auto' }}>
      <Typography sx={{ mb: 1, fontWeight: 800, color: '#075db8' }}>Previsualizacion PDF</Typography>
      <Paper sx={{ width: 390, minHeight: 560, mx: 'auto', p: 2, bgcolor: 'white', color: '#111827', fontFamily: 'Arial, sans-serif' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box component="img" src={logo} alt="Servimedical" sx={{ width: 80, height: 'auto', flex: '0 0 auto' }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 800, lineHeight: 1.1 }}>ATENCION PRE-HOSPITALARIA</Typography>
            <Typography sx={{ fontSize: 10, lineHeight: 1.1 }}>FAPH v1 - 01/03/2025</Typography>
          </Box>
          <Box sx={{ textAlign: 'right', flex: '0 0 auto' }}>
            <Typography sx={{ fontSize: 10, lineHeight: 1.1 }}>Placa</Typography>
            <Typography sx={{ fontSize: 10, fontWeight: 700, lineHeight: 1.1 }}>{form.placa || '-'}</Typography>
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
