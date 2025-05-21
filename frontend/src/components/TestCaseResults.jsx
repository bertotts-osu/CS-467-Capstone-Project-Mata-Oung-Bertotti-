import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const TestCaseResults = ({ resultDetails, overallResult }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">
        Overall Result: {overallResult ? "Passed" : "Failed"}
      </Typography>
      {resultDetails.map((tc, idx) => (
        <Paper
          key={idx}
          elevation={3}
          sx={{ p: 2, mt: 1, bgcolor: tc.result === "passed" ? "success.light" : "error.light" }}
        >
          <Typography variant="subtitle1">Test Case {idx + 1}</Typography>
          <Typography variant="body2"><strong>Input:</strong> {tc.input}</Typography>
          <Typography variant="body2"><strong>Expected Output:</strong> {tc.expected_output}</Typography>
          <Typography variant="body2"><strong>User Output:</strong> {tc.user_output}</Typography>
          <Typography variant="body2"><strong>Result:</strong> {tc.result}</Typography>
          {tc.error && (
            <Typography variant="body2" sx={{ color: "error.dark" }}>
              <strong>Error:</strong> {tc.error}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default TestCaseResults;
