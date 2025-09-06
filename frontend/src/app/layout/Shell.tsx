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
  Toolbar,
  Typography,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/auth/AuthContext';

export default function Shell() {
  const [open, setOpen] = React.useState(false);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
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
          {token && (
            <Button color="inherit" onClick={handleLogout} aria-label="logout">
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} aria-label="main-menu">
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setOpen(false)}>
          <List>
            <ListItemButton component={RouterLink} to="/customers">
              <ListItemText primary="Clientes" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/products">
              <ListItemText primary="Produtos" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

