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
import { executeCode, fetchProblem } from '../http_requests/ProblemAPIs';
import ProblemDescription from '../components/ProblemDescription';
import CodeEditorPanel from '../components/CodeEditorPanel';
import AIAssistantPanel from '../components/AIAssistantPanel';

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
    { role: 'assistant', content: 'Hi there! I\'m here to help you with your solution.' }
  ]);
  const [error, setError] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHintButton, setShowHintButton] = useState(true);

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

  const handleRun = useCallback(async () => {
    try {
      setConsoleOutput('Running code...');
      setConsoleTab(0);
      const response = await executeCode({ code, language, input: '' });
      const { output, error, success } = response.data;
      let resultMsg = '';
      if (success) {
        resultMsg = `Output:\n${output}`;
      } else {
        resultMsg = `Error:\n${error || 'Unknown error.'}`;
      }
      setConsoleOutput(resultMsg);
    } catch (error) {
      console.error('Code execution error:', error);
      setError(error.response?.data?.error || error.message || 'Failed to execute code. Please try again.');
    }
  }, [code, language]);

  const handleHintClick = useCallback(() => {
    setChatMessages(prev => [...prev, { role: 'user', content: 'Can I have a hint?' }]);
    setShowHintButton(false);
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m analyzing your code to provide better assistance...'
      }]);
    }, 1000);
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
          <ProblemDescription problem={problem} loading={loading} testCases={testCases} />

          {/* Code Editor Section - Middle */}
          <CodeEditorPanel
            code={code}
            onCodeChange={handleCodeChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            onSubmit={() => {}}
            consoleTab={consoleTab}
            onConsoleTabChange={handleConsoleTabChange}
            consoleOutput={consoleOutput}
          />

          {/* AI Assistant - Right Side */}
          <AIAssistantPanel
            chatMessages={chatMessages}
            message={message}
            onMessageChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            onSendMessage={handleSendMessage}
            showHintButton={showHintButton}
            onHintClick={handleHintClick}
          />
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default Problem; 