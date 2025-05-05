import React from 'react';
import { Box, Paper, Typography, TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const AIAssistantPanel = ({
  chatMessages,
  message,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  showHintButton,
  onHintClick
}) => (
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
          onChange={onMessageChange}
          onKeyPress={onKeyPress}
          variant="outlined"
        />
        <IconButton 
          color="primary" 
          onClick={onSendMessage}
          disabled={!message.trim()}
        >
          <SendIcon />
        </IconButton>
        {showHintButton && (
          <Button variant="outlined" size="small" onClick={onHintClick} sx={{ ml: 1 }}>
            Can I have a hint?
          </Button>
        )}
      </Box>
    </Box>
  </Paper>
);

export default AIAssistantPanel; 