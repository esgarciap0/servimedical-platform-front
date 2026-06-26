import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh', px: 2 }}>
      <Stack spacing={1.5} sx={{ textAlign: 'center', maxWidth: 480 }}>
        <Typography sx={{ fontSize: 64, fontWeight: 900, color: 'primary.main', lineHeight: 1 }}>
          404
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
          Pagina no encontrada
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          La ruta que intentas abrir no existe o el modulo aun no esta disponible.
        </Typography>
        <Box>
          <Button variant="contained" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
