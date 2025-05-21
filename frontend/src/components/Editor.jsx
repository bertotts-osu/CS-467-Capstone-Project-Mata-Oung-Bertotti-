import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Editor from '@monaco-editor/react';
import { Box, CircularProgress, Alert } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';

const CodeEditor = ({ 
  value, 
  onChange, 
  readOnly = false,
  language = 'python'
}) => {
  const [editorError, setEditorError] = useState(null);

  const handleEditorChange = (value) => {
    if (onChange) {
      try {
        onChange(value);
      } catch (error) {
        console.error('Editor change error:', error);
        setEditorError('Failed to update code. Please try again.');
      }
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    // Clear any previous errors when editor mounts successfully
    setEditorError(null);
  };

  const handleEditorError = (error) => {
    console.error('Monaco editor error:', error);
    setEditorError('Failed to load code editor. Please refresh the page.');
  };

  const getDefaultValue = (lang) => {
    try {
      switch (lang.toLowerCase()) {
        case 'python':
          return 'def solution(nums):\n    # Write your solution here\n    pass';
        case 'javascript':
          return 'function solution(nums) {\n    // Write your solution here\n}';
        case 'java':
          return 'public class Solution {\n    public int solution(int nums) {\n        // Write your solution here\n        return 0;\n    }\n}';
        case 'cpp':
          return '#include <vector>\n\nclass Solution {\npublic:\n    int solution(int nums) {\n        // Write your solution here\n        return 0;\n    }\n};';
        default:
          throw new Error(`Unsupported language: ${lang}`);
      }
    } catch (error) {
      console.error('Language switch error:', error);
      setEditorError(`Failed to switch to language: ${lang}`);
      return '// Error loading language template';
    }
  };

  return (
    <ErrorBoundary>
      <Box sx={{ 
        width: '100%',
        height: '100%',
        minHeight: 0,
        flex: 2,
        bgcolor: '#1e1e1e',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
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
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100%',
                bgcolor: '#1e1e1e'
              }}
              aria-label="Loading code editor"
            >
              <CircularProgress />
            </Box>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            readOnly: readOnly,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            detectIndentation: true,
            wordWrap: 'on'
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
  language: PropTypes.string
};

export default CodeEditor; 