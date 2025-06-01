import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MapIcon from '@mui/icons-material/Map';
import React, { useState } from "react";
import logo from "../assets/logo.png";
// import { useTour } from "../contexts/TourContext";

export default function Navbar() {
  const isAuthenticated = !!localStorage.getItem("authToken");
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const { setRun, setStepIndex } = useTour();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRefreshToken");
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", to: "/", icon: <DashboardIcon />, replace: false },
    { label: "Roadmap", to: "/roadmap", icon: <MapIcon />, replace: true },
    { label: "Contact", to: "/contact", icon: <ContactMailIcon />, replace: false },
  ];

  return (
    <AppBar
      position="static"
      color="primary"
      sx={{ width: "100%", pr: "20px" }}
      aria-label="Main Navigation Bar"
    >
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between" }}
        aria-label="Navigation Toolbar"
      >
        {/* App Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            flexDirection: "row",
            textDecoration: "none",
            color: "inherit",
            fontWeight: 600,
            gap: "20px",
            justifyContent: "center",
            alignItems: "center"
          }}
          aria-label="App Title: AI Algorithm Mentor"
        >
          <img
            src={logo}
            alt="AI Algorithm Mentor Logo"
            style={{ height: "50px", verticalAlign: "middle" }}
          />
          AI Algo Mentor
        </Typography>

        {/* Desktop Navigation Links */}
        <Box
          sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}
          aria-label="Desktop Navigation Links"
        >
          {navLinks.map((link) => (
            <Button
              key={link.to}
              color={location.pathname === link.to ? "secondary" : "inherit"}
              component={RouterLink}
              to={link.to}
              replace={link.replace}
              startIcon={link.icon}
              sx={{
                fontWeight: location.pathname === link.to ? 700 : 400,
                bgcolor:
                  location.pathname === link.to
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
                borderRadius: 2,
                px: 2,
                py: 1,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.15)",
                },
              }}
              aria-label={`Navigate to ${link.label}`}
            >
              {link.label}
            </Button>
          ))}
          {/* <Button
            color="info"
            variant="outlined"
            sx={{ ml: 2, fontWeight: 600, borderRadius: 2, px: 2, py: 1 }}
            onClick={() => { setStepIndex(0); setRun(true); }}
            aria-label="Show Onboarding Tour"
          >
            Show Tour
          </Button> */}
          {isAuthenticated ? (
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              aria-label="Logout"
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                startIcon={<LoginIcon />}
                aria-label="Login"
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/signup"
                startIcon={<PersonAddIcon />}
                aria-label="Sign Up"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          color="inherit"
          edge="end"
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open mobile navigation menu"
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          aria-label="Mobile Navigation Drawer"
        >
          <Box
            sx={{ width: 240 }}
            role="presentation"
            onClick={() => setDrawerOpen(false)}
          >
            <List>
              {navLinks.map((link) => (
                <ListItem
                  button
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  replace={link.replace}
                  selected={location.pathname === link.to}
                  aria-label={`Navigate to ${link.label}`}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {isAuthenticated ? (
                <ListItem button onClick={handleLogout} aria-label="Logout">
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              ) : (
                <>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/login"
                    aria-label="Login"
                  >
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="Login" />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/signup"
                    aria-label="Sign Up"
                  >
                    <ListItemIcon>
                      <PersonAddIcon />
                    </ListItemIcon>
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
