import React from 'react';
import { Box, Button, FormControl, MenuItem, Select, Tabs, Tab, Paper, Divider, Typography } from '@mui/material';
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
  <Paper sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 4, p: 0.5, bgcolor: '#fff', minHeight: 0, overflow: 'hidden', m: 0, p: 2, }} elevation={4}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 1,
        mt: 1,
        px: 1,
      }}
    >
      <Button
        variant="outlined"
        color="info"
        onClick={() => setAIPanelOpen && setAIPanelOpen(true)}
        sx={{ fontSize: 13, px: 2, py: 1, height: 40 }}
      >
        Open AI Assistant
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'text.secondary', fontSize: 15 }}>
          Language
        </Typography>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={language}
            onChange={onLanguageChange}
            sx={{ fontSize: 14, height: 40, bgcolor: 'white' }}
          >
            <MenuItem value="python">Python</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button
        variant="contained"
        color="success"
        onClick={onSubmit}
        sx={{ fontSize: 15, px: 3, py: 1, height: 40, fontWeight: 700, boxShadow: 2 }}
      >
        Submit
      </Button>
    </Box>
    <Divider sx={{ mb: 1 }} />
    {/* Editor and Console as flex children */}
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Box sx={{ flex: 1, minHeight: 40, overflow: 'hidden', borderRadius: 2, bgcolor: '#181a1b', p: 0.5, mb: 1, display: 'flex', flexDirection: 'column' }}>
        <CodeEditor
          value={code}
          onChange={onCodeChange}
          height="100%"
          language={language}
        />
      </Box>
      <Divider sx={{ mb: 0.5 }} />
      <Box sx={{ height: 120, borderTop: '1px solid #333', bgcolor: '#23272b', borderRadius: 2, p: 0.5, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Tabs
          value={consoleTab}
          onChange={onConsoleTabChange}
          sx={{
            minHeight: '24px',
            borderBottom: '1px solid #333',
            '.MuiTab-root': {
              color: '#999',
              minHeight: '30px',
              fontSize: 12,
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
            p: 2,
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: 'white',
            whiteSpace: 'pre-wrap'
          }}
        >
          {consoleOutput}
        </Box>
      </Box>
    </Box>
  </Paper>
);

export default CodeEditorPanel; 