import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { AddBoxIcon, CloseIcon, EditIcon, PageviewIcon, PictureAsPdfIcon } from '../icons/AppIcons'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  MenuItem,
  Paper,
  Radio,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Body, { type ExtendedBodyPart } from 'react-muscle-highlighter'
import logo from '../assets/app-256.png'
import { aphService } from '../services/aphService'
import { ApiError } from '../services/api'
import type { AphForm, AphResponse, AphSortKey, SortOrder } from '../types/aph'
import {
  actionButtonSx,
  atencionInicialOptions,
  ambulanceOptions,
  aseguramientoOptions,
  causes,
  condicionOptions,
  documentTypeOptions,
  municipioOptions,
  naturalezaOptions,
  planBeneficiosOptions,
  poblacionOptions,
  prioridadOptions,
  procedures,
  requiredFieldsByTab,
  sexoOptions,
  stickyActionBodySx,
  stickyActionHeaderSx,
  tableColumns,
  tabs,
  tipoDocumentoConductorOptions,
  tipoDocumentoPropietarioOptions,
  tipoTrasladoOptions,
  tipoVehiculoOptions,
  trasladoOptions,
  zonaOptions,
  zonaOrigenOptions,
} from './prehospitalizacion/constants'
import { initialForm } from './prehospitalizacion/initialForm'
import {
  compareSortValues,
  formatInjuryLabel,
  getPatientName,
  getSortValue,
  makeInjuryKey,
  parseInjuryKey,
  pickFormFields,
} from './prehospitalizacion/helpers'

export function Prehospitalizacion() {
  const theme = useTheme()
  const isCompactScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [editId, setEditId] = useState<number | null>(null)
  const [devMode, setDevMode] = useState(() => localStorage.getItem('aph_dev_mode') === 'true')
  const [form, setForm] = useState<AphForm>(initialForm)
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>([])
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([])
  const [lesionesImagen, setLesionesImagen] = useState<string | null>(null)
  const [rows, setRows] = useState<AphResponse[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<AphSortKey>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})
  const [snackbar, setSnackbar] = useState<{ message: string; fields: string[]; severity: 'error' | 'success' } | null>(null)

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return rows
    }

    return rows.filter((row) => [
      row.codigo,
      row.movil,
      row.placa,
      row.aseguradora,
      row.documento,
      row.primerNombre,
      row.segundoNombre,
      row.primerApellido,
      row.segundoApellido,
      row.lugarOcurrencia,
      row.transportadoA,
      row.paramedico,
      row.conductor,
    ].some((value) => String(value || '').toLowerCase().includes(query)))
  }, [rows, searchTerm])

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const first = getSortValue(a, sortBy)
      const second = getSortValue(b, sortBy)
      const result = compareSortValues(first, second)

      return sortOrder === 'asc' ? result : -result
    })
  }, [filteredRows, sortBy, sortOrder])

  const progress = Math.round(((tab + 1) / tabs.length) * 100)

  useEffect(() => {
    const controller = new AbortController()

    aphService
      .list(controller.signal)
      .then(setRows)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setRows([])
      })

    return () => controller.abort()
  }, [])

  const updateField = (field: keyof AphForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const toggleInjury = (area: string) => {
    const newValues = selectedInjuries.includes(area)
        ? selectedInjuries.filter((value) => value !== area)
        : [...selectedInjuries, area]

    setSelectedInjuries(newValues)
    setLesionesImagen(null)

    if (newValues.length > 0) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next.lesiones
        return next
      })
    }
  }

  const toggleProcedure = (procedure: string) => {
    const newValues = selectedProcedures.includes(procedure)
        ? selectedProcedures.filter((value) => value !== procedure)
        : [...selectedProcedures, procedure]

    setSelectedProcedures(newValues)

    if (newValues.length > 0) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next.procedimientos
        return next
      })
    }
  }

  const validateTab = (tabIndex: number): boolean => {
    const fields = requiredFieldsByTab[tabIndex]
    const errors: Record<string, boolean> = {}

    fields.forEach((field) => {
      if (!form[field] || form[field].trim() === '') {
        errors[field] = true
      }
    })

    if (tabIndex === 0) {
      const requireCodigoHabilitacion =
        form.esAtencionInicialPacienteRemitidoOControl === '3' ||
        form.esAtencionInicialPacienteRemitidoOControl === '7' ||
        form.esAtencionInicialPacienteRemitidoOControl === '8'
      if (requireCodigoHabilitacion && (!form.codigoHabilitacion || form.codigoHabilitacion.trim() === '')) {
        errors.codigoHabilitacion = true
      }
    }

    if (tabIndex === 1) {
      const requireCodigoHabilitacionPrestadorRecibe =
        form.esAtencionInicialPacienteRemitidoOControl === '3' ||
        form.esAtencionInicialPacienteRemitidoOControl === '7' ||
        form.esAtencionInicialPacienteRemitidoOControl === '8'
      if (
        requireCodigoHabilitacionPrestadorRecibe &&
        (!form.codigoHabilitacionPrestadorRecibe || form.codigoHabilitacionPrestadorRecibe.trim() === '')
      ) {
        errors.codigoHabilitacionPrestadorRecibe = true
      }
    }

    if (tabIndex === 8) {
      const showOwnerDocs =
        form.naturalezaEvento === '01' &&
        (form.estadoAseguramiento === '2' ||
          form.estadoAseguramiento === '4' ||
          form.estadoAseguramiento === '6' ||
          form.estadoAseguramiento === '8')
      const requireOwnerResidenceFields = showOwnerDocs && form.tipoDocumentoPropietario !== 'NI'
      if (showOwnerDocs && (!form.primerNombrePropietario || form.primerNombrePropietario.trim() === '')) {
        errors.primerNombrePropietario = true
      }
      if (requireOwnerResidenceFields && (!form.direccionResidenciaPropietario || form.direccionResidenciaPropietario.trim() === '')) {
        errors.direccionResidenciaPropietario = true
      }
      if (requireOwnerResidenceFields && (!form.telefonoResidenciaPropietario || form.telefonoResidenciaPropietario.trim() === '')) {
        errors.telefonoResidenciaPropietario = true
      }
      if (requireOwnerResidenceFields && (!form.codigoMunicipioResidenciaPropietario || form.codigoMunicipioResidenciaPropietario.trim() === '')) {
        errors.codigoMunicipioResidenciaPropietario = true
      }
    }

    if (tabIndex === 9) {
      const showDriverDocs =
        form.naturalezaEvento === '01' &&
        (form.estadoAseguramiento === '2' ||
          form.estadoAseguramiento === '4' ||
          form.estadoAseguramiento === '6' ||
          form.estadoAseguramiento === '7' ||
          form.estadoAseguramiento === '8')
      if (showDriverDocs && (!form.tipoDocumentoConductorVehiculo || form.tipoDocumentoConductorVehiculo.trim() === '')) {
        errors.tipoDocumentoConductorVehiculo = true
      }
      if (showDriverDocs && (!form.numeroDocumentoConductorVehiculo || form.numeroDocumentoConductorVehiculo.trim() === '')) {
        errors.numeroDocumentoConductorVehiculo = true
      }
      if (showDriverDocs && (!form.primerNombreConductorVehiculo || form.primerNombreConductorVehiculo.trim() === '')) {
        errors.primerNombreConductorVehiculo = true
      }
      if (showDriverDocs && (!form.segundoNombreConductorVehiculo || form.segundoNombreConductorVehiculo.trim() === '')) {
        errors.segundoNombreConductorVehiculo = true
      }
      if (showDriverDocs && (!form.primerApellidoConductorVehiculo || form.primerApellidoConductorVehiculo.trim() === '')) {
        errors.primerApellidoConductorVehiculo = true
      }
      if (showDriverDocs && (!form.segundoApellidoConductorVehiculo || form.segundoApellidoConductorVehiculo.trim() === '')) {
        errors.segundoApellidoConductorVehiculo = true
      }
      if (showDriverDocs && (!form.codigoMunicipioResidenciaConductorVehiculo || form.codigoMunicipioResidenciaConductorVehiculo.trim() === '')) {
        errors.codigoMunicipioResidenciaConductorVehiculo = true
      }
      if (showDriverDocs && (!form.direccionResidenciaConductorVehiculo || form.direccionResidenciaConductorVehiculo.trim() === '')) {
        errors.direccionResidenciaConductorVehiculo = true
      }
      if (showDriverDocs && (!form.telefonoResidenciaConductorVehiculo || form.telefonoResidenciaConductorVehiculo.trim() === '')) {
        errors.telefonoResidenciaConductorVehiculo = true
      }
    }

    if (tabIndex === 3 && selectedInjuries.length === 0) {
      errors.lesiones = true
    }

    if (tabIndex === 3 && form.hallazgos.trim().length < 100) {
      errors.hallazgos = true
    }

    if (tabIndex === 4 && selectedProcedures.length === 0) {
      errors.procedimientos = true
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }))
    return Object.keys(errors).length === 0
  }

  const captureBodyMapImage = async (): Promise<string | null> => {
    const element = document.getElementById('aph-body-visible')

    if (!element) {
      console.warn('APH visible body element not found')
      return null
    }

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    })

    try {
      await document.fonts?.ready
    } catch {
      // Font loading is not critical for the body image capture.
    }

    const width = Math.max(element.scrollWidth, element.offsetWidth, 540)
    const height = Math.max(element.scrollHeight, element.offsetHeight, 335)

    try {
      return await toPng(element, {
        cacheBust: true,
        pixelRatio: 4,
        backgroundColor: '#ffffff',
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: 'none',
          transformOrigin: 'top left',
          overflow: 'visible',
        },
      })
    } catch (error) {
      console.error('Error capturing APH body image', error)
      return null
    }
  }

  const handleNext = async () => {
    if (!validateTab(tab)) return

    if (tab === 3) {
      const image = await captureBodyMapImage()

      if (!image) {
        setSnackbar({
          message: 'No se pudo capturar la imagen de ubicacion de lesiones. Intenta nuevamente.',
          fields: [],
          severity: 'error',
        })
        return
      }

      setLesionesImagen(image)
    }

    setTab(tab + 1)
  }

  const handleEdit = async (id: number) => {
    try {
      const data = await aphService.getById(id)

      setForm(pickFormFields(data, initialForm))
      setSelectedInjuries(data.lesiones || [])
      setSelectedProcedures(data.procedimientos || [])
      setLesionesImagen(data.lesionesImagen || null)
      setFieldErrors({})
      setEditId(id)
      setTab(0)
      setOpen(true)
    } catch {
      setSnackbar({ message: 'Error al cargar datos del registro', fields: [], severity: 'error' })
    }
  }

  const handleSave = async () => {
    let finalLesionesImagen = lesionesImagen

    if (!finalLesionesImagen && tab === 3) {
      finalLesionesImagen = await captureBodyMapImage()
    }

    if (!finalLesionesImagen) {
      setTab(3)
      setSnackbar({
        message: 'No se encontro la imagen de ubicacion de lesiones. Revisa el paso Examen fisico y vuelve a guardar.',
        fields: [],
        severity: 'error',
      })
      return
    }

    const payload = {
      ...form,
      lesiones: selectedInjuries,
      lesionesImagen: finalLesionesImagen,
      procedimientos: selectedProcedures,
    }

    try {
      if (editId) {
        await aphService.update(editId, payload)
      } else {
        await aphService.create(payload)
      }

      setOpen(false)
      setEditId(null)
      setFieldErrors({})
      setForm(initialForm)
      setSelectedInjuries([])
      setSelectedProcedures([])
      setLesionesImagen(null)
      setTab(0)
      setSnackbar({ message: 'Registro guardado exitosamente', fields: [], severity: 'success' })

      const list = await aphService.list()
      setRows(list)
    } catch (error) {
      if (error instanceof ApiError) {
        setSnackbar({ message: error.message, fields: error.fields, severity: 'error' })
        return
      }

      setSnackbar({
        message: `Error de red: ${error instanceof Error ? error.message : 'desconocido'}`,
        fields: [],
        severity: 'error',
      })
    }
  }

  const fetchPdfBlob = (id: number): Promise<Blob> => aphService.getPdfBlob(id)

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    link.click()

    URL.revokeObjectURL(url)
  }

  const handleDownloadPdf = async (id: number) => {
    try {
      const blob = await fetchPdfBlob(id)
      downloadBlob(blob, `APH-${id}.pdf`)
    } catch {
      setSnackbar({ message: 'Error al descargar PDF', fields: [], severity: 'error' })
    }
  }

  const handleViewPdf = async (id: number) => {
    try {
      const blob = await fetchPdfBlob(id)
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      setSnackbar({ message: 'Error al visualizar PDF', fields: [], severity: 'error' })
    }
  }

  const closeDialog = () => {
    setOpen(false)
    setEditId(null)
    setFieldErrors({})
    setLesionesImagen(null)
  }

  const openNewAph = () => {
    setFieldErrors({})
    setEditId(null)
    setForm(initialForm)
    setSelectedInjuries([])
    setSelectedProcedures([])
    setLesionesImagen(null)
    setTab(0)
    setOpen(true)
  }

  const handleSort = (key: AphSortKey) => {
    if (sortBy === key) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortBy(key)
    setSortOrder(key === 'createdAt' ? 'desc' : 'asc')
  }

  return (
      <Stack spacing={{ xs: 1.25, md: 1.5 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} underline="hover" color="primary" to="/">
            Inicio
          </Link>
          <Typography color="text.secondary">APH</Typography>
        </Breadcrumbs>

        <Card
            sx={{
              overflow: 'hidden',
              borderRadius: 2.5,
              maxWidth: 1180,
              width: '100%',
              mx: 'auto',
            }}
        >
          <Box
              sx={{
                px: { xs: 1.25, md: 1.5 },
                py: { xs: 0.9, md: 1 },
                color: 'white',
                background: 'linear-gradient(135deg, #0f766e 0%, #075db8 100%)',
              }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: { xs: 18, md: 19 }, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  Gestion APH
                </Typography>
                <Typography sx={{ fontSize: { xs: 12, md: 12.5 }, opacity: 0.88 }}>
                  Registro, consulta y generacion profesional del formato de atencion prehospitalaria.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Chip label={`${rows.length} registros`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 800 }} />
                <Chip label="PDF APH" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 800 }} />
              </Stack>
            </Stack>
          </Box>

          <CardContent sx={{ p: { xs: 1, md: 1.15 } }}>
            <Stack spacing={0.75}>
              <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'auto auto 1fr minmax(240px, 320px)' },
                    alignItems: 'center',
                    gap: 1,
                  }}
              >
                <Button
                    variant="contained"
                    startIcon={<AddBoxIcon />}
                    onClick={openNewAph}
                    sx={{
                      bgcolor: '#0f766e',
                      minHeight: 32,
                      px: 1.4,
                      fontSize: 12.5,
                      fontWeight: 800,
                      '&:hover': { bgcolor: '#115e59' },
                    }}
                >
                  Nuevo APH
                </Button>

                <Button
                    variant="outlined"
                    color="inherit"
                    sx={{ borderColor: '#cbd5e1', color: '#334155', minHeight: 32, px: 1.4, fontSize: 12.5, fontWeight: 800 }}
                >
                  Exportar a Excel
                </Button>

                <Box />

                <TextField
                    size="small"
                    label="Buscar registro"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Paciente, documento, ambulancia..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        bgcolor: '#f8fafc',
                        minHeight: 34,
                        fontSize: 12.5,
                      },
                      '& .MuiInputBase-input': {
                        py: 0.6,
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: 12,
                      },
                    }}
                />
              </Box>

              <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1 }}>
                {sortedRows.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', color: 'text.secondary', borderRadius: 2 }}>
                      No hay registros disponibles
                    </Paper>
                ) : (
                    sortedRows.map((row) => (
                        <AphMobileCard
                            key={row.id}
                            row={row}
                            onView={() => handleViewPdf(row.id)}
                            onEdit={() => handleEdit(row.id)}
                            onDownload={() => handleDownloadPdf(row.id)}
                        />
                    ))
                )}
              </Box>

              <TableContainer
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    border: '1px solid #d9dee7',
                    borderRadius: 1.5,
                    overflowX: 'auto',
                    position: 'relative',
                  }}
              >
                <Table
                    size="small"
                    stickyHeader
                    sx={{
                      minWidth: 1450,
                      tableLayout: 'fixed',
                      '& .MuiTableCell-root': {
                        px: 0.9,
                        py: 0.4,
                        height: 32,
                        fontSize: 11.8,
                        lineHeight: 1.15,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        verticalAlign: 'middle',
                      },
                      '& .MuiTableHead .MuiTableCell-root': {
                        height: 30,
                        fontSize: 11.8,
                        fontWeight: 900,
                        color: '#334155',
                        bgcolor: '#f8fafc',
                      },
                      '& .MuiTableBody .MuiTableRow-root:hover .MuiTableCell-root': {
                        bgcolor: '#f8fafc',
                      },
                      '& .MuiTableBody .MuiTableRow-root:hover .actions-sticky-cell': {
                        bgcolor: '#f8fafc',
                      },
                    }}
                >
                  <TableHead>
                    <TableRow>
                      {tableColumns.map((column) => (
                          <TableCell
                              key={column.label}
                              sx={{
                                width: column.width,
                                minWidth: column.minWidth,
                                maxWidth: column.maxWidth,
                                ...(column.sticky ? stickyActionHeaderSx : {}),
                              }}
                          >
                            {column.sortKey ? (
                                <TableSortLabel
                                    active={sortBy === column.sortKey}
                                    direction={sortBy === column.sortKey ? sortOrder : 'asc'}
                                    onClick={() => handleSort(column.sortKey as AphSortKey)}
                                    sx={{
                                      fontWeight: 900,
                                      color: '#334155',
                                      '&.Mui-active': {
                                        color: '#075db8',
                                      },
                                      '& .MuiTableSortLabel-icon': {
                                        fontSize: 16,
                                      },
                                    }}
                                >
                                  {column.label}
                                </TableSortLabel>
                            ) : (
                                column.label
                            )}
                          </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {sortedRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={tableColumns.length} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                            No hay registros disponibles
                          </TableCell>
                        </TableRow>
                    ) : (
                        sortedRows.map((row) => (
                            <TableRow key={row.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                              <TableCell sx={{ fontWeight: 900 }}>{row.codigo || row.id}</TableCell>
                              <TableCell>{row.createdAt?.split('T')[0] || ''}</TableCell>
                              <TableCell>{row.movil || ''}</TableCell>
                              <TableCell>{row.aseguradora || ''}</TableCell>
                              <TableCell>{row.tipoDocumento || ''}</TableCell>
                              <TableCell>{row.documento || ''}</TableCell>

                              <TableCell title={getPatientName(row)}>
                                {getPatientName(row)}
                              </TableCell>

                              <TableCell title={row.lugarOcurrencia || ''}>
                                {row.lugarOcurrencia || ''}
                              </TableCell>

                              <TableCell title={row.transportadoA || ''}>
                                {row.transportadoA || ''}
                              </TableCell>

                              <TableCell title={row.paramedico || ''}>
                                {row.paramedico || ''}
                              </TableCell>

                              <TableCell title={row.conductor || ''}>
                                {row.conductor || ''}
                              </TableCell>

                              <TableCell className="actions-sticky-cell" sx={stickyActionBodySx}>
                                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                  <Tooltip title="Ver PDF">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleViewPdf(row.id)}
                                        sx={{
                                          ...actionButtonSx,
                                          bgcolor: '#0d6efd',
                                          color: 'white',
                                          '&:hover': { bgcolor: '#0b5ed7' },
                                        }}
                                    >
                                      <PageviewIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Editar">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEdit(row.id)}
                                        sx={{
                                          ...actionButtonSx,
                                          bgcolor: '#f59e0b',
                                          color: 'white',
                                          '&:hover': { bgcolor: '#d97706' },
                                        }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Descargar PDF">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDownloadPdf(row.id)}
                                        sx={{
                                          ...actionButtonSx,
                                          color: '#dc3545',
                                          bgcolor: '#fff1f2',
                                          '&:hover': { bgcolor: '#ffe4e6' },
                                        }}
                                    >
                                      <PictureAsPdfIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
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

        <Dialog
            open={open}
            onClose={closeDialog}
            fullScreen={isCompactScreen}
            fullWidth={false}
            maxWidth={false}
            slotProps={{
              paper: {
                sx: {
                  width: { xs: '100%', md: 'min(1080px, calc(100vw - 96px))' },
                  maxHeight: { xs: '100%', md: 'calc(100vh - 48px)' },
                  borderRadius: { xs: 0, md: '18px' },
                  overflow: 'hidden',
                  display: 'block',
                  boxShadow: '0 24px 70px rgba(15, 23, 42, 0.35)',
                },
              },
              backdrop: {
                sx: {
                  bgcolor: 'rgba(15, 23, 42, 0.72)',
                  backdropFilter: 'blur(4px)',
                },
              },
            }}
        >
          <DialogTitle sx={{ bgcolor: '#0f766e', color: 'white', p: 0 }}>
            <Box sx={{ px: { xs: 1.25, md: 1.5 }, py: { xs: 0.65, md: 0.75 }, pr: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontWeight: 900, fontSize: { xs: 15, md: 16 }, lineHeight: 1.1 }}>
                  {editId ? `Editar APH #${editId}` : 'Registrar formato APH'}
                </Typography>
                <Tooltip title="Activar modo desarrollador (muestra la referencia a la columna del Excel)">
                  <FormControlLabel
                      control={<Switch size="small" checked={devMode} onChange={(_, v) => { setDevMode(v); localStorage.setItem('aph_dev_mode', String(v)) }} sx={{ '& .MuiSwitch-thumb': { bgcolor: devMode ? '#facc15' : '#94a3b8' } }} />}
                      label={<Typography sx={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.75)' }}>DEV</Typography>}
                      sx={{ m: 0, ml: 'auto' }}
                  />
                </Tooltip>
              </Box>
              <Typography sx={{ opacity: 0.85, fontSize: { xs: 11.5, md: 12 } }}>
                Paso {tab + 1} de {tabs.length}: {tabs[tab]}
              </Typography>
            </Box>

            <IconButton
                aria-label="Cerrar"
                onClick={closeDialog}
                sx={{ position: 'absolute', right: { xs: 8, md: 14 }, top: { xs: 7, md: 8 }, color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 3, bgcolor: 'rgba(255,255,255,0.18)', '& .MuiLinearProgress-bar': { bgcolor: '#facc15' } }} />
          </DialogTitle>

          <DialogContent sx={{ p: 0, bgcolor: '#f8fafc', flex: '0 1 auto' }}>


            <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  maxHeight: { xs: 'calc(100dvh - 60px)', md: 'calc(100vh - 86px)' },
                  overflow: 'hidden',
                }}
            >
              <Box
                  sx={{
                    p: { xs: 0.75, md: 1 },
                    overflow: 'auto',
                    maxHeight: { xs: 'calc(100dvh - 60px)', md: 'calc(100vh - 86px)' },
                  }}
              >
                <Tabs
                    value={tab}
                    onChange={(_, value) => setTab(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      bgcolor: 'white',
                      border: '1px solid #dbe3ee',
                      borderRadius: 1.5,
                      mb: 0.75,
                      minHeight: 30,
                      '& .MuiTabs-indicator': { height: 2.2, borderRadius: 3 },
                      '& .MuiTab-root': {
                        minHeight: 30,
                        py: 0.15,
                        px: { xs: 0.85, md: 1.1 },
                        fontSize: { xs: 11, md: 11.5 },
                        textTransform: 'none',
                        fontWeight: 800,
                      },
                    }}
                >
                  {tabs.map((item) => (
                      <Tab key={item} label={item} sx={{ fontSize: 11.5, textTransform: 'none' }} />
                  ))}
                </Tabs>

                <Paper
                    sx={{
                      p: { xs: 0.75, md: 1 },
                      borderRadius: 1.75,
                      border: '1px solid #dbe3ee',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
                    }}
                    elevation={0}
                >
                  {tab === 0 && <PatientTab form={form} updateField={updateField} fieldErrors={fieldErrors} devMode={devMode} />}
                  {tab === 1 && <InsuranceTab form={form} updateField={updateField} fieldErrors={fieldErrors} devMode={devMode} />}
                  {tab === 2 && <CauseTab form={form} updateField={updateField} fieldErrors={fieldErrors} devMode={devMode} />}
                  {tab === 3 && (
                      <PhysicalExamTab
                          form={form}
                          updateField={updateField}
                          fieldErrors={fieldErrors}
                          selectedInjuries={selectedInjuries}
                          onToggleInjury={toggleInjury}
                          devMode={devMode}
                      />
                  )}
                  {tab === 4 && (
                      <ProcedureTab
                          selectedProcedures={selectedProcedures}
                          onToggleProcedure={toggleProcedure}
                          fieldErrors={fieldErrors}
                          devMode={devMode}
                      />
                  )}
                  {tab === 5 && <MaterialsTab form={form} updateField={updateField} fieldErrors={fieldErrors} devMode={devMode} />}
                  {tab === 6 && <CrewTab form={form} updateField={updateField} fieldErrors={fieldErrors} devMode={devMode} />}
                  {tab === 7 && <VehicleTab form={form} updateField={updateField} fieldErrors={fieldErrors} devMode={devMode} />}
                  {tab === 8 && <OwnerTab form={form} updateField={updateField} fieldErrors={fieldErrors} devMode={devMode} />}
                  {tab === 9 && <DriverTab form={form} updateField={updateField} fieldErrors={fieldErrors} devMode={devMode} />}
                </Paper>

                <Box
                    sx={{
                      position: 'sticky',
                      bottom: 0,
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column-reverse', sm: 'row' },
                      justifyContent: 'space-between',
                      gap: 0.6,
                      mt: 0.75,
                      p: 0.6,
                      border: '1px solid #dbe3ee',
                      borderRadius: 1.5,
                      bgcolor: 'rgba(248, 250, 252, 0.96)',
                      backdropFilter: 'blur(8px)',
                    }}
                >
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
                    {tab > 0 && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setTab(tab - 1)}
                            sx={{ minHeight: 32, px: 1.5, fontSize: 12.5, fontWeight: 800, width: { xs: '100%', sm: 'auto' } }}
                        >
                          â† Anterior
                        </Button>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        onClick={closeDialog}
                        sx={{ minHeight: 32, px: 1.5, fontSize: 12.5, fontWeight: 800, width: { xs: '100%', sm: 'auto' } }}
                    >
                      Cancelar
                    </Button>

                    {tab < tabs.length - 1 ? (
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              void handleNext()
                            }}
                            sx={{ minHeight: 32, px: 1.5, fontSize: 12.5, fontWeight: 800, bgcolor: '#075db8', '&:hover': { bgcolor: '#064a94' }, width: { xs: '100%', sm: 'auto' } }}
                        >
                          Siguiente â†’
                        </Button>
                    ) : (
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              if (validateTab(tab)) {
                                void handleSave()
                              }
                            }}
                            sx={{ minHeight: 32, px: 1.5, fontSize: 12.5, fontWeight: 800, bgcolor: '#1f9d49', '&:hover': { bgcolor: '#18823c' }, width: { xs: '100%', sm: 'auto' } }}
                        >
                          Guardar
                        </Button>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'none' }}>
                <PdfPreview form={form} injuries={selectedInjuries} procedures={selectedProcedures} />
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        <Snackbar open={!!snackbar} autoHideDuration={6000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbar(null)} severity={snackbar?.severity || 'error'} sx={{ width: '100%', whiteSpace: 'pre-line' }}>
            {snackbar?.message}
            {snackbar?.fields && snackbar.fields.length > 0 && (
                <Box component="ul" sx={{ mt: 0.5, mb: 0, pl: 2 }}>
                  {snackbar.fields.map((field, index) => (
                      <li key={`${field}-${index}`}>{field}</li>
                  ))}
                </Box>
            )}
          </Alert>
        </Snackbar>
      </Stack>
  )
}


function AphMobileCard({
                         row,
                         onView,
                         onEdit,
                         onDownload,
                       }: {
  row: AphResponse
  onView: () => void
  onEdit: () => void
  onDownload: () => void
}) {
  return (
      <Paper variant="outlined" sx={{ p: 1.1, borderRadius: 2, bgcolor: 'white' }}>
        <Stack spacing={0.9}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.15 }} noWrap>
                {getPatientName(row) || 'Paciente sin nombre'}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                {row.tipoDocumento || ''} {row.documento || 'Sin documento'}
              </Typography>
            </Box>
            <Chip label={row.codigo || `#${row.id}`} size="small" sx={{ fontWeight: 900, bgcolor: '#e0f2fe', color: '#075985' }} />
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <MobileInfo label="Fecha" value={row.createdAt?.split('T')[0] || '-'} />
            <MobileInfo label="Ambulancia" value={row.movil || '-'} />
            <MobileInfo label="Origen" value={row.lugarOcurrencia || '-'} />
            <MobileInfo label="Destino" value={row.transportadoA || '-'} />
          </Box>

          <Stack direction="row" spacing={1}>
            <Button fullWidth size="small" variant="contained" onClick={onView} sx={{ bgcolor: '#0d6efd', fontWeight: 800 }}>
              Ver
            </Button>
            <Button fullWidth size="small" variant="contained" onClick={onEdit} sx={{ bgcolor: '#f59e0b', fontWeight: 800 }}>
              Editar
            </Button>
            <Button fullWidth size="small" variant="outlined" color="error" onClick={onDownload} sx={{ fontWeight: 800 }}>
              PDF
            </Button>
          </Stack>
        </Stack>
      </Paper>
  )
}

function MobileInfo({ label, value }: { label: string; value: string }) {
  return (
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }} noWrap>
          {value}
        </Typography>
      </Box>
  )
}


function PatientTab({ form, updateField, fieldErrors, devMode }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean>; devMode?: boolean }) {
  return (
      <Stack spacing={0.75}>
        <Grid container spacing={0.75}>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Codigo APH" value={form.codigo} onChange={(value) => updateField('codigo', value)} error={!!fieldErrors.codigo} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Movil" select value={form.movil} onChange={(value) => updateField('movil', value)} options={ambulanceOptions} error={!!fieldErrors.movil} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Placa" alphanumeric maxLength={10} value={form.placa} onChange={(value) => updateField('placa', value)} error={!!fieldErrors.placa} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact select label="Atención inicial / remitido / control" value={form.esAtencionInicialPacienteRemitidoOControl} onChange={(value) => updateField('esAtencionInicialPacienteRemitidoOControl', value)} options={atencionInicialOptions} excelRef="AW: Es_atencion_inicial_paciente_remitido_o_control" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Traslado" select value={form.traslado} onChange={(value) => updateField('traslado', value)} options={trasladoOptions} error={!!fieldErrors.traslado} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact numeric maxLength={12} label="Código habilitación prestador remite" value={form.codigoHabilitacion} onChange={(value) => updateField('codigoHabilitacion', value)} error={!!fieldErrors.codigoHabilitacion} excelRef="AZ: Codigo_de_habilitacion_del_prestador_que_remite" devMode={devMode} requiredHint={form.esAtencionInicialPacienteRemitidoOControl === '3' || form.esAtencionInicialPacienteRemitidoOControl === '7' || form.esAtencionInicialPacienteRemitidoOControl === '8'} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Tipo traslado" select value={form.tipoTraslado} onChange={(value) => updateField('tipoTraslado', value)} options={tipoTrasladoOptions} error={!!fieldErrors.tipoTraslado} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Prioridad" select value={form.prioridad} onChange={(value) => updateField('prioridad', value)} options={prioridadOptions} error={!!fieldErrors.prioridad} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Fecha Accidente" type="date" value={form.fechaAccidente} onChange={(value) => updateField('fechaAccidente', value)} error={!!fieldErrors.fechaAccidente} excelRef="P: Fecha_de_ocurrencia_evento" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Hora Accidente" type="time" value={form.horaAccidente} onChange={(value) => updateField('horaAccidente', value)} error={!!fieldErrors.horaAccidente} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Naturaleza del Evento" select value={form.naturalezaEvento} onChange={(value) => updateField('naturalezaEvento', value)} options={naturalezaOptions} error={!!fieldErrors.naturalezaEvento} excelRef="M: Naturaleza_del_evento" devMode={devMode} /></Grid>
          {form.naturalezaEvento === '17' && (
              <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Descripción del otro evento" value={form.descripcionOtroEvento} onChange={(value) => updateField('descripcionOtroEvento', value)} excelRef="N: Descripcion_del_otro_evento" devMode={devMode} /></Grid>
          )}
          {form.naturalezaEvento === '01' && (
              <Grid size={{ xs: 12, md: 2 }}><FormInput compact label="Condición Víctima" select value={form.condicionVictima} onChange={(value) => updateField('condicionVictima', value)} options={condicionOptions} excelRef="O: Condicion_victima" devMode={devMode} /></Grid>
          )}
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Dirección de ocurrencia" address maxLength={100} value={form.lugarOcurrencia} onChange={(value) => updateField('lugarOcurrencia', value)} error={!!fieldErrors.lugarOcurrencia} excelRef="S: Direccion_de_ocurrencia_evento" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Zona Origen" select value={form.zonaOrigen} onChange={(value) => updateField('zonaOrigen', value)} options={zonaOrigenOptions} error={!!fieldErrors.zonaOrigen} excelRef="Q: Zona_de_ocurrencia_evento" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact label="Código municipio ocurrencia" select value={form.codigoMunicipioOcurrencia} onChange={(value) => updateField('codigoMunicipioOcurrencia', value)} options={municipioOptions} excelRef="R: Codigo_municipio_ocurrencia_evento" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Dep.Origen" value={form.departamentoOrigen} onChange={(value) => updateField('departamentoOrigen', value)} error={!!fieldErrors.departamentoOrigen} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Municipio Origen" value={form.municipioOrigen} onChange={(value) => updateField('municipioOrigen', value)} error={!!fieldErrors.municipioOrigen} /></Grid>
        </Grid>

        <SectionTitle compact>Datos del paciente o victima</SectionTitle>
        <Grid container spacing={0.75}>
          <Grid size={{ xs: 12, md: 1 }}><FormInput compact requiredHint label="Tipo ID" select value={form.tipoDocumento} onChange={(value) => updateField('tipoDocumento', value)} options={documentTypeOptions} error={!!fieldErrors.tipoDocumento} excelRef="C: Tipo_documento_identidad_victima" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Numero de documento" value={form.documento} onChange={(value) => updateField('documento', value)} error={!!fieldErrors.documento} maxLength={20} alphanumeric excelRef="D: Numero_documento_identidad_victima" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Primer Nombre" lettersOnly maxLength={30} value={form.primerNombre} onChange={(value) => updateField('primerNombre', value)} error={!!fieldErrors.primerNombre} excelRef="F: Primer_nombre_victima" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Segundo Nombre" lettersOnly maxLength={30} value={form.segundoNombre} onChange={(value) => updateField('segundoNombre', value)} error={!!fieldErrors.segundoNombre} excelRef="G: Segundo_nombre_victima" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Primer Apellido" lettersOnly maxLength={30} value={form.primerApellido} onChange={(value) => updateField('primerApellido', value)} error={!!fieldErrors.primerApellido} excelRef="H: Primer_apellido_victima" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Segundo Apellido" lettersOnly maxLength={30} value={form.segundoApellido} onChange={(value) => updateField('segundoApellido', value)} error={!!fieldErrors.segundoApellido} excelRef="I: Segundo_apellido_victima" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact label="Tipo Población" select value={form.tipoPoblacion} onChange={(value) => updateField('tipoPoblacion', value)} options={poblacionOptions} excelRef="E: Tipo_de_poblacion_especial" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Estado Civil" value={form.estadoCivil} onChange={(value) => updateField('estadoCivil', value)} error={!!fieldErrors.estadoCivil} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Ocupacion" value={form.ocupacion} onChange={(value) => updateField('ocupacion', value)} error={!!fieldErrors.ocupacion} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Sexo" select value={form.sexo} onChange={(value) => updateField('sexo', value)} options={sexoOptions} error={!!fieldErrors.sexo} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Fecha de Nacimiento" type="date" value={form.fechaNacimiento} onChange={(value) => updateField('fechaNacimiento', value)} error={!!fieldErrors.fechaNacimiento} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Edad" numeric maxLength={3} value={form.edad} onChange={(value) => updateField('edad', value)} error={!!fieldErrors.edad} /></Grid>
        </Grid>

        <SectionTitle compact>Datos de contacto</SectionTitle>
        <Grid container spacing={0.75}>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormInput
                compact
                requiredHint
                label="Celular Paciente"
                numeric
                maxLength={10}
                value={form.celular}
                onChange={(value) => updateField('celular', value)}
                error={!!fieldErrors.celular}
                excelRef="L: Telefono_victima"
                devMode={devMode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormInput
                compact
                label="Telefono Paciente"
                numeric
                maxLength={10}
                value={form.telefono}
                onChange={(value) => updateField('telefono', value)}
                error={!!fieldErrors.telefono}
                devMode={devMode}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormInput
                compact
                label="Avisar a"
                value={form.avisarA}
                onChange={(value) => updateField('avisarA', value)}
                error={!!fieldErrors.avisarA}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormInput
                compact
                label="Parentesco"
                value={form.parentesco}
                onChange={(value) => updateField('parentesco', value)}
                error={!!fieldErrors.parentesco}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormInput
                compact
                label="Numero Para Avisar"
                numeric
                maxLength={10}
                value={form.numeroParaAvisar}
                onChange={(value) => updateField('numeroParaAvisar', value)}
                error={!!fieldErrors.numeroParaAvisar}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormInput
                compact
                label="Numero Para Avisar 2"
                numeric
                maxLength={10}
                value={form.numeroParaAvisar2}
                onChange={(value) => updateField('numeroParaAvisar2', value)}
                error={!!fieldErrors.numeroParaAvisar2}
            />
          </Grid>
        </Grid>

        <SectionTitle compact>Datos acompanante</SectionTitle>
        <Grid container spacing={0.75}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormInput
                compact
                label="Nombre Acompanante"
                lettersOnly
                maxLength={60}
                value={form.acompanante}
                onChange={(value) => updateField('acompanante', value)}
                error={!!fieldErrors.acompanante}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormInput
                compact
                label="Celular Acompanante"
                numeric
                maxLength={10}
                value={form.celularAcompanante}
                onChange={(value) => updateField('celularAcompanante', value)}
                error={!!fieldErrors.celularAcompanante}
            />
          </Grid>
        </Grid>

        <SectionTitle compact>Ubicacion</SectionTitle>
        <Grid container spacing={0.75}>
          <Grid size={{ xs: 12, md: 4 }}><FormInput compact requiredHint label="Direccion de Residencia" address maxLength={120} value={form.direccion} onChange={(value) => updateField('direccion', value)} error={!!fieldErrors.direccion} excelRef="J: Direccion_residencia_victima" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact label="Código municipio residencia" select value={form.codigoMunicipioResidencia} onChange={(value) => updateField('codigoMunicipioResidencia', value)} options={municipioOptions} excelRef="K: Codigo_municipio_residencia_victima" devMode={devMode} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Zona Paciente" select value={form.zonaPaciente} onChange={(value) => updateField('zonaPaciente', value)} options={zonaOptions} error={!!fieldErrors.zonaPaciente} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Departamento" value={form.departamento} onChange={(value) => updateField('departamento', value)} error={!!fieldErrors.departamento} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Ciudad" value={form.ciudad} onChange={(value) => updateField('ciudad', value)} error={!!fieldErrors.ciudad} /></Grid>
        </Grid>

        <SectionTitle compact>Antecedentes personales</SectionTitle>
        <Grid container spacing={0.75}>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Alergia" value={form.alergia} onChange={(value) => updateField('alergia', value)} error={!!fieldErrors.alergia} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Patologicos" value={form.patologicos} onChange={(value) => updateField('patologicos', value)} error={!!fieldErrors.patologicos} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Medicacion" value={form.medicacion} onChange={(value) => updateField('medicacion', value)} error={!!fieldErrors.medicacion} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Liquidos y alimentos" value={form.liquidos} onChange={(value) => updateField('liquidos', value)} error={!!fieldErrors.liquidos} /></Grid>
        </Grid>
      </Stack>
  )
}

function InsuranceTab({ form, updateField, fieldErrors, devMode }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean>; devMode?: boolean }) {
  void devMode
  return (
      <Grid container spacing={0.75}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionTitle compact>Datos aseguradora</SectionTitle>
          <Grid container spacing={0.75}>
            <Grid size={{ xs: 12, md: 8 }}><FormInput compact label="Aseguradora" value={form.aseguradora} onChange={(value) => updateField('aseguradora', value)} error={!!fieldErrors.aseguradora} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Numero Poliza" value={form.poliza} onChange={(value) => updateField('poliza', value)} error={!!fieldErrors.poliza} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><FormInput compact numeric maxLength={12} label="Código habilitación prestador recibe" value={form.codigoHabilitacionPrestadorRecibe} onChange={(value) => updateField('codigoHabilitacionPrestadorRecibe', value)} error={!!fieldErrors.codigoHabilitacionPrestadorRecibe} excelRef="BA: Codigo_de_habilitacion_del_prestador_que_recibe" devMode={devMode} requiredHint={form.esAtencionInicialPacienteRemitidoOControl === '3' || form.esAtencionInicialPacienteRemitidoOControl === '7' || form.esAtencionInicialPacienteRemitidoOControl === '8'} /></Grid>
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ fontWeight: 800, mb: 0.5, fontSize: 12, color: fieldErrors.planBeneficios ? '#d32f2f' : '#1f2937' }}>Plan de Beneficios *</Typography>
              {planBeneficiosOptions.map((item) => (
                  <FormControlLabel
                      key={item}
                      control={<Radio checked={form.planBeneficios === item} onChange={() => updateField('planBeneficios', item)} />}
                      label={<Typography sx={{ fontSize: 12 }}>{item}</Typography>}
                  />
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionTitle compact>Datos de traslado</SectionTitle>
          <Grid container spacing={0.75}>
            <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Hora de llegada" type="time" value={form.horaLlegada} onChange={(value) => updateField('horaLlegada', value)} error={!!fieldErrors.horaLlegada} /></Grid>
            <Grid size={{ xs: 12, md: 8 }}><FormInput compact label="Transportado a" value={form.transportadoA} onChange={(value) => updateField('transportadoA', value)} error={!!fieldErrors.transportadoA} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Departamento traslado" value={form.departamentoTraslado} onChange={(value) => updateField('departamentoTraslado', value)} error={!!fieldErrors.departamentoTraslado} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Ciudad de transporte" value={form.ciudadTransporte} onChange={(value) => updateField('ciudadTransporte', value)} error={!!fieldErrors.ciudadTransporte} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><FormInput compact label="Estado Paciente" select value={form.estadoPaciente} onChange={(value) => updateField('estadoPaciente', value)} options={['VIVO', 'MUERTO']} error={!!fieldErrors.estadoPaciente} /></Grid>
          </Grid>
        </Grid>
      </Grid>
  )
}

function CauseTab({ form, updateField, fieldErrors, devMode }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean>; devMode?: boolean }) {
  void devMode
  return (
      <Stack spacing={0.75}>
        <SectionTitle compact sx={{ color: fieldErrors.causaExterna ? '#d32f2f' : undefined }}>Motivo del llamado de emergencia *</SectionTitle>
        <Grid container spacing={0.25}>
          {causes.map((cause) => (
              <Grid key={cause} size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControlLabel
                    control={<Radio checked={form.causaExterna === cause} onChange={() => updateField('causaExterna', cause)} />}
                    label={<Typography sx={{ fontWeight: 700, fontSize: 12 }}>{cause}</Typography>}
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
                           fieldErrors,
                           selectedInjuries,
                           onToggleInjury,
                           devMode,
                         }: {
  form: AphForm
  updateField: (field: keyof AphForm, value: string) => void
  fieldErrors: Record<string, boolean>
  selectedInjuries: string[]
  onToggleInjury: (area: string) => void
  devMode?: boolean
}) {
  return (
      <Stack spacing={0.75}>
        <Grid container spacing={0.75}>
          <Grid size={{ xs: 12, md: 7 }}>
            <SectionTitle compact>Examen fisico</SectionTitle>
            <Grid container spacing={0.75}>
              <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Presion Arterial" value={form.presion} onChange={(value) => updateField('presion', value)} error={!!fieldErrors.presion} /></Grid>
              <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Frec. Cardiaca" value={form.frecuenciaCardiaca} onChange={(value) => updateField('frecuenciaCardiaca', value)} error={!!fieldErrors.frecuenciaCardiaca} /></Grid>
              <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Frec. Respiratoria" value={form.frecuenciaRespiratoria} onChange={(value) => updateField('frecuenciaRespiratoria', value)} error={!!fieldErrors.frecuenciaRespiratoria} /></Grid>
              <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Temp. Corporal" value={form.temperatura} onChange={(value) => updateField('temperatura', value)} error={!!fieldErrors.temperatura} /></Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <SectionTitle compact>Escala Glasgow</SectionTitle>
            <Grid container spacing={0.75}>
              <Grid size={{ xs: 4 }}><FormInput compact label="R.O" select value={form.ro} onChange={(value) => updateField('ro', value)} options={['1', '2', '3', '4']} error={!!fieldErrors.ro} /></Grid>
              <Grid size={{ xs: 4 }}><FormInput compact label="R.V." select value={form.rv} onChange={(value) => updateField('rv', value)} options={['1', '2', '3', '4', '5']} error={!!fieldErrors.rv} /></Grid>
              <Grid size={{ xs: 4 }}><FormInput compact label="R.M" select value={form.rm} onChange={(value) => updateField('rm', value)} options={['1', '2', '3', '4', '5', '6']} error={!!fieldErrors.rm} /></Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={0.75}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper variant="outlined" sx={{ overflow: 'hidden', borderColor: fieldErrors.lesiones ? '#d32f2f' : '#dbe3ee', bgcolor: '#f8fafc' }}>
              <Box sx={{ px: 1.25, py: 0.75, borderBottom: '1px solid #dbe3ee' }}>
                <SectionTitle compact sx={{ color: fieldErrors.lesiones ? '#d32f2f' : undefined }}>Ubique las lesiones *</SectionTitle>
                <Typography sx={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>
                  Toque una zona para marcarla. Puede seleccionar varias lesiones.
                </Typography>
              </Box>

              <Box
                  id="aph-body-visible"
                  sx={{
                    bgcolor: 'white',
                    width: { xs: '100%', sm: 540 },
                    maxWidth: '100%',
                    mx: 'auto',
                    p: 0,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                  }}
              >
                <InjuryCaptureForPdf selected={selectedInjuries} interactive onToggle={onToggleInjury} />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={0.75}>
              <FormInput compact requiredHint label="Descripción corta de lo ocurrido" multiline rows={4} maxLength={1000} value={form.hallazgos} onChange={(value) => updateField('hallazgos', value)} error={!!fieldErrors.hallazgos} helperText={fieldErrors.hallazgos ? 'Mínimo 100 caracteres' : undefined} excelRef="T: Descripcion_corta_de_lo_ocurrido_en_el_evento" devMode={devMode} />
              <FormInput compact label="Diagnosticos CIE 10" value={form.diagnosticos} onChange={(value) => updateField('diagnosticos', value)} error={!!fieldErrors.diagnosticos} />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
  )
}

function ProcedureTab({ selectedProcedures, onToggleProcedure, fieldErrors, devMode }: { selectedProcedures: string[]; onToggleProcedure: (procedure: string) => void; fieldErrors: Record<string, boolean>; devMode?: boolean }) {
  void devMode
  return (
      <Stack spacing={0.75}>
        <SectionTitle compact sx={{ color: fieldErrors.procedimientos ? '#d32f2f' : undefined }}>Procedimientos realizados *</SectionTitle>
        <Grid container spacing={0.25}>
          {procedures.map((procedure) => (
              <Grid key={procedure} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                <FormControlLabel
                    control={<Checkbox checked={selectedProcedures.includes(procedure)} onChange={() => onToggleProcedure(procedure)} />}
                    label={<Typography sx={{ fontWeight: 700, fontSize: 12 }}>{procedure}</Typography>}
                />
              </Grid>
          ))}
        </Grid>
      </Stack>
  )
}

function MaterialsTab({ form, updateField, fieldErrors, devMode }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean>; devMode?: boolean }) {
  void devMode
  return (
      <Stack spacing={0.75}>
        <SectionTitle compact>Materiales utilizados</SectionTitle>
        <FormInput compact label="Materiales y drogas" value={form.materiales} onChange={(value) => updateField('materiales', value)} error={!!fieldErrors.materiales} />
      </Stack>
  )
}

function CrewTab({ form, updateField, fieldErrors, devMode }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean>; devMode?: boolean }) {
  void devMode
  return (
      <Stack spacing={0.75}>
        <Grid container spacing={0.75}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionTitle compact>Datos de tripulacion</SectionTitle>
            <Stack spacing={0.75}>
              <FormInput compact label="Conductor" value={form.conductor} onChange={(value) => updateField('conductor', value)} error={!!fieldErrors.conductor} />
              <FormInput compact label="Doc. conductor" value={form.documentoConductor} onChange={(value) => updateField('documentoConductor', value)} error={!!fieldErrors.documentoConductor} />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <SectionTitle compact>&nbsp;</SectionTitle>
            <Stack spacing={0.75}>
              <FormInput compact label="Paramedico" value={form.paramedico} onChange={(value) => updateField('paramedico', value)} error={!!fieldErrors.paramedico} />
              <FormInput compact label="Doc. paramedico" value={form.documentoParamedico} onChange={(value) => updateField('documentoParamedico', value)} error={!!fieldErrors.documentoParamedico} />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <SectionTitle compact>Datos I.P.S. o prestador</SectionTitle>
            <Stack spacing={0.75}>
              <FormInput compact label="Medico y/o responsable I.P.S." value={form.medico} onChange={(value) => updateField('medico', value)} error={!!fieldErrors.medico} />
              <FormInput compact label="Doc. ID" value={form.documentoMedico} onChange={(value) => updateField('documentoMedico', value)} error={!!fieldErrors.documentoMedico} />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
  )
}

function VehicleTab({ form, updateField, fieldErrors, devMode }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean>; devMode?: boolean }) {
  const showPlaca = form.estadoAseguramiento === '2' || form.estadoAseguramiento === '4' || form.estadoAseguramiento === '6' || form.estadoAseguramiento === '7'
  const showCodigoAseguradora = form.estadoAseguramiento === '4' || form.estadoAseguramiento === '6'

  useEffect(() => {
    if (form.estadoAseguramiento === '3' || form.estadoAseguramiento === '8') {
      if (form.placaVehiculo) updateField('placaVehiculo', '')
    }
    if (!showCodigoAseguradora && form.codigoAseguradora) {
      updateField('codigoAseguradora', '')
    }
    if (!showCodigoAseguradora && form.numeroPolizaSoat) {
      updateField('numeroPolizaSoat', '')
    }
    if (!showCodigoAseguradora && form.fechaInicioVigencia) {
      updateField('fechaInicioVigencia', '')
    }
    if (!showCodigoAseguradora && form.fechaFinVigencia) {
      updateField('fechaFinVigencia', '')
    }
  }, [form.estadoAseguramiento, form.placaVehiculo, form.codigoAseguradora, form.numeroPolizaSoat, form.fechaInicioVigencia, form.fechaFinVigencia, showCodigoAseguradora])

  return (
      <Stack spacing={0.75}>
        <SectionTitle compact>Datos del vehículo</SectionTitle>
        <Grid container spacing={0.75}>
          {form.naturalezaEvento === '01' && (
              <>
                <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Estado de aseguramiento" select value={form.estadoAseguramiento} onChange={(value) => updateField('estadoAseguramiento', value)} options={aseguramientoOptions} excelRef="U: Estado_de_aseguramiento" devMode={devMode} /></Grid>
                {showPlaca && (
                    <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Placa Vehículo" alphanumeric maxLength={10} value={form.placaVehiculo} onChange={(value) => updateField('placaVehiculo', value)} error={!!fieldErrors.placaVehiculo} excelRef="V: Placa_vehiculo" devMode={devMode} /></Grid>
                )}
                <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Tipo de Vehículo" select value={form.tipoVehiculo} onChange={(value) => updateField('tipoVehiculo', value)} options={tipoVehiculoOptions} excelRef="W: Tipo_de_Vehiculo" devMode={devMode} /></Grid>
                {showCodigoAseguradora && (
                    <>
                      <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Código de la aseguradora" alphanumeric maxLength={6} value={form.codigoAseguradora} onChange={(value) => updateField('codigoAseguradora', value)} excelRef="X: Codigo_de_la_aseguradora" devMode={devMode} /></Grid>
                      <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Número de póliza SOAT" alphanumeric maxLength={20} value={form.numeroPolizaSoat} onChange={(value) => updateField('numeroPolizaSoat', value)} excelRef="Y: Numero_de_poliza_SOAT" devMode={devMode} /></Grid>
                      <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Inicio vigencia SOAT" type="date" value={form.fechaInicioVigencia} onChange={(value) => updateField('fechaInicioVigencia', value)} excelRef="Z: Fecha_de_inicio_de_vigencia_de_la_poliza" devMode={devMode} /></Grid>
                      <Grid size={{ xs: 12, md: 2 }}><FormInput compact requiredHint label="Fin vigencia SOAT" type="date" value={form.fechaFinVigencia} onChange={(value) => updateField('fechaFinVigencia', value)} excelRef="AA: Fecha_final_de_vigencia_de_la_poliza" devMode={devMode} /></Grid>
                    </>
                )}
                <Grid size={{ xs: 12, md: 3 }}><FormInput compact label="Número de radicado SIRAS" alphanumeric maxLength={20} value={form.numeroRadicadoSiras} onChange={(value) => updateField('numeroRadicadoSiras', value)} excelRef="AB: Numero_de_radicado_SIRAS" devMode={devMode} /></Grid>
              </>
          )}
        </Grid>
      </Stack>
  )
}

function OwnerTab({ form, updateField, fieldErrors, devMode }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean>; devMode?: boolean }) {
  const showOwnerDocs = form.naturalezaEvento === '01' && (form.estadoAseguramiento === '2' || form.estadoAseguramiento === '4' || form.estadoAseguramiento === '6' || form.estadoAseguramiento === '8')
  const showOwnerResidenceFields = showOwnerDocs && form.tipoDocumentoPropietario !== 'NI'

  useEffect(() => {
    if (!showOwnerDocs) {
      if (form.tipoDocumentoPropietario) updateField('tipoDocumentoPropietario', '')
      if (form.numeroDocumentoPropietario) updateField('numeroDocumentoPropietario', '')
      if (form.segundoNombrePropietario) updateField('segundoNombrePropietario', '')
      if (form.primerApellidoPropietario) updateField('primerApellidoPropietario', '')
      if (form.segundoApellidoPropietario) updateField('segundoApellidoPropietario', '')
      if (form.direccionResidenciaPropietario) updateField('direccionResidenciaPropietario', '')
      if (form.telefonoResidenciaPropietario) updateField('telefonoResidenciaPropietario', '')
      if (form.codigoMunicipioResidenciaPropietario) updateField('codigoMunicipioResidenciaPropietario', '')
    }
    if (form.tipoDocumentoPropietario === 'NI') {
      if (form.direccionResidenciaPropietario) updateField('direccionResidenciaPropietario', '')
      if (form.telefonoResidenciaPropietario) updateField('telefonoResidenciaPropietario', '')
      if (form.codigoMunicipioResidenciaPropietario) updateField('codigoMunicipioResidenciaPropietario', '')
    }
  }, [form.estadoAseguramiento, form.naturalezaEvento, form.tipoDocumentoPropietario, form.numeroDocumentoPropietario, form.segundoNombrePropietario, form.primerApellidoPropietario, form.segundoApellidoPropietario, form.direccionResidenciaPropietario, form.telefonoResidenciaPropietario, form.codigoMunicipioResidenciaPropietario, showOwnerDocs])

  return (
      <Stack spacing={0.75}>
        <SectionTitle compact>Datos del propietario</SectionTitle>
        <Grid container spacing={0.75}>
          {showOwnerDocs && (
              <>
                <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Tipo doc. propietario" select value={form.tipoDocumentoPropietario} onChange={(value) => updateField('tipoDocumentoPropietario', value)} options={tipoDocumentoPropietarioOptions} excelRef="AD: Tipo_de_documento_de_identidad_del_propietario" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint label="Número doc. propietario" alphanumeric maxLength={20} value={form.numeroDocumentoPropietario} onChange={(value) => updateField('numeroDocumentoPropietario', value)} excelRef="AE: Numero_de_documento_de_identidad_del_propietario" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><FormInput compact requiredHint label="Primer nombre / Razón social" maxLength={30} value={form.primerNombrePropietario} onChange={(value) => updateField('primerNombrePropietario', value)} error={!!fieldErrors.primerNombrePropietario} excelRef="AF: Primer_nombre_del_propietario_o_razon_social" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><FormInput compact lettersOnly maxLength={30} label="Segundo nombre del propietario" value={form.segundoNombrePropietario} onChange={(value) => updateField('segundoNombrePropietario', value)} excelRef="AG: Segundo_nombre_del_propietario" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><FormInput compact lettersOnly maxLength={30} label="Primer apellido del propietario" value={form.primerApellidoPropietario} onChange={(value) => updateField('primerApellidoPropietario', value)} excelRef="AH: Primer_apellido_del_propietario" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><FormInput compact lettersOnly maxLength={30} label="Segundo apellido del propietario" value={form.segundoApellidoPropietario} onChange={(value) => updateField('segundoApellidoPropietario', value)} excelRef="AI: Segundo_apellido_del_propietario" devMode={devMode} /></Grid>
                {showOwnerResidenceFields && (
                    <>
                      <Grid size={{ xs: 12, md: 6 }}><FormInput compact requiredHint address maxLength={100} label="Dirección de residencia del propietario" value={form.direccionResidenciaPropietario} onChange={(value) => updateField('direccionResidenciaPropietario', value)} error={!!fieldErrors.direccionResidenciaPropietario} excelRef="AJ: Direccion_de_residencia_del_propietario" devMode={devMode} /></Grid>
                      <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint numeric maxLength={10} label="Teléfono de residencia del propietario" value={form.telefonoResidenciaPropietario} onChange={(value) => updateField('telefonoResidenciaPropietario', value)} error={!!fieldErrors.telefonoResidenciaPropietario} excelRef="AK: Telefono_de_residencia_del_propietario" devMode={devMode} /></Grid>
                      <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint select label="Código municipio residencia propietario" value={form.codigoMunicipioResidenciaPropietario} onChange={(value) => updateField('codigoMunicipioResidenciaPropietario', value)} options={municipioOptions} error={!!fieldErrors.codigoMunicipioResidenciaPropietario} excelRef="AL: Codigo_del_municipio_de_residencia_del_propietario" devMode={devMode} /></Grid>
                    </>
                )}
              </>
          )}
        </Grid>
      </Stack>
  )
}

function DriverTab({ form, updateField, fieldErrors, devMode }: { form: AphForm; updateField: (field: keyof AphForm, value: string) => void; fieldErrors: Record<string, boolean>; devMode?: boolean }) {
  const showDriverDocs = form.naturalezaEvento === '01' && (form.estadoAseguramiento === '2' || form.estadoAseguramiento === '4' || form.estadoAseguramiento === '6' || form.estadoAseguramiento === '7' || form.estadoAseguramiento === '8')

  useEffect(() => {
    if (!showDriverDocs) {
      if (form.tipoDocumentoConductorVehiculo) updateField('tipoDocumentoConductorVehiculo', '')
      if (form.numeroDocumentoConductorVehiculo) updateField('numeroDocumentoConductorVehiculo', '')
      if (form.primerNombreConductorVehiculo) updateField('primerNombreConductorVehiculo', '')
      if (form.segundoNombreConductorVehiculo) updateField('segundoNombreConductorVehiculo', '')
      if (form.primerApellidoConductorVehiculo) updateField('primerApellidoConductorVehiculo', '')
      if (form.segundoApellidoConductorVehiculo) updateField('segundoApellidoConductorVehiculo', '')
      if (form.codigoMunicipioResidenciaConductorVehiculo) updateField('codigoMunicipioResidenciaConductorVehiculo', '')
      if (form.direccionResidenciaConductorVehiculo) updateField('direccionResidenciaConductorVehiculo', '')
      if (form.telefonoResidenciaConductorVehiculo) updateField('telefonoResidenciaConductorVehiculo', '')
    }
  }, [form.naturalezaEvento, form.estadoAseguramiento, form.tipoDocumentoConductorVehiculo, form.numeroDocumentoConductorVehiculo, form.primerNombreConductorVehiculo, form.segundoNombreConductorVehiculo, form.primerApellidoConductorVehiculo, form.segundoApellidoConductorVehiculo, form.codigoMunicipioResidenciaConductorVehiculo, form.direccionResidenciaConductorVehiculo, form.telefonoResidenciaConductorVehiculo, showDriverDocs])

  return (
      <Stack spacing={0.75}>
        <SectionTitle compact>Datos del conductor</SectionTitle>
        <Grid container spacing={0.75}>
          {showDriverDocs && (
              <>
                <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint select label="Tipo doc. conductor" value={form.tipoDocumentoConductorVehiculo} onChange={(value) => updateField('tipoDocumentoConductorVehiculo', value)} options={tipoDocumentoConductorOptions} error={!!fieldErrors.tipoDocumentoConductorVehiculo} excelRef="AM: Tipo_de_documento_de_identidad_del_conductor" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint alphanumeric maxLength={20} label="Número doc. conductor" value={form.numeroDocumentoConductorVehiculo} onChange={(value) => updateField('numeroDocumentoConductorVehiculo', value)} error={!!fieldErrors.numeroDocumentoConductorVehiculo} excelRef="AN: Numero_de_documento_de_identidad_del_conductor" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><FormInput compact requiredHint lettersOnly maxLength={30} label="Primer nombre del conductor" value={form.primerNombreConductorVehiculo} onChange={(value) => updateField('primerNombreConductorVehiculo', value)} error={!!fieldErrors.primerNombreConductorVehiculo} excelRef="AO: Primer_nombre_del_conductor" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><FormInput compact requiredHint lettersOnly maxLength={30} label="Segundo nombre del conductor" value={form.segundoNombreConductorVehiculo} onChange={(value) => updateField('segundoNombreConductorVehiculo', value)} error={!!fieldErrors.segundoNombreConductorVehiculo} excelRef="AP: Segundo_nombre_del_conductor" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><FormInput compact requiredHint lettersOnly maxLength={30} label="Primer apellido del conductor" value={form.primerApellidoConductorVehiculo} onChange={(value) => updateField('primerApellidoConductorVehiculo', value)} error={!!fieldErrors.primerApellidoConductorVehiculo} excelRef="AQ: Primer_apellido_del_conductor" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><FormInput compact requiredHint lettersOnly maxLength={30} label="Segundo apellido del conductor" value={form.segundoApellidoConductorVehiculo} onChange={(value) => updateField('segundoApellidoConductorVehiculo', value)} error={!!fieldErrors.segundoApellidoConductorVehiculo} excelRef="AR: Segundo_apellido_del_conductor" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint select label="Código municipio residencia conductor" value={form.codigoMunicipioResidenciaConductorVehiculo} onChange={(value) => updateField('codigoMunicipioResidenciaConductorVehiculo', value)} options={municipioOptions} error={!!fieldErrors.codigoMunicipioResidenciaConductorVehiculo} excelRef="AS: Codigo_del_municipio_de_residencia_del_conductor" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><FormInput compact requiredHint address maxLength={100} label="Dirección de residencia del conductor" value={form.direccionResidenciaConductorVehiculo} onChange={(value) => updateField('direccionResidenciaConductorVehiculo', value)} error={!!fieldErrors.direccionResidenciaConductorVehiculo} excelRef="AT: Direccion_de_residencia_del_conductor" devMode={devMode} /></Grid>
                <Grid size={{ xs: 12, md: 3 }}><FormInput compact requiredHint numeric maxLength={10} label="Teléfono de residencia del conductor" value={form.telefonoResidenciaConductorVehiculo} onChange={(value) => updateField('telefonoResidenciaConductorVehiculo', value)} error={!!fieldErrors.telefonoResidenciaConductorVehiculo} excelRef="AU: Telefono_de_residencia_del_conductor" devMode={devMode} /></Grid>
              </>
          )}
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
                     maxLength,
                     alphanumeric = false,
                     lettersOnly = false,
                     address = false,
                     numeric = false,
                     excelRef,
                     devMode = false,
                     helperText,
                   }: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  select?: boolean
  options?: readonly (string | { value: string; label: string })[]
  multiline?: boolean
  rows?: number
  error?: boolean
  compact?: boolean
  requiredHint?: boolean
  maxLength?: number
  alphanumeric?: boolean
  lettersOnly?: boolean
  address?: boolean
  numeric?: boolean
  excelRef?: string
  devMode?: boolean
  helperText?: string
}) {
  const handleChange = (raw: string) => {
    let val = raw
    if (alphanumeric) val = val.replace(/[^a-zA-Z0-9]/g, '')
    if (lettersOnly) val = val.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s-]/g, '')
    if (address) val = val.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s#\-.()/]/g, '')
    if (numeric) val = val.replace(/\D/g, '')
    if (maxLength !== undefined && val.length > maxLength) val = val.slice(0, maxLength)
    onChange(val)
  }

  const slotProps = (() => {
    const props: Record<string, unknown> = {}
    if (type === 'date' || type === 'time') {
      props.inputLabel = { shrink: true }
    }
    if (maxLength !== undefined) {
      props.htmlInput = { maxLength }
    }
    return Object.keys(props).length > 0 ? props : undefined
  })()

  const metadata = [maxLength !== undefined ? `${value.length}/${maxLength}` : undefined, devMode && excelRef ? excelRef : undefined]
    .filter(Boolean)
    .join(' • ')
  const resolvedHelperText = error
    ? [helperText || 'Campo obligatorio', metadata || undefined].filter(Boolean).join(' • ')
    : helperText || metadata || undefined

  return (
      <TextField
          fullWidth
          label={requiredHint ? `${label} *` : label}
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          type={type}
          select={select}
          multiline={multiline}
          rows={rows}
          error={error}
          size="small"
          helperText={resolvedHelperText}
          slotProps={slotProps}
          sx={{
            '& .MuiInputLabel-root': {
              fontWeight: 800,
              fontSize: { xs: 11.5, md: 11 },
              color: error ? '#d32f2f' : '#334155',
            },
            '& .MuiOutlinedInput-root': {
              bgcolor: '#f8fafc',
              borderRadius: 1.35,
              minHeight: multiline ? undefined : compact ? { xs: 34, md: 31 } : { xs: 36, md: 33 },
              '& fieldset': {
                borderColor: '#cbd5e1',
              },
              '&:hover fieldset': {
                borderColor: '#94a3b8',
              },
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? '#d32f2f' : '#075db8',
              borderWidth: 1.3,
            },
            '& .MuiInputBase-input': {
              py: multiline ? 0.8 : compact ? { xs: 0.55, md: 0.35 } : { xs: 0.65, md: 0.45 },
              px: 1.05,
              fontSize: { xs: 12.5, md: 12 },
              lineHeight: 1.2,
            },
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiFormHelperText-root': {
              mt: 0.2,
              ml: 0.4,
              fontSize: 10,
              fontWeight: 700,
            },
          }}
      >
        {options.map((option) => {
          const val = typeof option === 'string' ? option : option.value
          const lbl = typeof option === 'string' ? option : option.label
          return (
            <MenuItem key={val} value={val} sx={{ fontSize: 12, whiteSpace: 'normal' }}>
              {typeof option === 'string' ? option : `${val} - ${lbl}`}
            </MenuItem>
          )
        })}
      </TextField>
  )
}
function SectionTitle({ children, sx, compact = false }: { children: ReactNode; sx?: Record<string, unknown>; compact?: boolean }) {
  return (
      <Typography
          variant="h6"
          sx={{
            color: '#0073f0',
            fontWeight: 900,
            textTransform: 'uppercase',
            fontSize: compact ? 11 : 12,
            lineHeight: 1,
            mb: compact ? 0.25 : 0.5,
            letterSpacing: '-0.01em',
            ...sx,
          }}
      >
        {children}
      </Typography>
  )
}

function InjuryCaptureForPdf({
                               selected,
                               interactive = false,
                               onToggle,
                             }: {
  selected: string[]
  interactive?: boolean
  onToggle?: (area: string) => void
}) {
  return (
      <Box
          sx={{
            width: 540,
            minHeight: 335,
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'visible',
            px: 1,
            pt: 0,
            pb: 1,
          }}
      >
        <Box
            sx={{
              width: 430,
              height: 265,
              bgcolor: 'white',
              overflow: 'visible',
            }}
        >
          <AnatomicalBodySelector
              selected={selected}
              onToggle={onToggle || (() => undefined)}
              interactive={interactive}
          />
        </Box>

        <InjuryLabels selected={selected} />
      </Box>
  )
}

function InjuryLabels({ selected }: { selected: string[] }) {
  if (selected.length === 0) {
    return null
  }

  return (
      <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 0.75,
            mt: 0.5,
            px: 1,
          }}
      >
        {selected.map((area) => (
            <Box
                key={area}
                sx={{
                  px: 1.1,
                  py: 0.45,
                  borderRadius: 999,
                  bgcolor: '#dc2626',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                }}
            >
              {formatInjuryLabel(area)}
            </Box>
        ))}
      </Box>
  )
}

function AnatomicalBodySelector({
                                  selected,
                                  onToggle,
                                  interactive = true,
                                }: {
  selected: string[]
  onToggle: (area: string) => void
  interactive?: boolean
}) {
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
    if (!interactive || !part.slug) return
    onToggle(makeInjuryKey(view, part.slug, side))
  }

  return (
      <Box
          sx={{
            width: '100%',
            height: 265,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            justifyItems: 'center',
            gap: 3,
            px: 1,
            py: 0,
            bgcolor: 'white',
            overflow: 'visible',
          }}
      >
        {(['front', 'back'] as const).map((view) => (
            <Box
                key={view}
                sx={{
                  width: 180,
                  height: 255,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'visible',
                  '& svg': {
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    overflow: 'visible',
                  },
                  '& path': {
                    transition: 'fill 140ms ease',
                  },
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

function PdfPreview({ form, injuries, procedures }: { form: AphForm; injuries: string[]; procedures: string[] }) {
  const fullNameValue = [form.primerNombre, form.segundoNombre, form.primerApellido, form.segundoApellido].filter(Boolean).join(' ')

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
            ['Tipo ID', form.tipoDocumento || 'CC', 'Identificacion', form.documento],
            ['Nombres y Apellidos', fullNameValue, 'Sexo', form.sexo],
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
          <Typography sx={{ fontSize: 9, minHeight: 18 }}>{injuries.map(formatInjuryLabel).join(', ') || 'Sin lesiones seleccionadas'}</Typography>

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

function PreviewBar({ children }: { children: ReactNode }) {
  return (
      <Box sx={{ bgcolor: '#9ca3af', color: '#111827', textAlign: 'center', fontSize: 9, fontWeight: 800, mt: 1, py: 0.2 }}>
        {children}
      </Box>
  )
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
