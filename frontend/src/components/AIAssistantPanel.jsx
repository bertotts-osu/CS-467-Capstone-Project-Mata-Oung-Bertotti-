import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Divider, Tooltip, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const AIAssistantPanel = ({
  chatMessages,
  message,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  header
}) => {
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleClearChat = () => {
    if (typeof header?.onClearChat === 'function') {
      header.onClearChat();
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: { xs: '100vw', sm: 370, md: 400 },
        minWidth: 280,
        maxWidth: 400,
        height: '100%',
        bgcolor: '#f9fafb',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 6,
        m: 0,
        p: 2,
        minHeight: 0,
        overflow: 'hidden',
        border: '1.5px solid #e3e8ef',
      }}
      aria-label="AI Assistant Chat Panel"
    >
      {/* Sticky Header */}
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#e3f2fd',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        p: 1.2,
        borderBottom: '1.5px solid #bbdefb',
        gap: 1,
        boxShadow: '0 2px 8px 0 rgba(33, 150, 243, 0.07)',
        minHeight: 56,
      }}>
        {header?.icon}
        <Typography variant="h6" fontWeight={700} sx={{ flex: 1, fontSize: 20, color: '#1976d2' }}>
          {header?.title || 'AI Help & Feedback'}
        </Typography>
        {header?.onClearChat && (
          <Tooltip title="Clear Chat">
            <IconButton size="small" onClick={handleClearChat} sx={{ mr: 0.5 }} aria-label="Clear chat">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {header?.onClose && (
          <IconButton size="small" onClick={header.onClose} aria-label="Close panel">
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ m: 0 }} />
      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          px: 2,
          py: 2,
          bgcolor: '#f7fafd',
          fontSize: '1.08rem',
          position: 'relative',
        }}
        tabIndex={0}
        aria-label="Chat messages"
      >
        {chatMessages.map((msg, index) => (
          <Fade in key={index} timeout={400}>
            <Box
              sx={{
                bgcolor: msg.role === 'assistant' ? 'linear-gradient(90deg, #e3f2fd 80%, #bbdefb 100%)' : 'linear-gradient(90deg, #f5f5f5 80%, #e0e0e0 100%)',
                color: '#222',
                p: 2,
                borderRadius: 3,
                boxShadow: msg.role === 'assistant' ? 2 : 1,
                maxWidth: { xs: '95%', sm: '85%', md: '80%' },
                alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end',
                fontSize: '1.08rem',
                mb: 0.5,
                transition: 'background 0.3s',
                border: msg.role === 'assistant' ? '1.5px solid #90caf9' : '1.5px solid #e0e0e0',
                position: 'relative',
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '1.08rem' }}>
                {msg.content}
              </Typography>
            </Box>
          </Fade>
        ))}
        <div ref={chatEndRef} />
      </Box>
      <Divider sx={{ my: 0 }} />
      {/* Message Input */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: 1,
          bgcolor: '#f5f7fa',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          size="medium"
          placeholder="Ask for help... (Shift+Enter for newline)"
          value={message}
          onChange={onMessageChange}
          onKeyPress={onKeyPress}
          variant="outlined"
          sx={{ bgcolor: 'white', borderRadius: 2, fontSize: 17, boxShadow: 0 }}
          inputProps={{ style: { fontSize: 17 }, 'aria-label': 'Type your message' }}
          multiline
          minRows={1}
          maxRows={4}
        />
        <Tooltip title="Send (Enter)">
          <span>
            <IconButton
              color="primary"
              onClick={onSendMessage}
              disabled={!message.trim()}
              sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1, ml: 0.5 }}
              aria-label="Send message"
            >
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default AIAssistantPanel; 