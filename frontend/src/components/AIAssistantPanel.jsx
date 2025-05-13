import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Button, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FeedbackIcon from '@mui/icons-material/Feedback';

const AIAssistantPanel = ({
  chatMessages,
  message,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  showHintButton,
  onHintClick
}) => {
  const [hintUsed, setHintUsed] = useState(false);

  const handleHintClick = () => {
    setHintUsed(true);
    if (onHintClick) onHintClick();
  };

  return (
    <Paper 
      sx={{ 
        width: { xs: '100%', sm: '340px', md: '25%' },
        minWidth: 0,
        height: '100%',
        bgcolor: 'white',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 6,
        m: { xs: 0, sm: 2 },
        p: 0
      }}
      elevation={0}
    >
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#e3f2fd',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        p: 2,
        borderBottom: '1px solid #bbdefb',
        gap: 1
      }}>
        <FeedbackIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={700}>
          AI Help & Feedback
        </Typography>
      </Box>
      {/* Chat Messages */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        mb: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        px: 2,
        py: 2,
        bgcolor: '#f7fafd'
      }}>
        {chatMessages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              bgcolor: msg.role === 'assistant' ? '#e3f2fd' : '#f5f5f5',
              color: '#222',
              p: 1.2,
              borderRadius: 2,
              boxShadow: 1,
              maxWidth: '90%',
              alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end',
              fontSize: '1rem',
              mb: 0.5
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {msg.content}
            </Typography>
          </Box>
        ))}
      </Box>
      <Divider sx={{ my: 0 }} />
      {/* Hint Button (one-time, above input) */}
      {!hintUsed && showHintButton && (
        <Box sx={{ px: 2, pt: 2, pb: 0, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" size="small" onClick={handleHintClick} sx={{ whiteSpace: 'nowrap' }}>
            Can I have a hint?
          </Button>
        </Box>
      )}
      {/* Message Input */}
      <Box sx={{ display: 'flex', gap: 1, p: 2, bgcolor: '#f5f7fa', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask for help..."
          value={message}
          onChange={onMessageChange}
          onKeyPress={onKeyPress}
          variant="outlined"
          sx={{ bgcolor: 'white', borderRadius: 1 }}
        />
        <IconButton 
          color="primary" 
          onClick={onSendMessage}
          disabled={!message.trim()}
          sx={{ bgcolor: 'white', borderRadius: 1 }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AIAssistantPanel; 