// Editor.jsx
// This component wraps the Monaco code editor, providing error handling, default code, and configuration for the coding environment.

import React, { useState } from "react";
import PropTypes from "prop-types";
import Editor from "@monaco-editor/react";
import { Box, CircularProgress, Alert } from "@mui/material";
import ErrorBoundary from "./ErrorBoundary";

/**
 * CodeEditor component.
 * Wraps the Monaco code editor with error handling and configuration for the coding environment.
 * @param {object} props
 * @param {string} props.value - The code to display in the editor.
 * @param {function} props.onChange - Handler for code changes.
 * @param {boolean} [props.readOnly=false] - Whether the editor is read-only.
 * @param {string} [props.language="python"] - Programming language for syntax highlighting.
 */
const CodeEditor = ({
  value,
  onChange,
  readOnly = false,
  language = "python",
}) => {
  const [editorError, setEditorError] = useState(null);

  /**
   * Handles changes in the editor and calls the onChange prop.
   */
  const handleEditorChange = (value) => {
    if (onChange) {
      try {
        onChange(value);
      } catch (error) {
        console.error("Editor change error:", error);
        setEditorError("Failed to update code. Please try again.");
      }
    }
  };

  /**
   * Clears any previous errors when the editor mounts successfully.
   */
  const handleEditorDidMount = (editor, monaco) => {
    setEditorError(null);
  };

  /**
   * Handles errors from the Monaco editor.
   */
  const handleEditorError = (error) => {
    console.error("Monaco editor error:", error);
    setEditorError("Failed to load code editor. Please refresh the page.");
  };

  /**
   * Returns a default code template if no value is provided.
   */
  const getDefaultValue = () => {
    return `def main(*args):
    # Write your solution here.
    # You can unpack the input arguments as needed.
    pass`;
  };

  return (
    <ErrorBoundary>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 0,
          flex: 2,
          bgcolor: "#1e1e1e",
          borderRadius: "4px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
        aria-label="Code Editor Container"
      >
        {editorError && (
          <Alert
            severity="error"
            onClose={() => setEditorError(null)}
            sx={{ mb: 1 }}
          >
            {editorError}
          </Alert>
        )}
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          theme="vs-dark"
          value={value || getDefaultValue(language)}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          onError={handleEditorError}
          loading={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                bgcolor: "#1e1e1e",
              }}
              aria-label="Loading code editor"
            >
              <CircularProgress />
            </Box>
          }
          options={{
            minimap: { enabled: true },
            fontSize: 15,
            lineNumbers: "on",
            readOnly: readOnly,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            detectIndentation: true,
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            folding: true,
            formatOnType: true,
            formatOnPaste: true,
            renderLineHighlight: "all",
            selectOnLineNumbers: true,
            cursorBlinking: "blink",
            cursorSmoothCaretAnimation: true,
            bracketPairColorization: { enabled: true },
          }}
          aria-label="Monaco Code Editor"
        />
      </Box>
    </ErrorBoundary>
  );
};

CodeEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  language: PropTypes.string,
};

export default CodeEditor;
