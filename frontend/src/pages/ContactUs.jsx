import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from "@mui/material";
import Layout from "../components/Layout"; // ✅ Import Layout

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hook to backend/email service here if needed
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Layout backgroundImage="/contact_network.jpg">
      <Typography variant="h4" gutterBottom align="center">
        Contact Us
      </Typography>

      {submitted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Message sent! We’ll get back to you shortly.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Your Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email Address"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Message"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          Send Message
        </Button>
      </form>
    </Layout>
  );
}
