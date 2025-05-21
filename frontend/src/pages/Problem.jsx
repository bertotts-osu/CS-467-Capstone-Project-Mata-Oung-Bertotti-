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
  Snackbar,
  Modal,
  Fab,
  Tooltip,
  AppBar,
  Toolbar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../components/Layout';
import CodeEditor from '../components/Editor';
import ErrorBoundary from '../components/ErrorBoundary';
import { executeCode, fetchProblem } from '../http_requests/ProblemAPIs';
import ProblemDescription from '../components/ProblemDescription';
import CodeEditorPanel from '../components/CodeEditorPanel';
import AIAssistantPanel from '../components/AIAssistantPanel';
import { useLocation, useNavigate } from "react-router-dom";
import { devMode } from "../config";
import { sendMessageToGPT } from '../http_requests/ChatGptAPI';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Navbar from '../components/Navbar';

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
  const location = useLocation();
  const [openAIModal, setOpenAIModal] = useState(false);
  const [aiPanelOpen, setAIPanelOpen] = useState(false);
  const navigate = useNavigate();

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

  const sendMessageToGPT = async ({ user_request, submission = "no", hint = "no" }) => {
  try {
    const payload = {
      problem_type: location.state?.pattern || 'fibonacci',
      difficulty: location.state?.difficulty || 'Easy',
      user_request,
      submission,
      hint,
      code,  // This comes from the editor
    };

    const response = await fetch('http://localhost:5000/api/problem-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response.');
    }

    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error('Error communicating with GPT API:', error);
    return 'Sorry, there was an error trying to help with your solution.';
  }
};

  const handleSendMessage = useCallback(async () => {
  if (message.trim()) {
    const newUserMessage = { role: 'user', content: message };
    setChatMessages(prev => [...prev, newUserMessage]);
    setMessage('');

    const assistantReply = await sendMessageToGPT({
      user_request: message,
      submission: "no",
      hint: "no",
    });

    setChatMessages(prev => [...prev, { role: 'assistant', content: assistantReply }]);
  }
}, [message, code]);

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

  const handleHintClick = useCallback(async () => {
  const hintRequest = 'Can I have a hint?';
  setChatMessages(prev => [...prev, { role: 'user', content: hintRequest }]);
  setShowHintButton(false);

  const assistantReply = await sendMessageToGPT({
    user_request: hintRequest,
    submission: "no",
    hint: "yes",
  });

  setChatMessages(prev => [...prev, { role: 'assistant', content: assistantReply }]);
}, [code]);

  const handleSubmit = useCallback(async () => {
    try {
      setConsoleOutput('Submitting code...');
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
      setConsoleOutput('Error submitting code.');
    }
  }, [code, language]);

  useEffect(() => {
    async function loadProblem() {
      setLoading(true);
      setError(null);
      try {
        // Set default pattern and difficulty to Sliding Window and Medium
        const pattern = location.state?.pattern || 'Sliding Window';
        const difficulty = location.state?.difficulty || 'Medium';
        const response = await fetchProblem({ pattern, difficulty });
        setProblem(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [location.state]);

  return (
    <ErrorBoundary>
      {/* Navigation Bar */}
      <Navbar />
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: '#1e1e1e',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Dev Mode Banner */}
        {devMode && (
          <Box
            p={1}
            bgcolor="warning.main"
            color="white"
            textAlign="center"
            fontWeight={500}
          >
            <Typography variant="body2">
              ⚠️ Dev Mode is ON — Auth is currently bypassed for testing
            </Typography>
          </Box>
        )}

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
            flexDirection: 'row',
            overflow: 'hidden',
            justifyContent: aiPanelOpen ? 'flex-start' : 'center',
            alignItems: aiPanelOpen ? 'stretch' : 'center',
            minHeight: 0,
            transition: 'all 0.3s',
          }}
        >
          {/* Problem Description - Left Side */}
          <ProblemDescription problem={problem} loading={loading} testCases={testCases} />

          {/* Code Editor Section - Middle */}
          <CodeEditorPanel
              code={code}
              onCodeChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              onRun={handleRun}
              onSubmit={async () => {
                const submitRequest = 'Please review my submission.';
                setChatMessages(prev => [...prev, { role: 'user', content: submitRequest }]);

                const assistantReply = await sendMessageToGPT({
                  user_request: submitRequest,
                  submission: "yes",
                  hint: "no",
                });

                setChatMessages(prev => [...prev, { role: 'assistant', content: assistantReply }]);
              }}
              consoleTab={consoleTab}
              onConsoleTabChange={setConsoleTab}
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
            sx={{
              boxShadow: 6,
              borderRadius: 2,
              p: 0,
              m: 2,
              bgcolor: 'white',
              minWidth: 340,
              maxWidth: 400,
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100% - 32px)'
            }}
              header={{
                icon: <FeedbackIcon color="primary" sx={{ mr: 1 }} />,
                title: 'AI Help & Feedback',
                onClose: () => setAIPanelOpen(false),
                onClearChat: () => setChatMessages([
                  { role: 'assistant', content: 'Hi there! I\'m here to help you with your solution.' }
                ])
              }}
            />
          )}
        </Box>

        <Modal open={openAIModal} onClose={() => setOpenAIModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 2,
              outline: 'none',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '80vh',
              minWidth: { xs: '90vw', sm: 400 },
              minHeight: 400
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={() => setOpenAIModal(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
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
        </Modal>
      </Box>
    </ErrorBoundary>
  );
};

export default Problem;