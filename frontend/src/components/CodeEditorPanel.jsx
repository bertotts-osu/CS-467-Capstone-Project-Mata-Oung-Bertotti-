import React from 'react';
import { Box, Button, FormControl, MenuItem, Select, Tabs, Tab } from '@mui/material';
import CodeEditor from './Editor';

const CodeEditorPanel = ({
  code,
  onCodeChange,
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  consoleTab,
  onConsoleTabChange,
  consoleOutput,
  setAIPanelOpen
}) => (
  <Box sx={{ 
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #333',
    borderRight: '1px solid #333'
  }}>
    {/* Hint Button */}
    {setAIPanelOpen && (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, pt: 2 }}>
        <Button
          variant="outlined"
          color="info"
          onClick={() => setAIPanelOpen(true)}
          sx={{ mb: 1 }}
        >
          Can I have a hint?
        </Button>
      </Box>
    )}
    {/* Language Selector and Buttons */}
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 1,
      borderBottom: '1px solid #333',
      bgcolor: '#252526'
    }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={language}
          onChange={onLanguageChange}
          sx={{ 
            color: 'white',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: '#333',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#666',
            },
            '.MuiSvgIcon-root': {
              color: 'white',
            }
          }}
        >
          <MenuItem value="python">Python</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" color="success" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
    {/* Editor */}
    <Box sx={{ flex: 1, overflow: 'hidden' }}>
      <CodeEditor
        value={code}
        onChange={onCodeChange}
        height="100%"
        language={language}
      />
    </Box>
    {/* Console Output */}
    <Box sx={{ 
      height: '200px',
      borderTop: '1px solid #333',
      bgcolor: '#1e1e1e'
    }}>
      <Tabs 
        value={consoleTab}
        onChange={onConsoleTabChange}
        sx={{
          minHeight: '36px',
          borderBottom: '1px solid #333',
          '.MuiTab-root': {
            color: '#999',
            minHeight: '36px',
            '&.Mui-selected': {
              color: 'white'
            }
          }
        }}
      >
        <Tab label="Console" />
        <Tab label="Output" />
      </Tabs>
      <Box 
        sx={{ 
          p: 1.5,
          height: 'calc(100% - 37px)',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: 'white',
          whiteSpace: 'pre-wrap'
        }}
      >
        {consoleOutput}
      </Box>
    </Box>
  </Box>
);

export default CodeEditorPanel; 