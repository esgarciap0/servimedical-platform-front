import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Link as RouterLink } from 'react-router-dom'
import { AddBoxIcon, CloseIcon, EditIcon } from '../icons/AppIcons'
import DeleteIcon from '@mui/icons-material/Delete'
import { ambulanciaService } from '../services/ambulanciaService'
import { ApiError } from '../services/api'
import type { AmbulanciaForm, AmbulanciaResponse } from '../types/ambulancia'

const emptyForm: AmbulanciaForm = {
  movil: '',
  placa: '',
  conductor: '',
  documentoConductor: '',
  paramedico: '',
  documentoParamedico: '',
  tipoTraslado: '',
}

export function Ambulancias() {
  const [rows, setRows] = useState<AmbulanciaResponse[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<AmbulanciaForm>(emptyForm)
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'error' | 'success' } | null>(null)

  const fetchData = async () => {
    try {
      const data = await ambulanciaService.list()
      setRows(data)
    } catch {
      setSnackbar({ message: 'Error al cargar ambulancias', severity: 'error' })
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleOpen = () => {
    setForm(emptyForm)
    setEditId(null)
    setOpen(true)
  }

  const handleEdit = (row: AmbulanciaResponse) => {
    setForm({
      movil: row.movil || '',
      placa: row.placa || '',
      conductor: row.conductor || '',
      documentoConductor: row.documentoConductor || '',
      paramedico: row.paramedico || '',
      documentoParamedico: row.documentoParamedico || '',
      tipoTraslado: row.tipoTraslado || '',
    })
    setEditId(row.id)
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await ambulanciaService.remove(id)
      setSnackbar({ message: 'Ambulancia eliminada', severity: 'success' })
      fetchData()
    } catch {
      setSnackbar({ message: 'Error al eliminar', severity: 'error' })
    }
  }

  const handleSave = async () => {
    if (!form.movil.trim() || !form.placa.trim()) {
      setSnackbar({ message: 'Móvil y Placa son obligatorios', severity: 'error' })
      return
    }

    try {
      if (editId) {
        await ambulanciaService.update(editId, form)
      } else {
        await ambulanciaService.create(form)
      }
      setOpen(false)
      setSnackbar({ message: 'Ambulancia guardada exitosamente', severity: 'success' })
      fetchData()
    } catch (error) {
      if (error instanceof ApiError) {
        setSnackbar({ message: error.message, severity: 'error' })
      } else {
        setSnackbar({ message: 'Error de red', severity: 'error' })
      }
    }
  }

  const updateField = (field: keyof AmbulanciaForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const columns: GridColDef[] = [
    { field: 'movil', headerName: 'Móvil', width: 100 },
    { field: 'placa', headerName: 'Placa', width: 120 },
    { field: 'conductor', headerName: 'Conductor', flex: 1 },
    { field: 'documentoConductor', headerName: 'Doc. Conductor', width: 140 },
    { field: 'paramedico', headerName: 'Paramédico', flex: 1 },
    { field: 'documentoParamedico', headerName: 'Doc. Paramédico', width: 140 },
    { field: 'tipoTraslado', headerName: 'Tipo Traslado', width: 130 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">Inicio</Link>
        <Typography color="text.primary">Ambulancias</Typography>
      </Breadcrumbs>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Ambulancias / Móviles</Typography>
        <Button variant="contained" startIcon={<AddBoxIcon />} onClick={handleOpen}>
          Nueva Ambulancia
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Paper sx={{ height: 500 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              disableRowSelectionOnClick
            />
          </Paper>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editId ? 'Editar Ambulancia' : 'Nueva Ambulancia'}
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Móvil *" value={form.movil} onChange={(e) => updateField('movil', e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Placa *" value={form.placa} onChange={(e) => updateField('placa', e.target.value)} inputProps={{ maxLength: 7 }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Conductor" value={form.conductor} onChange={(e) => updateField('conductor', e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Documento Conductor" value={form.documentoConductor} onChange={(e) => updateField('documentoConductor', e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Paramédico" value={form.paramedico} onChange={(e) => updateField('paramedico', e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Documento Paramédico" value={form.documentoParamedico} onChange={(e) => updateField('documentoParamedico', e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Tipo Traslado" value={form.tipoTraslado} onChange={(e) => updateField('tipoTraslado', e.target.value)} select SelectProps={{ native: true }}>
                <option value="">Seleccionar</option>
                <option value="BASICO">Básico</option>
                <option value="MEDICALIZADO">Medicalizado</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar?.severity} onClose={() => setSnackbar(null)} sx={{ width: '100%' }}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
