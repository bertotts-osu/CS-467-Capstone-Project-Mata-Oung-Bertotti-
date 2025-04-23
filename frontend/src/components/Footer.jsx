import { Box, Link, Typography } from "@mui/material";

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
        <Link href="/contact" underline="hover">
          Contact Us
        </Link>{" "}
        • © 2025 ChatGPT Challenge - AI Coder - CS467 Capstone Project
      </Typography>
    </Box>
  );
}