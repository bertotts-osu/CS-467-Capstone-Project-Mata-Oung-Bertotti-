import React from "react";
import PropTypes from "prop-types";
import {
    Box,
    Paper,
    Typography,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Button
} from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import StarIcon from '@mui/icons-material/Star';
import BoltIcon from '@mui/icons-material/Bolt';
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { devMode } from "../config";
import { useNavigate } from "react-router-dom";

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
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        <MenuBookIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Learning Menu
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <AutoGraphIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Recursion" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <AutoGraphIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Sliding Window" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <AutoGraphIcon color="success" />
          </ListItemIcon>
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
          <Typography variant="body2" fontWeight={600}>
            {label}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {percent}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
}

ProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  icon: PropTypes.element,
};


export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <Layout backgroundImage="/public/dashboard_hexagon.jpg">

      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Welcome, {user.name}!
        </Typography>
        <Typography color="text.secondary">
          Your personalized algorithm journey starts here.
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontWeight: 600, borderRadius: 2 }}
            onClick={() => navigate('/problem')}
          >
            Go to Problem Section
          </Button>
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr 1fr" }}
        gap={3}
        mb={4}
      >
        <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h3" color="primary" fontWeight={700}>
            {user.stats.problemsSolved}
          </Typography>
          <Typography color="text.secondary">Problems Solved</Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h3" color="secondary" fontWeight={700}>
            {user.stats.patternsMastered}
          </Typography>
          <Typography color="text.secondary">Patterns Mastered</Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h3" sx={{ color: "#9c27b0", fontWeight: 700 }}>
            {user.stats.currentStreak}
          </Typography>
          <Typography color="text.secondary">Current Streak</Typography>
        </Paper>
      </Box>

      <LearningMenuPlaceholder />

      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" mb={2}>
          Pattern Progress
        </Typography>
        <ProgressBar label="Recursion" percent={80} icon={<StarIcon color="primary" />} />
        <ProgressBar label="Sliding Window" percent={40} icon={<BoltIcon color="secondary" />} />
        <ProgressBar label="Two Pointers" percent={60} icon={<StarIcon sx={{ color: "#43a047" }} />} />
      </Paper>
    </Layout>
  );
}