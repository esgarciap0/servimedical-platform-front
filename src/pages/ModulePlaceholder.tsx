import { ConstructionIcon } from '../icons/AppIcons'
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { modules } from '../data/modules'

export function ModulePlaceholder() {
    const { modulePath } = useParams()
    const navigate = useNavigate()
    const module = modules.find((item) => item.path === `/${modulePath}`)

    if (!module) {
        return null
    }

    const Icon = module.icon

    return (
        <Card
            elevation={0}
            sx={{
                maxWidth: 980,
                mx: 'auto',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
            }}
        >
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'rgba(15,111,222,0.1)',
                            color: 'primary.main',
                            '& svg': {
                                fontSize: 21,
                            },
                        }}
                    >
                        <Icon />
                    </Box>

                    <Box>
                        <Chip
                            icon={<ConstructionIcon sx={{ fontSize: 15 }} />}
                            label="Modulo en construccion"
                            size="small"
                            sx={{
                                mb: 1,
                                height: 24,
                                fontSize: 11.5,
                                fontWeight: 700,
                                bgcolor: '#f1f5f9',
                                color: '#334155',
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: { xs: 20, md: 22 },
                                fontWeight: 900,
                                lineHeight: 1.1,
                                letterSpacing: '-0.03em',
                                color: '#0f172a',
                            }}
                        >
                            {module.name}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                maxWidth: 680,
                                fontSize: { xs: 12.5, md: 13 },
                                lineHeight: 1.35,
                                color: '#475569',
                            }}
                        >
                            {module.description}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            px: { xs: 1.5, md: 1.75 },
                            py: { xs: 1.4, md: 1.6 },
                            bgcolor: '#f8fafc',
                            border: '1px dashed rgba(15,111,222,0.24)',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: 14, md: 15 },
                                fontWeight: 900,
                                color: '#0f172a',
                                lineHeight: 1.2,
                            }}
                        >
                            Modulo en construccion
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.45,
                                fontSize: { xs: 12.5, md: 13 },
                                lineHeight: 1.35,
                                color: '#475569',
                            }}
                        >
                            Este espacio queda preparado para integrar formularios, tablas, reportes y flujos del modulo.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate('/')}
                        sx={{
                            minHeight: 30,
                            px: 1.4,
                            fontSize: 12,
                            fontWeight: 800,
                            borderRadius: 1.5,
                            boxShadow: '0 4px 10px rgba(7, 93, 184, 0.22)',
                        }}
                    >
                        Volver al dashboard
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}