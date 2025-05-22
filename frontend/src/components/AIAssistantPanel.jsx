import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Divider, Tooltip, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    <Box
      component={Paper}
      elevation={4}
      sx={{
        width: '100%',
        minWidth: 400,
        maxWidth: 600,
        height: '100%',
        minHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 4,
        bgcolor: '#fff',
        minHeight: 0,
        overflow: 'hidden',
        m: 0,
        p: 2,
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
      <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, pb: 1 }}>
        {chatMessages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              maxWidth: '90%',
              mb: 1.5,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              bgcolor: msg.role === 'user' ? 'primary.light' : 'grey.100',
              color: msg.role === 'user' ? 'white' : 'text.primary',
              borderRadius: 2,
              px: 2,
              py: 1,
              boxShadow: 1,
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              fontSize: 17,
            }}
          >
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={materialDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </Box>
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
    </Box>
  );
};

export default AIAssistantPanel; 