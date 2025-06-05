// About.jsx
// This page provides an overview of the platform and instructions for new users on how to navigate and use the main features.

import React from "react";
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Stepper, Step, StepLabel, Button, Link, Divider, Avatar, Stack } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import Layout from "../components/Layout";

// Steps for the vertical stepper, each representing a main feature of the platform
const steps = [
  {
    label: "Dashboard",
    icon: <DashboardIcon color="primary" />, 
    description: "Track your progress, streaks, and get a quick overview of your learning journey."
  },
  {
    label: "Roadmap",
    icon: <MapIcon color="secondary" />, 
    description: "Visualize your algorithm learning path, see your progress, and jump to the next recommended problem."
  },
  {
    label: "Problem Page",
    icon: <MenuBookIcon color="success" />, 
    description: "Read the problem, use the code editor, and submit your solution. Reveal difficulty and ask for AI hints!"
  },
  {
    label: "AI Mentor",
    icon: <SmartToyIcon color="info" />, 
    description: "Get instant help, hints, and explanations from the AI Mentor. Use the chat panel for guidance."
  },
];

/**
 * About page component.
 * Displays an introduction and instructions for using the AI Algorithm Mentor platform.
 */
export default function About() {
  return (
    <Layout centeredContent={false} backgroundImage="/help.jpg">
      <Paper elevation={8} sx={{ maxWidth: 800, mx: 'auto', mt: 6, mb: 6, p: 4, borderRadius: 6, boxShadow: 10 }}>
        <Box textAlign="center" mb={3}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
            <HelpOutlineIcon fontSize="large" />
          </Avatar>
          <Typography variant="h3" fontWeight={800} color="primary.main" gutterBottom>
            Welcome to AI Algorithm Mentor!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your interactive platform for mastering algorithms with the help of AI.
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h5" fontWeight={700} mb={2}>
          How to Use the Platform
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          {/* Instructions for using the main features, with links to each page */}
          Use the <Link href="/dashboard" color="primary" underline="hover">Dashboard</Link> to track your progress and streaks. Explore the <Link href="/roadmap" color="secondary" underline="hover">Roadmap</Link> to visualize your learning path and jump to the next recommended problem. On the <Link href="/problem" color="success" underline="hover">Problem page</Link>, read the problem, use the code editor, and submit your solution. The AI Mentor is always available for hints and explanations!
        </Typography>
        {/* Stepper showing the main features of the platform */}
        <Stepper orientation="vertical" activeStep={-1} sx={{ mb: 4 }}>
          {steps.map((step, idx) => (
            <Step key={step.label}>
              <StepLabel icon={step.icon}>
                <Typography variant="h6" fontWeight={600}>{step.label}</Typography>
              </StepLabel>
              <Box ml={6} mb={2}>
                <Typography color="text.secondary">{step.description}</Typography>
              </Box>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Layout>
  );
} 