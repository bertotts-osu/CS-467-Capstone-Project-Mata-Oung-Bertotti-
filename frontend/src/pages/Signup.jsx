import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signup } from "../http_requests/AuthenticationAPIs.js";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { devMode } from "../config";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  const isPasswordValid = (pwd) => {
    const minLength = /.{8,}/;
    const hasNumber = /[0-9]/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasSpecialChar = /[^A-Za-z0-9]/;

    return (
      minLength.test(pwd) &&
      hasNumber.test(pwd) &&
      hasUppercase.test(pwd) &&
      hasLowercase.test(pwd) &&
      hasSpecialChar.test(pwd)
    );
  };

  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0 to 5
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid(password)) {
      setPasswordValid(false);
      setError("Password does not meet the requirements");
      return;
    } else {
      setPasswordValid(true);
    }

    if (password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await signup({ name, username, email, password });
      console.log(response.data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <Layout backgroundImage="/public/signup_lines.jpg">

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
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => {
            const val = e.target.value;
            setPassword(val);
            setPasswordStrength(getPasswordStrength(val));
          }}
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
        <Typography
          variant="caption"
          display="block"
          mb={1}
          sx={{ color: passwordValid ? "text.secondary" : "error.main" }}
        >
          Must be at least 8 characters, include a number, an uppercase letter, a lowercase letter and a special character.
        </Typography>

        {/* Password Strength Meter */}
        {password && (
          <Box mb={2}>
            <Box
              height={8}
              borderRadius={4}
              sx={{
                backgroundColor:
                  passwordStrength < 2
                    ? "error.main"
                    : passwordStrength < 5
                    ? "warning.main"
                    : "success.main",
                transition: "background-color 0.3s",
              }}
            />
            <Typography variant="caption" color="text.secondary" mt={0.6}>
              {passwordStrength < 2
                ? "Weak"
                : passwordStrength < 5
                ? "Moderate"
                : "Strong"}
            </Typography>
          </Box>
        )}

        <TextField
          label="Verify Password"
          type={showVerifyPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowVerifyPassword(!showVerifyPassword)} edge="end">
                  {showVerifyPassword ? <VisibilityOff /> : <Visibility />}
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
          Sign Up
        </Button>
      </form>
      <Box mt={2}>
          <Link href="/login">Already have an account? Log in</Link>
      </Box>
    </Layout>
  );
}
