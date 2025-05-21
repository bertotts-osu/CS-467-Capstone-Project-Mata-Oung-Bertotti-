import React from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const ProblemDescription = ({ problem, loading, testCases }) => (
  <Paper
    elevation={4}
    sx={{
      width: "100%",
      height: "100%",
      bgcolor: "#fff",
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
      boxShadow: 4,
      borderLeft: "6px solid #1976d2",
      minHeight: 0,
      overflow: "hidden",
      p: 2,
      m: 0
    }}
  >
    <Typography variant="h4" fontWeight={700} gutterBottom>
      Problem Description
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
      {loading && (
        <Typography variant="body1" fontSize={18}>Loading...</Typography>
      )}
      {!loading && problem && (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {problem.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: "1.1rem",
              color: "text.primary",
              lineHeight: 1.7,
            }}
          >
            {problem.prompt}
          </Typography>
          <Box
            sx={{
              bgcolor: "#e3f2fd",
              p: 2,
              borderRadius: 2,
              mt: 1,
              borderLeft: "4px solid #1976d2",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Example:
            </Typography>
            <Typography
              variant="body2"
              component="pre"
              sx={{
                fontFamily: "monospace",
                fontSize: "1rem",
                color: "#333",
              }}
            >
              Input: [
              {Array.isArray(problem.example.input)
                ? problem.example.input.join(", ")
                : Object.values(problem.example.input).join(", ")}
              ]{"\n"}
              Output: {problem.example.output}
            </Typography>
          </Box>
        </>
      )}
      {!loading && !problem && (
        <Typography variant="body1" color="error" fontSize={18}>
          No problem found.
        </Typography>
      )}
    </Box>
  </Paper>
);

export default ProblemDescription;
