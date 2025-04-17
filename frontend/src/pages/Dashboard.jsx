import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, Grid, LinearProgress, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import StarIcon from '@mui/icons-material/Star';
import BoltIcon from '@mui/icons-material/Bolt';

// Placeholder for user data - replace with real user context or props
const user = {
  name: "Student",
  stats: {
    problemsSolved: 12,
    patternsMastered: 2,
    currentStreak: 5,
  },
};

// Placeholder LearningMenu component
function LearningMenuPlaceholder() {
  // Replace this with the actual LearningMenu component when available
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      {/* TODO: Integrate real Learning Menu */}
      <Typography variant="h6" gutterBottom>
        <MenuBookIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Learning Menu
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon><AutoGraphIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Recursion" />
        </ListItem>
        <ListItem>
          <ListItemIcon><AutoGraphIcon color="secondary" /></ListItemIcon>
          <ListItemText primary="Sliding Window" />
        </ListItem>
        <ListItem>
          <ListItemIcon><AutoGraphIcon color="success" /></ListItemIcon>
          <ListItemText primary="Two Pointers" />
        </ListItem>
      </List>
    </Paper>
  );
}

function ProgressBar({ label, percent, icon }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Box display="flex" alignItems="center">
          {icon && <Box mr={1}>{icon}</Box>}
          <Typography variant="body2" fontWeight={600}>{label}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">{percent}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 4 }} />
    </Box>
  );
}

ProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  icon: PropTypes.element,
};


export default function Dashboard() {
  return (
    <Box
      minHeight="100vh"
      width="100vw"
      bgcolor="#f5f6fa"
      display="flex"
      flexDirection="column"
      justifyContent={{ xs: 'flex-start', md: 'center' }}
      alignItems="center"
      py={{ xs: 2, md: 6 }}
    >
      <Box maxWidth={800} mx="auto">
        {/* Greeting */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Welcome, {user.name}!
          </Typography>
          <Typography color="text.secondary">
            Your personalized algorithm journey starts here.
          </Typography>
        </Box>

        {/* User Stats */}
        {/* User Stats - using CSS grid for layout, no deprecated Grid props */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap={3} mb={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h3" color="primary" fontWeight={700}>
              {user.stats.problemsSolved}
            </Typography>
            <Typography color="text.secondary">Problems Solved</Typography>
          </Paper>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h3" color="secondary" fontWeight={700}>
              {user.stats.patternsMastered}
            </Typography>
            <Typography color="text.secondary">Patterns Mastered</Typography>
          </Paper>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ color: '#9c27b0', fontWeight: 700 }}>
              {user.stats.currentStreak}
            </Typography>
            <Typography color="text.secondary">Current Streak</Typography>
          </Paper>
        </Box>
        {/*
          For best Material UI appearance, add this to your public/index.html <head>:
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        */}

        {/* Learning Menu Placeholder */}
        <LearningMenuPlaceholder />

        {/* Mock Progress Visualizations */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" mb={2}>Pattern Progress</Typography>
          <ProgressBar label="Recursion" percent={80} icon={<StarIcon color="primary" />} />
          <ProgressBar label="Sliding Window" percent={40} icon={<BoltIcon color="secondary" />} />
          <ProgressBar label="Two Pointers" percent={60} icon={<StarIcon sx={{ color: '#43a047' }} />} />
        </Paper>
      </Box>
    </Box>
  );
}