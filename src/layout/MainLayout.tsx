import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CloseIcon, DashboardIcon, MenuIcon, NotificationsNoneIcon } from '../icons/AppIcons'
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { modules } from '../data/modules'
import logo from '../assets/app-256.png'

const expandedWidth = 202
const collapsedWidth = 54
const headerHeight = 48

export function MainLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const sidebarCollapsed = !isMobile && collapsed
    const drawerWidth = sidebarCollapsed ? collapsedWidth : expandedWidth

    const isActive = (path: string) => location.pathname === path
    const currentTitle =
        location.pathname === '/'
            ? 'Inicio'
            : modules.find((module) => module.path === location.pathname)?.name ?? 'Inicio'

    const closeMobileDrawer = () => {
        if (isMobile) {
            setMobileOpen(false)
        }
    }

    const sidebarContent = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: '#ffffff',
            }}
        >
            <Box
                sx={{
                    height: headerHeight,
                    px: sidebarCollapsed ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    borderBottom: '1px solid #e5e7eb',
                }}
            >
                {isMobile && (
                    <IconButton size="small" onClick={() => setMobileOpen(false)} sx={{ mr: 0.25 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}

                <Box
                    component="img"
                    src={logo}
                    alt="Servimedical"
                    sx={{
                        width: sidebarCollapsed ? 30 : 34,
                        height: sidebarCollapsed ? 30 : 34,
                        objectFit: 'contain',
                        flexShrink: 0,
                    }}
                />

                {!sidebarCollapsed && (
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                color: 'primary.main',
                                fontSize: 15,
                                fontWeight: 900,
                                lineHeight: 1.05,
                                letterSpacing: '-0.02em',
                            }}
                            noWrap
                        >
                            Servimedical
                        </Typography>

                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: 10.5,
                                lineHeight: 1.1,
                            }}
                            noWrap
                        >
                            Platform
                        </Typography>
                    </Box>
                )}
            </Box>

            <Divider />

            <List sx={{ px: 0.5, py: 0.75, flex: 1 }}>
                <Tooltip title={sidebarCollapsed ? 'Dashboard' : ''} placement="right">
                    <ListItemButton
                        selected={isActive('/')}
                        onClick={() => {
                            navigate('/')
                            closeMobileDrawer()
                        }}
                        sx={navItemStyles(sidebarCollapsed)}
                    >
                        <ListItemIcon sx={navIconStyles}>
                            <DashboardIcon />
                        </ListItemIcon>

                        {!sidebarCollapsed && <ListItemText primary="Dashboard" />}
                    </ListItemButton>
                </Tooltip>

                {modules.map((module) => {
                    const Icon = module.icon

                    return (
                        <Tooltip key={module.path} title={sidebarCollapsed ? module.name : ''} placement="right">
                            <ListItemButton
                                selected={isActive(module.path)}
                                onClick={() => {
                                    navigate(module.path)
                                    closeMobileDrawer()
                                }}
                                sx={navItemStyles(sidebarCollapsed)}
                            >
                                <ListItemIcon sx={navIconStyles}>
                                    <Icon />
                                </ListItemIcon>

                                {!sidebarCollapsed && <ListItemText primary={module.name} />}
                            </ListItemButton>
                        </Tooltip>
                    )
                })}
            </List>

            {!sidebarCollapsed && (
                <Box sx={{ px: 0.75, pb: 0.75 }}>
                    <Box
                        sx={{
                            px: 1,
                            py: 0.85,
                            borderRadius: 1.75,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 10,
                                color: '#64748b',
                                lineHeight: 1,
                            }}
                        >
                            Version
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.35,
                                fontSize: 11.5,
                                color: '#334155',
                                fontWeight: 800,
                                lineHeight: 1.1,
                            }}
                        >
                            1.0.0
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    )

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: expandedWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {sidebarContent}
                </Drawer>
            ) : (
                <Box
                    component="aside"
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: drawerWidth,
                        bgcolor: '#ffffff',
                        color: 'text.secondary',
                        borderRight: '1px solid #e2e8f0',
                        boxShadow: '4px 0 16px rgba(15, 36, 75, 0.08)',
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: 'width 180ms ease',
                        zIndex: 1200,
                    }}
                >
                    {sidebarContent}
                </Box>
            )}

            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    ml: { md: `${drawerWidth}px` },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: '#ffffff',
                    color: 'text.primary',
                    borderBottom: '1px solid #e2e8f0',
                    boxShadow: 'none',
                    transition: 'width 180ms ease, margin-left 180ms ease',
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: `${headerHeight}px !important`,
                        px: { xs: 1, md: 1.25 },
                        gap: { xs: 0.75, md: 1 },
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={() => (isMobile ? setMobileOpen(true) : setCollapsed((value) => !value))}
                        color="inherit"
                    >
                        <MenuIcon fontSize="small" />
                    </IconButton>

                    <Typography
                        color="text.secondary"
                        noWrap
                        sx={{
                            fontSize: 13,
                            fontWeight: 600,
                            lineHeight: 1.2,
                        }}
                    >
                        {currentTitle}
                    </Typography>

                    <Box sx={{ flex: 1 }} />

                    <IconButton color="inherit" size="small">
                        <NotificationsNoneIcon fontSize="small" />
                    </IconButton>

                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: 30,
                            height: 30,
                            fontSize: 13,
                            fontWeight: 800,
                        }}
                    >
                        AD
                    </Avatar>
                </Toolbar>
            </AppBar>

            <Box
                component="main"
                sx={{
                    ml: { md: `${drawerWidth}px` },
                    minHeight: '100vh',
                    px: { xs: 1, sm: 1.25, md: 1.25 },
                    pt: { xs: `${headerHeight + 8}px`, md: `${headerHeight + 14}px` },
                    pb: 3,
                    transition: 'margin-left 180ms ease',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}

function navItemStyles(collapsed: boolean) {
    return {
        minHeight: 32,
        mb: 0.15,
        px: collapsed ? 0.35 : 0.65,
        py: 0,
        borderRadius: 1.25,
        color: '#667085',
        justifyContent: collapsed ? 'center' : 'flex-start',
        fontWeight: 650,
        boxSizing: 'border-box',

        '& .MuiListItemText-root': {
            my: 0,
        },

        '& .MuiListItemText-primary': {
            fontSize: 12,
            fontWeight: 650,
            lineHeight: 1.15,
        },

        '&.Mui-selected': {
            bgcolor: 'rgba(7, 93, 184, 0.08)',
            color: '#075db8',
            borderLeft: '2px solid #f0142f',

            '& .MuiListItemIcon-root': {
                color: '#075db8',
            },
        },

        '&.Mui-selected:hover, &:hover': {
            bgcolor: 'rgba(7, 93, 184, 0.08)',
            color: '#075db8',
        },
    }
}

const navIconStyles = {
    minWidth: 28,
    color: 'inherit',
    justifyContent: 'center',

    '& svg': {
        fontSize: 18,
    },
}