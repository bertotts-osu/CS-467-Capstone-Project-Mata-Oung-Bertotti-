import { useState } from "react";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signup } from "../http_requests/AuthenticationAPIs.js";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await signup({ name, username, email, password });
      console.log(response.data)
      navigate("/login"); // Redirect to login page on successful signup
    } catch (err) {
      setError(err.response?.data?.error || err.message); // Display error message
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
         <TextField
          label="User Name"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Verify Password"
          type="password"
          fullWidth
          margin="normal"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </form>
      <Box mt={2}>
        <Link href="/login">Already have an account? Login</Link>
      </Box>
    </Box>
  );
}
