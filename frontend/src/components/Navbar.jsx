import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import React, { useState } from 'react';

export default function Navbar() {
  const isAuthenticated = !!localStorage.getItem("authToken");
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRefreshToken");
    navigate("/login");
  };

  const navLinks = [
    { label: 'Dashboard', to: '/', icon: <DashboardIcon /> },
    { label: 'Profile', to: '/profile', icon: <AccountCircleIcon /> },
    { label: 'Contact', to: '/contact', icon: <ContactMailIcon /> },
  ];

  return (
    <AppBar position="static" color="primary" sx={{ width: '100%' }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* App Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", fontWeight: 600 }}
        >
          ChatGPT Challenge
        </Typography>

        {/* Desktop Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {navLinks.map(link => (
            <Button
              key={link.to}
              color={location.pathname === link.to ? 'secondary' : 'inherit'}
              component={RouterLink}
              to={link.to}
              startIcon={link.icon}
              sx={{
                fontWeight: location.pathname === link.to ? 700 : 400,
                bgcolor: location.pathname === link.to ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderRadius: 2,
                px: 2,
                py: 1,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)'
                }
              }}
            >
              {link.label}
            </Button>
          ))}
          {isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login" startIcon={<LoginIcon />}>Login</Button>
              <Button color="inherit" component={RouterLink} to="/signup" startIcon={<PersonAddIcon />}>Sign Up</Button>
            </>
          )}
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          color="inherit"
          edge="end"
          sx={{ display: { xs: 'flex', md: 'none' } }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 240 }} role="presentation" onClick={() => setDrawerOpen(false)}>
            <List>
              {navLinks.map(link => (
                <ListItem button key={link.to} component={RouterLink} to={link.to} selected={location.pathname === link.to}>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {isAuthenticated ? (
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              ) : (
                <>
                  <ListItem button component={RouterLink} to="/login">
                    <ListItemIcon><LoginIcon /></ListItemIcon>
                    <ListItemText primary="Login" />
                  </ListItem>
                  <ListItem button component={RouterLink} to="/signup">
                    <ListItemIcon><PersonAddIcon /></ListItemIcon>
                    <ListItemText primary="Sign Up" />
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
