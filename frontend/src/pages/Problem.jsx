// Problem.jsx
// This page provides the interactive coding problem interface, including the code editor, problem description, test case results, and AI assistant chat.

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
  Divider,
  Alert,
  Snackbar,
  Modal,
  Fab,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CodeEditorPanel from "../components/CodeEditorPanel";
import ErrorBoundary from "../components/ErrorBoundary";
import { executeCode, fetchProblem } from "../http_requests/ProblemAPIs";
import ProblemDescription from "../components/ProblemDescription";
import AIAssistantPanel from "../components/AIAssistantPanel";
import TestCaseResults from "../components/TestCaseResults";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { devMode } from "../config";
import { sendMessageToGPT } from "../http_requests/ChatGptAPI";
import { red } from "@mui/material/colors";
import CircularProgress from "@mui/material/CircularProgress";
import logo from "../assets/logo.png";
import { useUserStats } from "../contexts/UserStatsContext";

/**
 * Problem page component.
 * Provides the main interface for solving coding problems, submitting code, viewing results, and interacting with the AI mentor.
 */
const Problem = () => {
  // State variables for code, chat, UI, and problem data
  const [code, setCode] = useState();
  const [message, setMessage] = useState("");
  const [consoleTab, setConsoleTab] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! Let me know how I can help.",
    },
  ]);
  const [error, setError] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHintButton, setShowHintButton] = useState(true);
  const location = useLocation();
  const [openAIModal, setOpenAIModal] = useState(false);
  const navigate = useNavigate();
  const [passFailStatus, setPassFailStatus] = useState(null);
  const [testResultDetails, setTestResultDetails] = useState([]);
  const [hideRawConsole, setHideRawConsole] = useState(false);
  const [showHoverText, setShowHoverText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const { refreshUserStats } = useUserStats();

  /**
   * Handles code changes in the editor.
   * @param {string} newValue - The updated code.
   */
  const handleCodeChange = useCallback((newValue) => {
    if (!newValue) return;
    setCode(newValue); // Updates the state correctly
  }, []);

  /**
   * Handles tab changes in the console output area.
   */
  const handleConsoleTabChange = (event, newValue) => {
    setConsoleTab(newValue);
  };

  /**
   * Handles changes in the AI chat message input.
   */
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  /**
   * Sends a message to the AI assistant and updates the chat.
   */
  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }
    const newUserMessage = { role: "user", content: message };
    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);
    setMessage("");
    try {
      const assistantReply = await sendMessageToGPT({
        messages: updatedMessages,
        problem: problem?.prompt || "",
        code: code || "",
        console_output: consoleOutput || "",
      });
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantReply },
      ]);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [message, chatMessages, problem, code, consoleOutput, navigate]);

  /**
   * Handles Enter key press in the chat input to send message.
   */
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  /**
   * Requests a hint from the AI assistant.
   */
  const handleHintClick = useCallback(async () => {
    const hintRequest = "Can I have a hint?";
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: hintRequest },
    ]);
    setShowHintButton(false);
    try {
      const assistantReply = await sendMessageToGPT({
        user_request: hintRequest,
        submission: "no",
        hint: "yes",
      });
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantReply },
      ]);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [navigate]);

  /**
   * Submits the user's code for execution and displays results.
   */
  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true); // Show full-screen loader
      setConsoleOutput("Submitting code...");
      setConsoleTab(0);
      const response = await executeCode({ code });
      if ("result" in response.data) {
        const overallResult = response.data.result;
        setPassFailStatus(overallResult ? "pass" : "fail");
        const testCaseDetails = response.data.result_details
          .map(
            (tc, idx) => `Test Case ${idx + 1}:
Input: ${tc.input}
Expected Output: ${tc.expected_output}
User Output: ${tc.user_output}
Result: ${tc.result}${tc.error ? `\nError: ${tc.error}` : ""}`
          )
          .join("\n\n");
        const resultMsg = `Overall Result: ${
          overallResult ? "Passed" : "Failed"
        }\n\n${testCaseDetails}`;
        setConsoleOutput(resultMsg);
        // Trigger user stats re-fetch after a successful submission
        if (overallResult) {
          try {
            await refreshUserStats();
          } catch (err) {
            console.error("Failed to update user stats after submission", err);
          }
        }
      } else {
        const { output, error, success } = response.data;
        setConsoleOutput(
          success
            ? `Output:\n${output}`
            : `Error:\n${error || "Unknown error."}`
        );
        setPassFailStatus(success ? "pass" : "fail");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setConsoleOutput("Error submitting code.");
      setPassFailStatus("fail");
    } finally {
      setIsSubmitting(false); // Hide full-screen loader
    }
  }, [code, navigate, refreshUserStats]);

  /**
   * Reveals the problem's difficulty to the user.
   */
  const handleRevealDifficulty = () => setShowDifficulty(true);

  // Load the problem when the page loads or location changes
  useEffect(() => {
    async function loadProblem() {
      setLoading(true);
      setError(null);
      try {
        const pattern = location.state?.pattern || "Sliding Window";
        const difficulty = location.state?.difficulty || "Medium";
        const response = await fetchProblem({ pattern, difficulty });
        setProblem({ ...response.data, requestedDifficulty: difficulty });
        if (response.data.attempt_id) {
          localStorage.setItem("attemptId", response.data.attempt_id);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [location.state, navigate]);

  return (
    <ErrorBoundary>
      {/* Navigation Bar */}
      <Navbar />
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          bgcolor: "#1e1e1e",
          display: "flex",
          flexDirection: "column",
          p: 0,
          m: 0,
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
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Main Content Area: Vertical Layout */}

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            p: 2,
            bgcolor: "#fff",
            marginLeft: "30px",
            marginTop: "30px",
            borderLeft: "6px solid #1976d2",
            borderRadius: 0,
            height: "100%",
          }}
          aria-label="Problem Page Main Content"
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{ display: "flex", flexDirection: "column", maxWidth: "85%" }}
            >
              {/* Problem Description Area (with examples and test cases) */}
              <Box aria-label="Problem Description Area">
                <ProblemDescription problem={problem} loading={loading} showDifficulty={showDifficulty} onRevealDifficulty={handleRevealDifficulty} />
                {consoleOutput && !hideRawConsole && (
                    <TestCaseResults
                      resultDetails={testResultDetails}
                      overallResult={passFailStatus === "pass"}
                    />
                )}
              </Box>

              {/* Code Editor Section */}
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflow: "hidden",
                }}
                aria-label="Code Editor Section"
              >
                <CodeEditorPanel
                  code={code}
                  onCodeChange={handleCodeChange}
                  onSubmit={handleSubmit}
                  consoleTab={consoleTab}
                  onConsoleTabChange={handleConsoleTabChange}
                  consoleOutput={consoleOutput}
                  passFailStatus={passFailStatus}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Floating Action Button for the Chat Modal */}
        {!openAIModal && (
          <>
            <Fab
              onClick={() => setOpenAIModal(true)}
              aria-label="Open Chat Modal"
              sx={{
                position: "fixed",
                bottom: 75, // moved up slightly to make room for tooltip
                right: 75,
                zIndex: 1000,
                width: "85px",
                height: "85px",
                display: "flex",
                flexDirection: "column",
                fontSize: 12,
                bgcolor: "#1976D2",
                color: "#fafafa",
                "&:hover": {
                  bgcolor: "#004BA0",
                },
              }}
              onMouseEnter={() => setShowHoverText(true)}
              onMouseLeave={() => setShowHoverText(false)}
            >
              <img
                src={logo}
                alt="AI Algorithm Mentor Logo"
                style={{ height: "85px", verticalAlign: "middle" }}
              />
            </Fab>

            <div
              style={{
                position: "fixed",
                bottom: 47,
                right: 75,
                width: "85px",
                textAlign: "center",
                color: "#004BA0",
                fontSize: "14px",
                zIndex: 1001,
                fontWeight: "bold",
              }}
            >
              AI Mentor
            </div>
          </>
        )}

        {/* AI Chat Window (not a modal, but a fixed-position window) */}
        {openAIModal && (
          <AIAssistantPanel
            onClick={() => setOpenAIModal(false)}
            chatMessages={chatMessages}
            message={message}
            onMessageChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            onSendMessage={handleSendMessage}
            header={{
              icon: (
                <img
                  src={logo}
                  alt="AI Mentor Logo"
                  style={{ height: "35px", verticalAlign: "middle" }}
                />
              ),
              title: "AI Mentor",
              onClose: () => setOpenAIModal(false),
              onClearChat: () =>
                setChatMessages([
                  {
                    role: "assistant",
                    content: "Hi there! Let me know how I can help.",
                  },
                ]),
            }}
            aria-label="AI Assistant Panel Window"
          />
        )}
      </Box>
      {/* Full-Screen Submitting Modal */}
      <Modal
        open={isSubmitting}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 2000,
          flexDirection: "column",
        }}
        aria-labelledby="submission-loading"
        aria-describedby="submission-in-progress"
      >
        <>
          <CircularProgress size={80} thickness={5} sx={{ color: "#ffffff" }} />
          <Typography
            variant="h6"
            sx={{ color: "#ffffff", mt: 2, fontWeight: "bold" }}
          >
            Submitting...
          </Typography>
        </>
      </Modal>
    </ErrorBoundary>
  );
};

export default Problem;
