import React, { useEffect, useState } from "react";
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
import { fetchUserStats } from "../http_requests/AuthenticationAPIs";

// Use a static array of patterns that match the backend
const PATTERNS = [
  { name: "Binary Search", color: "primary" },
  { name: "Divide and Conquer", color: "secondary" },
  { name: "Greedy Algorithm", color: "success" },
  { name: "Sliding Window", color: "primary" }
];

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
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchUserStats();
        setUserStats(response.data);
      } catch (err) {
        setError("Failed to load user stats.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <Layout backgroundImage="/dashboard_hexagon.jpg"><Box textAlign="center" mt={8}><Typography>Loading...</Typography></Box></Layout>;
  }
  if (error) {
    return <Layout backgroundImage="/dashboard_hexagon.jpg"><Box textAlign="center" mt={8}><Typography color="error">{error}</Typography></Box></Layout>;
  }

  return (
    <Layout backgroundImage="/dashboard_hexagon.jpg">
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Welcome!
        </Typography>
        <Typography color="text.secondary">
          Your personalized algorithm journey starts here.
        </Typography>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
        gap={3}
        mb={4}
      >
        <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h3" color="primary" fontWeight={700}>
            {userStats?.streakInfo?.problemsSolved ?? 0}
          </Typography>
          <Typography color="text.secondary">Problems Solved</Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h3" sx={{ color: "#9c27b0", fontWeight: 700 }}>
            {userStats?.streakInfo?.currentStreak ?? 0}
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

function LearningMenuPlaceholder() {
  const navigate = useNavigate();
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        <MenuBookIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Learning Menu
      </Typography>
      <List dense>
        {PATTERNS.map((pattern) => (
          <ListItem
            button
            key={pattern.name}
            onClick={() => navigate('/problem', { state: { pattern: pattern.name, difficulty: "Easy" } })}
          >
            <ListItemIcon>
              <AutoGraphIcon color={pattern.color} />
            </ListItemIcon>
            <ListItemText primary={pattern.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}