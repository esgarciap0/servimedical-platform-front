import { ArrowForwardIcon } from '../icons/AppIcons'
import {
  Box,
  Card,
  CardActionArea,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { modules } from '../data/modules'

export function Dashboard() {
  const navigate = useNavigate()

  return (
      <Stack spacing={1.25}>
        <Box>
          <Typography
              sx={{
                fontSize: { xs: 15, md: 16 },
                fontWeight: 900,
                mb: 1.2,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
          >
            Navegacion por modulos
          </Typography>

          <Grid container spacing={1.15}>
            {modules.map((module) => {
              const Icon = module.icon

              return (
                  <Grid key={module.path} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                    <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          borderRadius: 2,
                          border: '1px solid #e2e8f0',
                          bgcolor: '#ffffff',
                          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
                          overflow: 'hidden',
                        }}
                    >
                      <CardActionArea
                          onClick={() => navigate(module.path)}
                          sx={{
                            height: '100%',
                            minHeight: 128,
                            p: { xs: 1.25, md: 1.35 },
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                          }}
                      >
                        <Box sx={{ width: '100%', minWidth: 0 }}>
                          <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 2,
                                display: 'grid',
                                placeItems: 'center',
                                bgcolor: 'rgba(15,111,222,0.1)',
                                color: 'primary.main',
                                mb: 1,
                                '& svg': {
                                  fontSize: 18,
                                },
                              }}
                          >
                            <Icon />
                          </Box>

                          <Typography
                              sx={{
                                fontSize: { xs: 14.5, md: 15.5 },
                                fontWeight: 900,
                                color: '#0f172a',
                                lineHeight: 1.15,
                                mb: 0.45,
                                letterSpacing: '-0.02em',
                              }}
                          >
                            {module.name}
                          </Typography>

                          <Typography
                              sx={{
                                color: '#334155',
                                fontSize: { xs: 12, md: 12.3 },
                                lineHeight: 1.3,
                                minHeight: 32,
                                mb: 0.8,
                              }}
                          >
                            {module.description}
                          </Typography>

                          <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.6,
                                color: 'primary.main',
                                fontSize: 12,
                                fontWeight: 800,
                                lineHeight: 1,
                              }}
                          >
                            Abrir modulo
                            <ArrowForwardIcon sx={{ fontSize: 16 }} />
                          </Box>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
              )
            })}
          </Grid>
        </Box>
      </Stack>
  )
}