import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const ProblemDescription = ({ problem, loading, testCases }) => (
  <Paper
    sx={{
      width: "25%",
      height: "100%",
      bgcolor: "white",
      borderRadius: 0,
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
    }}
    elevation={0}
  >
    <Box sx={{ p: 3, flex: 1 }}>
      <Typography variant="h6" gutterBottom>
        Problem Description
      </Typography>
      {loading ? (
        <Typography variant="body2">Loading...</Typography>
      ) : problem ? (
        <>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {problem.name}
          </Typography>
          <Typography
            variant="body2"
            component="pre"
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              mb: 2,
            }}
          >
            {problem.prompt}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Example:
          </Typography>
          <Typography
            variant="body2"
            component="pre"
            sx={{
              fontFamily: "monospace",
              bgcolor: "#f5f5f5",
              p: 1,
              borderRadius: 1,
            }}
          >
            Input: [
            {Array.isArray(problem.example.input)
              ? problem.example.input.join(", ")
              : Object.values(problem.example.input).join(", ")}
            ]{"\n"}
            Output: {problem.example.output}
            {/* Input: n = 4 Output: 3 Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3 */}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="error">
          No problem found.
        </Typography>
      )}
    </Box>
  </Paper>
);

export default ProblemDescription;
