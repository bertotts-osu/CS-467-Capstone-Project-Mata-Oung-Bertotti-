// AIAssistantPanel.jsx
// This component provides the interactive AI chat panel, including markdown/code rendering, message input, and chat history.

import React, { useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  TextField,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * AIAssistantPanel component.
 * Provides an interactive chat panel for AI assistance, with markdown/code rendering and message input.
 * @param {object} props
 * @param {function} props.onClick - Handler for clicking the panel (optional).
 * @param {Array} props.chatMessages - Array of chat message objects ({role, content}).
 * @param {string} props.message - Current message input value.
 * @param {function} props.onMessageChange - Handler for message input changes.
 * @param {function} props.onKeyPress - Handler for key press in message input.
 * @param {function} props.onSendMessage - Handler for sending a message.
 * @param {object} props.header - Header configuration (icon, title, onClose, onClearChat).
 */
const AIAssistantPanel = ({
  onClick,
  chatMessages,
  message,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  header,
}) => {
  const chatEndRef = useRef(null);

  // Auto-scroll to the latest message when chatMessages change.
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  /**
   * Clears the chat history if the header provides an onClearChat handler.
   */
  const handleClearChat = () => {
    if (typeof header?.onClearChat === "function") {
      header.onClearChat();
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        width: "max-content",
        maxWidth: 600,
        minWidth: 320,
        minHeight: 300,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        borderRadius: 0,
        m: 0,
        p: 0,
        position: "fixed",
        bottom: 20,
        right: 5,
        height: "maxContent",
        resize: "both",
        overflow: "auto",
        boxShadow: 3,
        zIndex: 1301,
      }}
      aria-label="AI Algorithm Mentor"
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#e0e0e0",
          p: 1,
        }}
      >
        {header?.icon && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {header.icon}
          </Box>
        )}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ flex: 1, ml: header?.icon ? 1 : 0 }}
        >
          {header?.title || "AI Algorithm Mentor"}
        </Typography>
        {header?.onClearChat && (
          <Tooltip title="Clear Chat">
            <IconButton
              size="small"
              onClick={handleClearChat}
              aria-label="Clear chat"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <IconButton
          size="small"
          onClick={header?.onClose}
          aria-label="Close panel"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ m: 0 }} />

      {/* Chat Messages Area */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {chatMessages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              mb: 1.5,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              bgcolor: msg.role === "user" ? "primary.light" : "grey.100",
              color: msg.role === "user" ? "white" : "text.primary",
              px: 2,
              py: .5,
              boxShadow: 1,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              fontSize: 14,
              maxWidth: "max-content"
            }}
          >
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={materialDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </Box>
        ))}
        <div ref={chatEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 1,
          bgcolor: "#f5f7fa",
          alignItems: "center",
          borderTop: "1px solid #ccc",
        }}
      >
        <TextField
          fullWidth
          size="medium"
          placeholder="Ask your questions here..."
          value={message}
          onChange={onMessageChange}
          onKeyPress={onKeyPress}
          variant="outlined"
          sx={{ bgcolor: "white", fontSize: 14, boxShadow: 0 }}
          multiline
          minRows={1}
          maxRows={3}
        />
        <Tooltip title="Send (Enter)">
          <span>
            <IconButton
              color="primary"
              onClick={onSendMessage}
              disabled={!message.trim()}
              sx={{ bgcolor: "white", boxShadow: 1 }}
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
