import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { modules } from '../data/modules'

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Navegacion por modulos
        </Typography>
        <Grid container spacing={2}>
          {modules.map((module) => {
            const Icon = module.icon

            return (
              <Grid key={module.path} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    '&:active': { bgcolor: 'action.selected' },
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(module.path)}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box
                      sx={{
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        borderRadius: 3,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(15,111,222,0.1)',
                        color: 'primary.main',
                        mb: 1.5,
                      }}
                    >
                      <Icon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </Box>
                    <Typography variant={window.innerWidth < 600 ? 'subtitle1' : 'h6'}>
                      {module.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: 13, sm: 14 } }}>
                      {module.description}
                    </Typography>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      size="small"
                      sx={{ mt: 1.5 }}
                      onClick={(e) => { e.stopPropagation(); navigate(module.path) }}
                    >
                      Abrir modulo
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Stack>
  )
}
