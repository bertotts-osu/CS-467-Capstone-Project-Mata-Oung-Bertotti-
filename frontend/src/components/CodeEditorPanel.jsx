import React from 'react';
import { Box, Button, Tabs, Tab, Paper, Divider, Typography, Alert } from '@mui/material';
import CodeEditor from './Editor';

const pythonStarterCode = 'def solution(nums):\n    # Write your solution here\n    pass';

const CodeEditorPanel = ({
  code,
  onCodeChange,
  onSubmit,
  consoleTab,
  onConsoleTabChange,
  consoleOutput,
  setAIPanelOpen,
  passFailStatus,
  onRetry
}) => (
  <Paper sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 4, p: 0.5, bgcolor: '#fff', minHeight: 0, overflow: 'hidden', m: 0, p: 2, }} elevation={4}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 1,
        mt: 1,
        px: 1,
      }}
    >
      {/* Left controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          color="info"
          onClick={() => setAIPanelOpen && setAIPanelOpen(true)}
          sx={{ fontSize: 13, px: 2, py: 1, height: 40 }}
        >
          Open AI Assistant
        </Button>
        <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'text.secondary', fontSize: 15 }}>
          Language: Python
        </Typography>
      </Box>
      {/* Right controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {passFailStatus && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onRetry}
            sx={{ fontSize: 13, px: 2, py: 1, height: 40 }}
          >
            Retry
          </Button>
        )}
        <Button
          variant="contained"
          color="success"
          onClick={onSubmit}
          sx={{ fontSize: 15, px: 3, py: 1, height: 40, fontWeight: 700, boxShadow: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Box>
    <Divider sx={{ mb: 1 }} />
    {/* Pass/Fail Alert */}
    {passFailStatus && (
      <Alert severity={passFailStatus === 'pass' ? 'success' : 'error'} sx={{ mb: 1, fontWeight: 600, fontSize: 16 }}>
        {passFailStatus === 'pass' ? '✅ Pass! All test cases succeeded.' : '❌ Fail. Try again!'}
      </Alert>
    )}
    {/* Editor and Console as flex children */}
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Box sx={{ flex: 1, minHeight: 40, overflow: 'hidden', borderRadius: 2, bgcolor: '#181a1b', p: 0.5, mb: 1, display: 'flex', flexDirection: 'column' }}>
        <CodeEditor
          value={code}
          onChange={onCodeChange}
          height="100%"
          language="python"
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