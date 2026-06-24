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
        <Card>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Stack spacing={3} sx={{ alignItems: 'flex-start' }}>
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 5,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'rgba(15,111,222,0.1)',
                            color: 'primary.main',
                        }}
                    >
                        <Icon fontSize="large" />
                    </Box>

                    <Box>
                        <Chip icon={<ConstructionIcon />} label="Modulo en construccion" sx={{ mb: 2 }} />
                        <Typography variant="h4">{module.name}</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 720 }}>
                            {module.description}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            borderRadius: 5,
                            p: { xs: 3, md: 4 },
                            bgcolor: '#f4f7fb',
                            border: '1px dashed rgba(15,111,222,0.24)',
                        }}
                    >
                        <Typography variant="h6">Modulo en construccion</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Este espacio queda preparado para integrar formularios, tablas, reportes y flujos del
                            modulo.
                        </Typography>
                    </Box>

                    <Button variant="contained" onClick={() => navigate('/')}>
                        Volver al dashboard
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}
