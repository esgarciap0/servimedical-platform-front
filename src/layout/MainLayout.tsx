import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
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

const expandedWidth = 262
const collapsedWidth = 78
const headerHeight = 64

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const drawerWidth = collapsed ? collapsedWidth : expandedWidth

  const isActive = (path: string) => location.pathname === path
  const currentTitle =
    location.pathname === '/'
      ? 'Inicio'
      : modules.find((module) => module.path === location.pathname)?.name ?? 'Inicio'

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#ffffff' }}>
      <Box
        sx={{
          minHeight: headerHeight,
          px: collapsed ? 1.5 : 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
        }}
      >
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)} sx={{ mr: 0.5 }}>
            <CloseIcon />
          </IconButton>
        )}
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
          onClick={() => { navigate('/'); if (isMobile) setMobileOpen(false) }}
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
                onClick={() => { navigate(module.path); if (isMobile) setMobileOpen(false) }}
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
            '& .MuiDrawer-paper': { width: expandedWidth, boxSizing: 'border-box' },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
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
        <Toolbar sx={{ minHeight: `${headerHeight}px !important`, gap: { xs: 1, md: 2 } }}>
          <IconButton
            onClick={() => (isMobile ? setMobileOpen(true) : setCollapsed((v) => !v))}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant={isMobile ? 'body2' : 'body1'} color="text.secondary" noWrap>
            {currentTitle}
          </Typography>

          <Box sx={{ flex: 1 }} />

          <IconButton color="inherit" size={isMobile ? 'small' : 'medium'}>
            <NotificationsNoneIcon />
          </IconButton>

          <Avatar
            sx={{ bgcolor: 'primary.main', width: isMobile ? 30 : 36, height: isMobile ? 30 : 36 }}
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
          px: { xs: 1.5, sm: 2, md: 2 },
          pt: { xs: `${headerHeight + 12}px`, md: `${headerHeight + 24}px` },
          pb: 4,
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
      '& .MuiListItemIcon-root': { color: 'primary.main' },
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
