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
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import SearchIcon from '@mui/icons-material/Search';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WindowIcon from '@mui/icons-material/Window';
import UndoIcon from '@mui/icons-material/Undo';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { devMode } from "../config";
import { useNavigate } from "react-router-dom";
import { fetchUserStats } from "../http_requests/AuthenticationAPIs";

// Problem totals per pattern (from ProblemData.csv)
const TOTAL_PROBLEMS = {
  "Greedy Algorithm": 9,
  "Sliding Window": 9,
  "Divide and Conquer": 9,
  "Backtracking": 9,
  "Binary Search": 10,
  "Two Pointers": 9,
};

const PATTERNS = [
  { name: "Binary Search", color: "primary" },
  { name: "Divide and Conquer", color: "secondary" },
  { name: "Greedy Algorithm", color: "success" },
  { name: "Sliding Window", color: "info" },
  { name: "Backtracking", color: "warning" },
  { name: "Two Pointers", color: "error" },
];

function ProgressBar({ label, percent, icon, color }) {
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
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
}

ProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  icon: PropTypes.element,
  color: PropTypes.string.isRequired,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get total solved for a pattern
  function getPatternSolvedCount(pattern) {
    if (!userStats || !userStats.solvedStats) return 0;
    const difficulties = userStats.solvedStats[pattern] || {};
    return Object.values(difficulties).reduce((a, b) => a + b, 0);
  }

  function getPatternTotal(pattern) {
    return TOTAL_PROBLEMS[pattern] || 0;
  }

  function getPatternPercent(pattern) {
    const solved = getPatternSolvedCount(pattern);
    const total = getPatternTotal(pattern);
    return total > 0 ? Math.round((solved / total) * 100) : 0;
  }

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

      <LearningMenuPlaceholder userStats={userStats} />

      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" mb={2}>
          Pattern Progress
        </Typography>
        {PATTERNS.map((pattern) => {
          const solved = getPatternSolvedCount(pattern.name);
          const total = getPatternTotal(pattern.name);
          const percent = getPatternPercent(pattern.name);
          let progressIcon;
          switch (pattern.name) {
            case "Binary Search":
              progressIcon = <SearchIcon color={pattern.color} />;
              break;
            case "Divide and Conquer":
              progressIcon = <CallSplitIcon color={pattern.color} />;
              break;
            case "Greedy Algorithm":
              progressIcon = <AttachMoneyIcon color={pattern.color} />;
              break;
            case "Sliding Window":
              progressIcon = <WindowIcon color={pattern.color} />;
              break;
            case "Backtracking":
              progressIcon = <UndoIcon color={pattern.color} />;
              break;
            case "Two Pointers":
              progressIcon = <CompareArrowsIcon color={pattern.color} />;
              break;
            default:
              progressIcon = <StarIcon color={pattern.color} />;
          }
          return (
            <ProgressBar
              key={pattern.name}
              label={`${pattern.name} (${solved}/${total})`}
              percent={percent}
              color={pattern.color}
              icon={progressIcon}
            />
          );
        })}
      </Paper>
    </Layout>
  );
}

function LearningMenuPlaceholder({ userStats }) {
  const navigate = useNavigate();
  function getNextDifficulty(pattern) {
    const stats = userStats?.solvedStats?.[pattern] || {};
    if ((stats['Easy'] || 0) < 3) return 'Easy';
    if ((stats['Medium'] || 0) < 3) return 'Medium';
    return 'Hard';
  }
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
            onClick={() => {
              const difficulty = getNextDifficulty(pattern.name);
              navigate('/problem', { state: { pattern: pattern.name, difficulty } });
            }}
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