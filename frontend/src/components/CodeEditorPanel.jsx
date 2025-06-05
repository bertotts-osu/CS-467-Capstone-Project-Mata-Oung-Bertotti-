// CodeEditorPanel.jsx
// This component provides the main code editor interface, including a resizable editor, pass/fail alerts, and output console for coding problems.

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Tabs,
  Tab,
  Paper,
  Divider,
  Typography,
  Alert,
} from "@mui/material";
import CodeEditor from "./Editor";

/**
 * CodeEditorPanel component.
 * Provides a resizable code editor, pass/fail alerts, and output console for coding problems.
 * @param {object} props
 * @param {string} props.code - The current code in the editor.
 * @param {function} props.onCodeChange - Handler for code changes.
 * @param {function} props.onSubmit - Handler for submitting code.
 * @param {number} props.consoleTab - Current selected tab in the console area.
 * @param {function} props.onConsoleTabChange - Handler for changing console tab.
 * @param {string} props.consoleOutput - Output to display in the console area.
 * @param {string} [props.passFailStatus] - Pass/fail status for alerts.
 * @param {function} [props.onRetry] - Handler for retrying a failed submission.
 * @param {function} [props.onRun] - Handler for running code (if applicable).
 */
const CodeEditorPanel = ({
  code,
  onCodeChange,
  onSubmit,
  consoleTab,
  onConsoleTabChange,
  consoleOutput,
  passFailStatus,
  onRetry,
  onRun,
}) => {
  // State to control the resizable code editor area
  const [editorHeight, setEditorHeight] = useState(200); // initial height (px)
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(editorHeight);

  /**
   * When the user starts dragging the handle, set up mouse event listeners.
   */
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startHeight.current = editorHeight;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  /**
   * Update the editor height as the mouse moves.
   */
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.clientY - startY.current;
    const newHeight = Math.max(startHeight.current + delta, 40);
    setEditorHeight(newHeight);
  };

  /**
   * Clean up when the user stops dragging.
   */
  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    // Outer container: no fixed height so it snaps to its content
    <Paper
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2, // Outer container with rounded corners
        bgcolor: "#fff",
        overflow: "hidden", // Ensure inner content is clipped to the rounded corners
        boxShadow: "none",
        m: 0,
        p: 2,
        height: "100%",
      }}
      elevation={4}
    >
      {/* Pass/Fail Alert (if applicable) */}
      {passFailStatus && (
        <Alert
          severity={passFailStatus === "pass" ? "success" : "error"}
          sx={{ width: "75%", mb: 1, fontWeight: 600, fontSize: 16 }}
        >
          {passFailStatus === "pass"
            ? "✅ Pass! All test cases succeeded."
            : "❌ Fail. Try again!"}
        </Alert>
      )}

      {/* Inner wrapper for editor and console; this wrapper gets its own rounded borders */}
      <Box
        sx={{
          borderRadius: 2, // Rounded edges for the inner container
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          width: "95%",
          border: "2px solid #999",
          boxShadow: "none",
          minHeight: "250px"
        }}
      >
        {/* Top Bar with rounded top corners */}
        <Box
          sx={{
            height: "40px",
            bgcolor: "#23272b",
            width: "100%",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              color: "white",
              fontSize: 15,
              paddingLeft: "20px",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            Python
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={onSubmit}
            sx={{
              fontSize: 15,
              px: 3,
              py: 1,
              height: 40,
              fontWeight: 700,
              marginLeft: "auto",
            }}
          >
            Submit
          </Button>
        </Box>

        {/* Unified content area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Resizable Code Editor Area */}
          <Box
            sx={{
              height: editorHeight,
              overflow: "hidden",
              bgcolor: "#181a1b",
              p: 0.5,
              display: "flex",
              flexDirection: "column",
              minHeight: "300px"
            }}
          >
            <CodeEditor
              value={code}
              onChange={onCodeChange}
              height="100%"
              language="python"
            />
          </Box>

          {/* Draggable Handle (Partially Translucent Grey Bar) */}
          <Box
            onMouseDown={handleMouseDown}
            sx={{
              height: "5px",
              bgcolor: "rgba(204, 204, 204, 0.5)",
              cursor: "row-resize",
              "&:hover": { bgcolor: "rgba(204, 204, 204, 0.7)" },
            }}
          />

          {/* Console/Output Area */}
          <Box
            sx={{
              flex: 1,
              height: 200,
              borderTop: "1px solid #333",
              bgcolor: "#23272b",
              p: 0.5,
              display: "flex",
              flexDirection: "column",
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
            }}
          >
            <Tabs
              value={consoleTab}
              onChange={onConsoleTabChange}
              sx={{
                borderBottom: "1px solid #333",
                ".MuiTab-root": {
                  color: "#999",
                  height: "5px",
                  fontSize: 12,
                  "&.Mui-selected": {
                    color: "white",
                  },
                },
              }}
            >
              <Tab label="Output" />
            </Tabs>
            <Box
              sx={{
                p: 2,
                overflow: "auto",
                fontFamily: "monospace",
                fontSize: "0.85rem",
                color: "white",
                whiteSpace: "pre-wrap",
                minHeight: "40px"
              }}
            >
              {consoleOutput}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CodeEditorPanel;
