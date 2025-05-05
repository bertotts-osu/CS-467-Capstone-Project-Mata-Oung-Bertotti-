import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Layout from '../components/Layout';
import CodeEditor from '../components/Editor';
import ErrorBoundary from '../components/ErrorBoundary';
import { fetchProblem } from '../http_requests/ProblemAPIs';

const Problem = () => {
  const [code, setCode] = useState('def solution(nums):\n    # Write your solution here\n    pass');
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('python');
  const [consoleTab, setConsoleTab] = useState(0);
  const [testCases] = useState([
    { input: 'n = 4', output: '3', passed: true },
    { input: 'n = 5', output: '5', passed: false },
  ]);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m here to help you with your solution. Can you give me a hint?' }
  ]);
  const [error, setError] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCodeChange = useCallback((newValue) => {
    try {
      setCode(newValue);
    } catch (error) {
      console.error('Code change error:', error);
      setError('Failed to update code. Please try again.');
    }
  }, []);

  const handleLanguageChange = useCallback((event) => {
    try {
      setLanguage(event.target.value);
      // Reset console output when language changes
      setConsoleOutput('');
    } catch (error) {
      console.error('Language change error:', error);
      setError('Failed to switch language. Please try again.');
    }
  }, []);

  const handleConsoleTabChange = (event, newValue) => {
    setConsoleTab(newValue);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      try {
        setChatMessages(prev => [...prev, { role: 'user', content: message }]);
        setMessage('');
        setTimeout(() => {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'I\'m analyzing your code to provide better assistance...'
          }]);
        }, 1000);
      } catch (error) {
        console.error('Chat message error:', error);
        setError('Failed to send message. Please try again.');
      }
    }
  }, [message]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleRun = useCallback(() => {
    try {
      setConsoleOutput('Running code...\n> Testing solution(4)\nOutput: 3\nTest passed!\n\n> Testing solution(5)\nOutput: 4\nExpected: 5\nTest failed!');
      setConsoleTab(0);
    } catch (error) {
      console.error('Code execution error:', error);
      setError('Failed to execute code. Please try again.');
    }
  }, []);

  useEffect(() => {
    async function loadProblem() {
      setLoading(true);
      setError(null);
      try {
        // Hardcoded for demo; replace with dynamic selection as needed
        const response = await fetchProblem({ pattern: 'fibonacci', difficulty: 'Easy' });
        setProblem(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, []);

  return (
    <ErrorBoundary>
      <Box 
        sx={{ 
          width: '100vw',
          height: '100vh',
          bgcolor: '#1e1e1e',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Navbar placeholder - height matches Layout's navbar */}
        <Box sx={{ height: '64px', bgcolor: 'primary.main' }} />

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Main content area */}
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex',
            overflow: 'hidden'
          }}
        >
          {/* Problem Description - Left Side */}
          <Paper 
            sx={{ 
              width: '25%',
              height: '100%',
              bgcolor: 'white',
              borderRadius: 0,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column'
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
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      mb: 2 
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
                      fontFamily: 'monospace',
                      bgcolor: '#f5f5f5',
                      p: 1,
                      borderRadius: 1
                    }}
                  >
Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="error">No problem found.</Typography>
              )}
            </Box>

            {/* Test Cases Section */}
            <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="h6" gutterBottom>
                Test Cases
              </Typography>
              {testCases.map((test, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    mb: 2,
                    p: 1.5,
                    bgcolor: '#f8f9fa',
                    borderRadius: 1,
                    border: '1px solid #eee'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2">Test Case {index + 1}</Typography>
                    {test.passed ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <ErrorIcon color="error" fontSize="small" />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    Input: {test.input}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    Output: {test.output}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Code Editor Section - Middle */}
          <Box sx={{ 
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #333',
            borderRight: '1px solid #333'
          }}>
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
                  onChange={handleLanguageChange}
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
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="primary" onClick={handleRun}>
                  Run
                </Button>
                <Button variant="contained" color="success">
                  Submit
                </Button>
              </Box>
            </Box>

            {/* Editor */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
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
                onChange={handleConsoleTabChange}
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

          {/* AI Assistant - Right Side */}
          <Paper 
            sx={{ 
              width: '25%',
              height: '100%',
              bgcolor: 'white',
              borderRadius: 0,
              display: 'flex',
              flexDirection: 'column'
            }}
            elevation={0}
          >
            <Box sx={{ 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <Typography variant="h6" gutterBottom>
                AI Assistant
              </Typography>
              
              {/* Chat Messages */}
              <Box sx={{ 
                flex: 1,
                overflow: 'auto',
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                {chatMessages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: msg.role === 'assistant' ? '#e3f2fd' : '#f5f5f5',
                      p: 1,
                      borderRadius: 1,
                      maxWidth: '90%',
                      alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end'
                    }}
                  >
                    <Typography variant="body2">
                      {msg.content}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Message Input */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ask for help..."
                  value={message}
                  onChange={handleMessageChange}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default Problem; 