import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const isAuthenticated = !!localStorage.getItem("authToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRefreshToken");
    navigate("/login");
  };

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

        {/* Navigation Links */}
        <Box>
          <Button color="inherit" component={RouterLink} to="/contact">
            Contact
          </Button>

          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/">
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
