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
import { useUserStats } from "../contexts/UserStatsContext";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

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

function ProgressBar({ label, percent, icon, color, completed, breakdown, stepStatus }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Box display="flex" alignItems="center">
          {icon && <Box mr={1}>{icon}</Box>}
          <Typography variant="body2" fontWeight={600}>
            {label}
            {completed && (
              <CheckCircleIcon sx={{ color: 'green', ml: 1, verticalAlign: 'middle' }} fontSize="small" />
            )}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {percent}%
        </Typography>
      </Box>
      <Box position="relative" width="100%" mb={1}>
        <LinearProgress
          variant="determinate"
          value={percent}
          color={color}
          sx={{ height: 8, borderRadius: 4 }}
        />
        {/* Step icons overlay - absolutely positioned, now with Start */}
        {stepStatus && ['Start', 'Easy', 'Medium', 'Hard'].map((diff, idx) => {
          // 0% for Start, 33% for Easy, 67% for Medium, 100% for Hard
          const leftPercent = idx === 0 ? '0%' : idx === 1 ? '33.3%' : idx === 2 ? '66.6%' : '100%';
          // Step fill logic: Start always empty, Easy if easyComplete, Medium if mediumComplete, Hard if hardComplete
          let filled = false;
          if (idx === 1) filled = stepStatus['Easy'];
          else if (idx === 2) filled = stepStatus['Medium'];
          else if (idx === 3) filled = stepStatus['Hard'];
          return (
            <Box
              key={diff}
              position="absolute"
              top="50%"
              left={leftPercent}
              sx={{
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {filled
                ? <CheckCircleIcon sx={{ color: 'green', background: 'white', borderRadius: '50%' }} fontSize="small" />
                : <RadioButtonUncheckedIcon sx={{ color: 'grey.400', background: 'white', borderRadius: '50%' }} fontSize="small" />}
            </Box>
          );
        })}
      </Box>
      {/* Step labels under the bar, aligned with icons */}
      {stepStatus && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          {['Start', 'Easy', 'Medium', 'Hard'].map((diff, idx) => (
            <Box key={diff} sx={{ width: '25%', textAlign: idx === 0 ? 'left' : idx === 1 ? 'center' : idx === 2 ? 'center' : 'right' }}>
              <Typography variant="caption" color="text.secondary">
                {diff}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {breakdown && stepStatus && (
        <Box mt={0.5} display="flex" gap={2}>
          {['Easy', 'Medium', 'Hard'].map((diff) => (
            <Typography key={diff} variant="caption" color="text.secondary">
              {diff}: {breakdown[diff]?.solved ?? 0}/{breakdown[diff]?.total ?? 0}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}

ProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  icon: PropTypes.element,
  color: PropTypes.string.isRequired,
  completed: PropTypes.bool,
  breakdown: PropTypes.object,
  stepStatus: PropTypes.object,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { userStats, loading, error } = useUserStats();
  const [showStepwise, setShowStepwise] = useState(false);

  // Helper to get total solved for a pattern
  function getPatternSolvedCount(pattern) {
    if (!userStats || !userStats.solvedStats) return 0;
    const difficulties = userStats.solvedStats[pattern] || {};
    return Object.values(difficulties).reduce((a, b) => a + b, 0);
  }

  function getPatternTotal(pattern) {
    return TOTAL_PROBLEMS[pattern] || 0;
  }

  function getPatternStepwisePercent(pattern) {
    if (!userStats || !userStats.solvedStats) return 0;
    const stats = userStats.solvedStats[pattern] || {};
    const easyComplete = (stats['Easy'] || 0) >= 3;
    const mediumComplete = (stats['Medium'] || 0) >= 3;
    const hardTotal = (TOTAL_PROBLEMS[pattern] || 0) - 6;
    const hardComplete = (stats['Hard'] || 0) >= hardTotal && hardTotal > 0;
    if (easyComplete && mediumComplete && hardComplete) return 100;
    if (easyComplete && mediumComplete) return 67;
    if (easyComplete) return 33;
    return 0;
  }

  if (error) {
    return <Layout backgroundImage="/dashboard_hexagon.jpg"><Box textAlign="center" mt={8}><Typography color="error">{error}</Typography></Box></Layout>;
  }

  return (
    <Layout backgroundImage="/dashboard_hexagon.jpg" loading={loading}>
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
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant={showStepwise ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => setShowStepwise((prev) => !prev)}
          >
            {showStepwise ? 'Hide In-Depth Progress' : 'Show In-Depth Progress'}
          </Button>
        </Box>
        <Typography variant="h6" mb={2}>
          Pattern Progress
        </Typography>
        {PATTERNS.map((pattern) => {
          const solved = getPatternSolvedCount(pattern.name);
          const total = getPatternTotal(pattern.name);
          let percent = getPatternStepwisePercent(pattern.name);
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
          // Calculate breakdown by difficulty
          const solvedStats = userStats?.solvedStats?.[pattern.name] || {};
          const breakdown = {
            Easy: { solved: solvedStats['Easy'] || 0, total: 3 },
            Medium: { solved: solvedStats['Medium'] || 0, total: 3 },
            Hard: { solved: solvedStats['Hard'] || 0, total: total - 6 },
          };
          const completed = solved === total && total > 0;
          const stepStatus = {
            Easy: (solvedStats['Easy'] || 0) >= 3,
            Medium: (solvedStats['Medium'] || 0) >= 3,
            Hard: (solvedStats['Hard'] || 0) >= (total - 6) && (total - 6) > 0,
          };
          return (
            <ProgressBar
              key={pattern.name}
              label={showStepwise ? `${pattern.name} (Solved: ${solved})` : pattern.name}
              percent={percent}
              color={pattern.color}
              icon={progressIcon}
              completed={completed}
              breakdown={breakdown}
              stepStatus={showStepwise ? stepStatus : undefined}
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