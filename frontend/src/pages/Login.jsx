import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { login } from "../http_requests/AuthenticationAPIs.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      const { message, token, refreshToken } = response.data;
      // Store token in localStorage or context
      console.log(message);
      localStorage.setItem("authToken", token);
      localStorage.setItem("authRefreshToken", refreshToken)
      navigate("/"); // Redirect to Dashboard on successful login
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5}>
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
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
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
      <Box mt={2}>
        <Link href="/signup">Don't have an account? Sign Up</Link>
      </Box>
    </Box>
  );
}
