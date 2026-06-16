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
    <Stack spacing={4}>
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Navegacion por modulos
        </Typography>
        <Grid container spacing={3}>
          {modules.map((module) => {
            const Icon = module.icon

            return (
              <Grid key={module.path} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(15,111,222,0.1)',
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography variant="h6">{module.name}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, minHeight: 48 }}>
                      {module.description}
                    </Typography>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(module.path)}
                      sx={{ mt: 2 }}
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
