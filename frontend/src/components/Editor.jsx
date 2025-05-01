import React from 'react';
import PropTypes from 'prop-types';
import Editor from '@monaco-editor/react';
import { Box, CircularProgress } from '@mui/material';

const CodeEditor = ({ 
  value, 
  onChange, 
  height = '70vh',
  readOnly = false,
  language = 'python'
}) => {
  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  const getDefaultValue = (lang) => {
    switch (lang) {
      case 'python':
        return 'def solution(nums):\n    # Write your solution here\n    pass';
      case 'javascript':
        return 'function solution(nums) {\n    // Write your solution here\n}';
      case 'java':
        return 'public class Solution {\n    public int solution(int nums) {\n        // Write your solution here\n        return 0;\n    }\n}';
      case 'cpp':
        return '#include <vector>\n\nclass Solution {\npublic:\n    int solution(int nums) {\n        // Write your solution here\n        return 0;\n    }\n};';
      default:
        return '// Write your solution here';
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      height,
      bgcolor: '#1e1e1e',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        theme="vs-dark"
        value={value || getDefaultValue(language)}
        onChange={handleEditorChange}
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
        loading={<CircularProgress />}
      />
    </Box>
  );
};

CodeEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  height: PropTypes.string,
  readOnly: PropTypes.bool,
  language: PropTypes.string
};

export default CodeEditor; 