import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login } from "../http_requests/AuthenticationAPIs.js";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { devMode } from "../config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await login({ username, password });
      const { message, id_token, refresh_token } = response.data;
      localStorage.setItem("authToken", id_token);
      localStorage.setItem("authRefreshToken", refresh_token);
      navigate("/"); // Redirect to Dashboard
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <Layout backgroundImage="/login_abstract.jpg">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>

      <Box mt={2} textAlign="center">
        <Link href="/signup">Don't have an account? Sign Up</Link>
      </Box>
    </Layout>
  );
}
