// Footer.jsx
// This component displays the footer with contact link and copyright.

import { Box, Link, Typography } from "@mui/material";

/**
 * Footer component.
 * Displays a footer with a contact link and copyright information.
 */
export default function Footer() {
  return (
    <Box
      mt={4}
      py={2}
      textAlign="center"
      bgcolor="#f5f5f5"
      sx={{ width: '100%' }}
    >
      <Typography variant="body2" color="text.secondary">
        {/* Contact link and copyright */}
        <Link href="/contact" underline="hover">
          Contact Us
        </Link>{" "}
        • © 2025 ChatGPT Challenge - AI Coder - CS467 Capstone Project
      </Typography>
    </Box>
  );
}