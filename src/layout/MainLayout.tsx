import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AppsIcon from '@mui/icons-material/Apps'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { modules } from '../data/modules'
import logo from '../assets/app-256.png'

const expandedWidth = 262
const collapsedWidth = 78
const headerHeight = 64
const footerHeight = 58

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const drawerWidth = collapsed ? collapsedWidth : expandedWidth

  const isActive = (path: string) => location.pathname === path
  const currentTitle =
    location.pathname === '/'
      ? 'Inicio'
      : modules.find((module) => module.path === location.pathname)?.name ?? 'Inicio'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="aside"
        sx={{
          position: 'fixed',
          inset: 0,
          width: drawerWidth,
          bgcolor: '#ffffff',
          color: 'text.secondary',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '7px 0 24px rgba(15, 36, 75, 0.12)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width 180ms ease',
          zIndex: 1200,
        }}
      >
        <Box
          sx={{
            minHeight: headerHeight,
            px: collapsed ? 1.5 : 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
          }}
        >
          <Avatar src={logo} alt="Servimedical" sx={{ bgcolor: 'white', boxShadow: 2 }} />
          {!collapsed && (
            <Box>
              <Typography variant="h6" sx={{ color: 'primary.main', lineHeight: 1.1 }}>
                Servimedical
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                ERP Platform
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />

        <List sx={{ px: 1, py: 2, flex: 1 }}>
          <ListItemButton
            selected={isActive('/')}
            onClick={() => navigate('/')}
            sx={navItemStyles(collapsed)}
          >
            <ListItemIcon sx={navIconStyles}>
              <DashboardIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Dashboard" />}
          </ListItemButton>

          {modules.map((module) => {
            const Icon = module.icon

            return (
              <Tooltip key={module.path} title={collapsed ? module.name : ''} placement="right">
                <ListItemButton
                  selected={isActive(module.path)}
                  onClick={() => navigate(module.path)}
                  sx={navItemStyles(collapsed)}
                >
                  <ListItemIcon sx={navIconStyles}>
                    <Icon />
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={module.name} />}
                </ListItemButton>
              </Tooltip>
            )
          })}
        </List>

        <Box sx={{ p: 1.5 }}>
          <Box
            sx={{
              borderRadius: 2,
              p: collapsed ? 1.5 : 2,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              textAlign: collapsed ? 'center' : 'left',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Version
            </Typography>
            {!collapsed && (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                1.0.0
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

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
        <Toolbar sx={{ minHeight: `${headerHeight}px !important`, gap: 2 }}>
          <IconButton onClick={() => setCollapsed((value) => !value)} color="inherit">
            <MenuIcon />
          </IconButton>

          <Typography color="text.secondary">{currentTitle}</Typography>

          <Box sx={{ flex: 1 }} />

          <IconButton color="inherit">
            <AppsIcon fontSize="small" />
          </IconButton>

          <IconButton color="inherit">
            <NotificationsNoneIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>AD</Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                Administrador
              </Typography>
              <Typography variant="caption" color="text.secondary">Administrador</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          ml: { md: `${drawerWidth}px` },
          minHeight: `calc(100vh - ${footerHeight}px)`,
          px: { xs: 2, sm: 3, md: 2 },
          pt: `${headerHeight + 24}px`,
          pb: 4,
          transition: 'margin-left 180ms ease',
        }}
      >
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          ml: { md: `${drawerWidth}px` },
          height: footerHeight,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          color: 'text.secondary',
          transition: 'margin-left 180ms ease',
        }}
      >
        <Typography variant="body2">
          <strong>Copyright © 2026 </strong>
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 800 }}>
            Servimedical.
          </Box>{' '}
          Todos los derechos reservados.
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  )
}

function navItemStyles(collapsed: boolean) {
  return {
    minHeight: 48,
    mb: 0.4,
    px: collapsed ? 1.2 : 1.5,
    borderRadius: 2,
    color: '#6b7280',
    justifyContent: collapsed ? 'center' : 'flex-start',
    fontWeight: 600,
    '&.Mui-selected': {
      bgcolor: 'rgba(7, 93, 184, 0.08)',
      color: 'primary.main',
      borderLeft: '3px solid #f0142f',
      '& .MuiListItemIcon-root': {
        color: 'primary.main',
      },
    },
    '&.Mui-selected:hover, &:hover': {
      bgcolor: 'rgba(7, 93, 184, 0.08)',
      color: 'primary.main',
    },
  }
}

const navIconStyles = {
  minWidth: 42,
  color: 'inherit',
  justifyContent: 'center',
}
