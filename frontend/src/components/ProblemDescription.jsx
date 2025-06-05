// ProblemDescription.jsx
// This component displays the coding problem, including its name, prompt, difficulty, and example input/output.

import React from "react";
import { Box, Paper, Typography, Divider, Button, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

/**
 * ProblemDescription component.
 * Displays the coding problem's name, prompt, difficulty, and example.
 * @param {object} props
 * @param {object} props.problem - The problem object to display.
 * @param {boolean} props.loading - Whether the problem is loading.
 * @param {Array} [props.testCases] - Optional test cases (unused here).
 * @param {boolean} props.showDifficulty - Whether to show the difficulty chip.
 * @param {function} props.onRevealDifficulty - Handler for revealing the difficulty.
 */
const ProblemDescription = ({ problem, loading, testCases, showDifficulty, onRevealDifficulty }) => {
  // Mock fallback for missing difficulty
  const safeProblem = problem && !problem.difficulty
    ? { ...problem, difficulty: (problem.requestedDifficulty || 'Medium') }
    : problem;
  return (
    <Paper
      elevation={4}
      sx={{
        width: "95%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        textWrap: "wrap",
        pl: 2,
        m: 0,
        boxShadow: "none"
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {loading && (
          <Typography variant="body1" fontSize={18}>
            Loading...
          </Typography>
        )}
        {!loading && safeProblem && (
          <>
            {/* Reveal Difficulty Button or Chip */}
            {safeProblem.difficulty && !showDifficulty && (
              <Button variant="outlined" color="primary" size="small" sx={{ mb: 1 }} onClick={onRevealDifficulty}>
                Reveal Difficulty
              </Button>
            )}
            {safeProblem.difficulty && showDifficulty && (
              <Chip
                label={safeProblem.difficulty}
                color={safeProblem.difficulty === 'Easy' ? 'success' : safeProblem.difficulty === 'Medium' ? 'warning' : 'error'}
                sx={{ mb: 1, fontWeight: 700, fontSize: 16 }}
              />
            )}
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              {safeProblem.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                fontSize: "1.1rem",
                color: "text.primary",
                lineHeight: 1.7,
                maxWidth: "90%"
              }}
            >
              {safeProblem.prompt}
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
              <Typography variant="h6" color="text.secondary">
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
                {Array.isArray(safeProblem.example.input)
                  ? safeProblem.example.input.join(", ")
                  : Object.values(safeProblem.example.input).join(", ")}
                ]{"\n"}
                Output: {safeProblem.example.output}
              </Typography>
            </Box>
          </>
        )}
        {!loading && !safeProblem && (
          <Typography variant="body1" color="error" fontSize={18}>
            No problem found.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ProblemDescription;
