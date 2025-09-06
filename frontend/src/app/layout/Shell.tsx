import * as React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Typography,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/auth/AuthContext';
import CustomerSelector from './CustomerSelector';
import { SelectedCustomerProvider, useSelectedCustomer } from '@shared/customers/SelectedCustomerContext';

const drawerWidthOpen = 240;
const drawerWidthClosed = 64;

export default function Shell() {
  const [open, setOpen] = React.useState(false);
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SelectedCustomerProvider>
      <CssBaseline />
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="open menu"
            onClick={() => setOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            aiqfome
          </Typography>
          <Box sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            <SelectedCustomerSummary />
          </Box>
          {token && (
            <Button color="inherit" onClick={handleLogout} aria-label="logout">
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        aria-label="main-menu"
        sx={{
          width: open ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: open ? drawerWidthOpen : drawerWidthClosed,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen
            }),
            overflowX: 'hidden'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ width: '100%' }}>
          <List>
            <ListItemButton
              component={RouterLink}
              to="/customers"
              selected={location.pathname.startsWith('/customers')}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' }
                },
                '&.Mui-selected:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Clientes" />}
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to="/products"
              selected={location.pathname.startsWith('/products')}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' }
                },
                '&.Mui-selected:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <ListItemIcon>
                <StorefrontIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Produtos" />}
            </ListItemButton>
          </List>
          <CustomerSelector collapsed={!open} />
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, ml: open ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`, transition: (theme) => theme.transitions.create('margin', { duration: theme.transitions.duration.enteringScreen }) }}>
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </Box>
      </SelectedCustomerProvider>
    </Box>
  );
}

function SelectedCustomerSummary() {
  const { selectedCustomerId, selectedCustomer } = useSelectedCustomer();
  const label = selectedCustomer?.label ?? (selectedCustomerId ? `Cliente #${selectedCustomerId}` : 'Nenhum cliente');
  return (
    <Typography variant="body2" color="inherit" noWrap title={label} sx={{ maxWidth: 280 }}>
      {label}
    </Typography>
  );
}
