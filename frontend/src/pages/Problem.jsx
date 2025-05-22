// import React, { useState, useCallback, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   IconButton,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Tabs,
//   Tab,
//   Divider,
//   Alert,
//   Snackbar,
//   Modal,
//   Fab,
//   Tooltip,
//   AppBar,
//   Toolbar,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ErrorIcon from "@mui/icons-material/Error";
// import CloseIcon from "@mui/icons-material/Close";
// import Layout from "../components/Layout";
// import CodeEditor from "../components/Editor";
// import ErrorBoundary from "../components/ErrorBoundary";
// import { executeCode, fetchProblem } from "../http_requests/ProblemAPIs";
// import ProblemDescription from "../components/ProblemDescription";
// import CodeEditorPanel from "../components/CodeEditorPanel";
// import AIAssistantPanel from "../components/AIAssistantPanel";
// import { useLocation, useNavigate } from "react-router-dom";
// import { devMode } from "../config";
// import { sendMessageToGPT } from "../http_requests/ChatGptAPI";
// import FeedbackIcon from "@mui/icons-material/Feedback";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import Navbar from "../components/Navbar";
// import TestCaseResults from "../components/TestCaseResults";

// const Problem = () => {
//   const [code, setCode] = useState();
//   const [message, setMessage] = useState("");
//   const [consoleTab, setConsoleTab] = useState(0);
//   const [consoleOutput, setConsoleOutput] = useState("");
//   const [chatMessages, setChatMessages] = useState([
//     {
//       role: "assistant",
//       content: "Hi there! I'm here to help you with your solution.",
//     },
//   ]);
//   const [error, setError] = useState(null);
//   const [problem, setProblem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showHintButton, setShowHintButton] = useState(true);
//   const location = useLocation();
//   const [openAIModal, setOpenAIModal] = useState(false);
//   const [aiPanelOpen, setAIPanelOpen] = useState(false);
//   const navigate = useNavigate();
//   const [passFailStatus, setPassFailStatus] = useState(null);
//   const [testResultDetails, setTestResultDetails] = useState([]);
//   const [hideRawConsole, setHideRawConsole] = useState(false);

//   const handleCodeChange = useCallback((newValue) => {
//     try {
//       setCode(newValue);
//     } catch (error) {
//       console.error("Code change error:", error);
//       setError("Failed to update code. Please try again.");
//     }
//   }, []);

//   const handleConsoleTabChange = (event, newValue) => {
//     setConsoleTab(newValue);
//   };

//   const handleMessageChange = (event) => {
//     setMessage(event.target.value);
//   };

//   const handleSendMessage = useCallback(async () => {
//     if (!message.trim()) {
//       setError("Please enter a message.");
//       return;
//     }
//     const newUserMessage = { role: 'user', content: message };
//     const updatedMessages = [...chatMessages, newUserMessage];
//     setChatMessages(updatedMessages);
//     setMessage('');

//     const assistantReply = await sendMessageToGPT({
//       messages: updatedMessages,
//       problem: problem?.prompt || '',
//       code: code || '',
//       console_output: consoleOutput || '',
//     });

//     setChatMessages(prev => [...prev, { role: 'assistant', content: assistantReply }]);
//   }, [message, chatMessages, problem, code, consoleOutput]);

//   const handleKeyPress = useCallback(
//     (event) => {
//       if (event.key === "Enter" && !event.shiftKey) {
//         event.preventDefault();
//         handleSendMessage();
//       }
//     },
//     [handleSendMessage]
//   );
//   const handleHintClick = useCallback(async () => {
//     const hintRequest = 'Can I have a hint?';
//     setChatMessages(prev => [...prev, { role: 'user', content: hintRequest }]);
//     setShowHintButton(false);

//     const assistantReply = await sendMessageToGPT({
//       user_request: hintRequest,
//       submission: "no",
//       hint: "yes",
//     });

//     setChatMessages(prev => [...prev, { role: 'assistant', content: assistantReply }]);
//   }, [code]);

//   const handleSubmit = useCallback(async () => {
//     try {
//       setConsoleOutput("Submitting code...");
//       setConsoleTab(0);
//       const response = await executeCode({ code });

//       if ("result" in response.data) {
//         const overallResult = response.data.result;
//         setPassFailStatus(overallResult ? "pass" : "fail");

//         // Set the test details state so that we can render it in the TestCaseResults component.
//         setTestResultDetails(response.data.result_details);

//         const testCaseDetails = response.data.result_details
//           .map((tc, idx) => {
//             return `Test Case ${idx + 1}:
// Input: ${tc.input}
// Expected Output: ${tc.expected_output}
// User Output: ${tc.user_output}
// Result: ${tc.result}${tc.error ? `\nError: ${tc.error}` : ""}`;
//           })
//           .join("\n\n");

//         const resultMsg = `Overall Result: ${
//           overallResult ? "Passed" : "Failed"
//         }\n\n${testCaseDetails}`;
//         setConsoleOutput(resultMsg);
//       } else {
//         // Fallback behavior: use simple output/error response
//         const { output, error, success } = response.data;
//         let resultMsg = "";
//         if (success) {
//           resultMsg = `Output:\n${output}`;
//           setPassFailStatus("pass");
//         } else {
//           resultMsg = `Error:\n${error || "Unknown error."}`;
//           setPassFailStatus("fail");
//         }
//         setConsoleOutput(resultMsg);
//         setTestResultDetails([]);
//       }
//     } catch (error) {
//       console.error("Submit error:", error);
//       setConsoleOutput("Error submitting code.");
//       setPassFailStatus("fail");
//       setTestResultDetails([]);
//     }
//   }, [code]);

//   useEffect(() => {
//     async function loadProblem() {
//       setLoading(true);
//       setError(null);
//       try {
//         const pattern = location.state?.pattern || 'Sliding Window';
//         const difficulty = location.state?.difficulty || 'Medium';
//         const response = await fetchProblem({ pattern, difficulty });
//         setProblem(response.data);

//         if (response.data.attempt_id) {
//           localStorage.setItem("attemptId", response.data.attempt_id);
//         }
//       } catch (err) {
//         setError(err.response?.data?.error || err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadProblem();
//   }, [location.state]);

//   return (
//     <ErrorBoundary>
//       {/* Navigation Bar */}
//       <Navbar />
//       <Box
//         sx={{
//           width: "100vw",
//           height: "100vh",
//           bgcolor: "#1e1e1e",
//           display: "flex",
//           flexDirection: "column",
//           minHeight: 0,
//           p: 0,
//           m: 0,
//         }}
//       >
//         {/* Dev Mode Banner */}
//         {devMode && (
//           <Box
//             p={1}
//             bgcolor="warning.main"
//             color="white"
//             textAlign="center"
//             fontWeight={500}
//           >
//             <Typography variant="body2">
//               ⚠️ Dev Mode is ON — Auth is currently bypassed for testing
//             </Typography>
//           </Box>
//         )}

//         {/* Error Snackbar */}
//         <Snackbar
//           open={!!error}
//           autoHideDuration={6000}
//           onClose={() => setError(null)}
//           anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         >
//           <Alert
//             onClose={() => setError(null)}
//             severity="error"
//             sx={{ width: "100%" }}
//           >
//             {error}
//           </Alert>
//         </Snackbar>

//         {/* Main content area */}
//         <Box
//           sx={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "row",
//             alignItems: "stretch",
//             justifyContent: "center",
//             minHeight: 0,
//             transition: "all 0.3s",
//             p: 0,
//             m: 0,
//           }}
//           aria-label="Problem Page Main Content"
//         >
//           {/* Problem Description - Left Side */}
//           <Box
//             sx={{
//               width: "50%",
//               minWidth: 0,
//               height: "100%",
//               minHeight: 0,
//               p: 0,
//               m: 0,
//             }}
//             aria-label="Problem Description Area"
//           >
//             <ProblemDescription problem={problem} loading={loading} />

//             {/*Display test cases results*/}
//             {consoleOutput && !hideRawConsole && (
//               <Box sx={{ mt: 2 }}>
//                 <TestCaseResults
//                   resultDetails={testResultDetails}
//                   overallResult={passFailStatus === "pass"}
//                 />
//               </Box>
//             )}
//           </Box>

//           {/* Code Editor Section - Middle */}
//           <Box
//             sx={{
//               width: "50%",
//               minWidth: 0,
//               height: "100%",
//               minHeight: 0,
//               p: 0,
//               m: 0,
//             }}
//             aria-label="Code Editor Section"
//           >
//             <CodeEditorPanel
//               code={code}
//               onCodeChange={handleCodeChange}
//               onSubmit={handleSubmit}
//               consoleTab={consoleTab}
//               onConsoleTabChange={handleConsoleTabChange}
//               consoleOutput={consoleOutput}
//               setAIPanelOpen={setAIPanelOpen}
//               passFailStatus={passFailStatus}
//               // onRetry={handleRetry}
//             />
//           </Box>

//           {/* AI Assistant - Right Side, only show if open */}
//           {aiPanelOpen && (
//             <AIAssistantPanel
//               chatMessages={chatMessages}
//               message={message}
//               onMessageChange={handleMessageChange}
//               onKeyPress={handleKeyPress}
//               onSendMessage={handleSendMessage}
//               showHintButton={showHintButton}
//               onHintClick={handleHintClick}
//               sx={{
//                 boxShadow: 6,
//                 borderRadius: 2,
//                 p: 0,
//                 m: 2,
//                 bgcolor: 'white',
//                 minWidth: 340,
//                 maxWidth: 400,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 height: 'calc(100% - 32px)'
//               }}
//               header={{
//                 icon: <FeedbackIcon color="primary" sx={{ mr: 1 }} />,
//                 title: "AI Help & Feedback",
//                 onClose: () => setAIPanelOpen(false),
//                 onClearChat: () =>
//                   setChatMessages([
//                     {
//                       role: "assistant",
//                       content:
//                         "Hi there! I'm here to help you with your solution.",
//                     },
//                   ]),
//               }}
//               aria-label="AI Assistant Panel"
//             />
//           )}
//         </Box>

//         <Modal
//           open={openAIModal}
//           onClose={() => setOpenAIModal(false)}
//           aria-label="AI Assistant Modal"
//         >
//           <Box
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               width: 400,
//               bgcolor: "background.paper",
//               boxShadow: 24,
//               borderRadius: 2,
//               p: 2,
//               outline: "none",
//               display: "flex",
//               flexDirection: "column",
//               maxHeight: "80vh",
//               minWidth: { xs: "90vw", sm: 400 },
//               minHeight: 400,
//             }}
//             aria-label="AI Assistant Modal Content"
//           >
//             <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//               <IconButton
//                 onClick={() => setOpenAIModal(false)}
//                 aria-label="Close AI Assistant Modal"
//               >
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//             <AIAssistantPanel
//               chatMessages={chatMessages}
//               message={message}
//               onMessageChange={handleMessageChange}
//               onKeyPress={handleKeyPress}
//               onSendMessage={handleSendMessage}
//               header={{
//                 icon: <FeedbackIcon color="primary" sx={{ mr: 1 }} />,
//                 title: "AI Help & Feedback",
//                 onClose: () => setOpenAIModal(false),
//                 onClearChat: () =>
//                   setChatMessages([
//                     {
//                       role: "assistant",
//                       content:
//                         "Hi there! I'm here to help you with your solution.",
//                     },
//                   ]),
//               }}
//               aria-label="AI Assistant Panel in Modal"
//             />
//           </Box>
//         </Modal>
//       </Box>
//     </ErrorBoundary>
//   );
// };

// export default Problem;
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
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
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

const Problem = () => {
  const [code, setCode] = useState();
  const [message, setMessage] = useState("");
  const [consoleTab, setConsoleTab] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm here to help you with your solution.",
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

  const handleCodeChange = useCallback((newValue) => {
    if (!newValue) return;
    console.log(newValue);
    setCode(newValue); // Updates the state correctly

    console.log("Code updated:", newValue); // Debugging log to verify updates
  }, []);

  const handleConsoleTabChange = (event, newValue) => {
    setConsoleTab(newValue);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }
    const newUserMessage = { role: "user", content: message };
    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);
    setMessage("");

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
  }, [message, chatMessages, problem, code, consoleOutput]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleHintClick = useCallback(async () => {
    const hintRequest = "Can I have a hint?";
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: hintRequest },
    ]);
    setShowHintButton(false);

    const assistantReply = await sendMessageToGPT({
      user_request: hintRequest,
      submission: "no",
      hint: "yes",
    });

    setChatMessages((prev) => [
      ...prev,
      { role: "assistant", content: assistantReply },
    ]);
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
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

        // Embed test case results inside console output instead of separate TestCaseResults
        setConsoleOutput(resultMsg);
      } else {
        // Fallback: simple output/error response
        const { output, error, success } = response.data;
        setConsoleOutput(
          success
            ? `Output:\n${output}`
            : `Error:\n${error || "Unknown error."}`
        );
        setPassFailStatus(success ? "pass" : "fail");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setConsoleOutput("Error submitting code.");
      setPassFailStatus("fail");
    }
  }, [code]);

  useEffect(() => {
    async function loadProblem() {
      setLoading(true);
      setError(null);
      try {
        const pattern = location.state?.pattern || "Sliding Window";
        const difficulty = location.state?.difficulty || "Medium";
        const response = await fetchProblem({ pattern, difficulty });
        setProblem(response.data);

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
  }, [location.state]);

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
          }}
          aria-label="Problem Page Main Content"
        >
          {/* Problem Description Area (with examples and test cases) */}
          <Box aria-label="Problem Description Area">
            <ProblemDescription problem={problem} loading={loading} />
            {consoleOutput && !hideRawConsole && (
              <Box>
                <TestCaseResults
                  resultDetails={testResultDetails}
                  overallResult={passFailStatus === "pass"}
                />
              </Box>
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

        {/* Floating Action Button for the Chat Modal */}
        <Fab
          onClick={() => setOpenAIModal(true)}
          aria-label="Open Chat Modal"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <HelpOutlineIcon />
        </Fab>

        {/* AI Chat Modal */}
        <Modal
          open={openAIModal}
          onClose={() => setOpenAIModal(false)}
          hideBackdrop
          aria-labelledby="ai-assistant-modal-title"
          aria-describedby="ai-assistant-modal-description"
          sx={{
            pointerEvents: "none", // prevents the full-screen wrapper from blocking interaction
          }}
        >
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              width: 350,
              height: "80vh",
              bgcolor: "background.paper",
              boxShadow: 4,
              p: 2,
              overflowY: "auto",
              borderRadius: 2,
              zIndex: 1300,
              pointerEvents: "auto", // allows interaction inside the box
            }}
            aria-label="AI Assistant Chat Panel"
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                onClick={() => setOpenAIModal(false)}
                aria-label="Close Chat Modal"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <AIAssistantPanel
              chatMessages={chatMessages}
              message={message}
              onMessageChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              onSendMessage={handleSendMessage}
              header={{
                icon: <FeedbackIcon color="primary" sx={{ mr: 1 }} />,
                title: "AI Help & Feedback",
                onClose: () => setOpenAIModal(false),
                onClearChat: () =>
                  setChatMessages([
                    {
                      role: "assistant",
                      content:
                        "Hi there! I'm here to help you with your solution.",
                    },
                  ]),
              }}
              aria-label="AI Assistant Panel in Modal"
            />
          </Box>
        </Modal>
      </Box>
    </ErrorBoundary>
  );
};

export default Problem;
