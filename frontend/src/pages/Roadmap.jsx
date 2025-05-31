import React from "react";
import { Box, Typography, Paper, Chip, Stack, Divider, LinearProgress, Tooltip, Grid, Avatar, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WindowIcon from '@mui/icons-material/Window';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchIcon from '@mui/icons-material/Search';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import UndoIcon from '@mui/icons-material/Undo';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { fetchUserStats } from "../http_requests/AuthenticationAPIs";
import Layout from "../components/Layout";

const PATTERNS = [
  { name: "Sliding Window", icon: <WindowIcon />, color: "#42a5f5", desc: "Efficiently solve problems involving subarrays or substrings by maintaining a window over data." },
  { name: "Two Pointers", icon: <CompareArrowsIcon />, color: "#7e57c2", desc: "Use two pointers to traverse data from different ends or at different speeds for optimal solutions." },
  { name: "Binary Search", icon: <SearchIcon />, color: "#ef5350", desc: "Quickly find elements or boundaries in sorted data by repeatedly dividing the search space." },
  { name: "Divide and Conquer", icon: <CallSplitIcon />, color: "#66bb6a", desc: "Break problems into smaller subproblems, solve them independently, and combine results." },
  { name: "Greedy Algorithm", icon: <AttachMoneyIcon />, color: "#ffa726", desc: "Make locally optimal choices at each step to find a global optimum for certain problems." },
  { name: "Backtracking", icon: <UndoIcon />, color: "#ab47bc", desc: "Explore all possible solutions by building candidates incrementally and abandoning invalid ones." },
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const TOTAL_PER_DIFFICULTY = 3;
const TOTAL_PROBLEMS = PATTERNS.length * DIFFICULTIES.length * TOTAL_PER_DIFFICULTY;

function getNextStep(userStats) {
  // Build a list of all pattern/difficulty pairs not yet mastered
  const candidates = [];
  PATTERNS.forEach(({ name }, patternIdx) => {
    DIFFICULTIES.forEach((diff, diffIdx) => {
      const solved = userStats?.solvedStats?.[name]?.[diff] || 0;
      if (solved < TOTAL_PER_DIFFICULTY) {
        candidates.push({
          pattern: name,
          difficulty: diff,
          solved,
          patternIdx,
          diffIdx
        });
      }
    });
  });
  // Sort: difficulty order (Easy < Medium < Hard), then most solved in that difficulty, then pattern order
  candidates.sort((a, b) => {
    if (a.diffIdx !== b.diffIdx) return a.diffIdx - b.diffIdx;
    if (b.solved !== a.solved) return b.solved - a.solved;
    return a.patternIdx - b.patternIdx;
  });
  if (candidates.length > 0) {
    return { pattern: candidates[0].pattern, difficulty: candidates[0].difficulty };
  }
  // Fallback: all complete
  return null;
}

function getEncouragement(percentComplete, totalSolved) {
  if (totalSolved === 0) return "Welcome! Let's start your journey—click the first step below.";
  if (percentComplete < 25) return "Great start! Keep going and build your foundation.";
  if (percentComplete < 50) return "Awesome progress! You're getting the hang of it.";
  if (percentComplete < 75) return "You're over halfway there—keep up the momentum!";
  if (percentComplete < 100) return "Almost done! Just a few more steps to mastery.";
  return "Congratulations! You've completed the roadmap. Consider reviewing or helping others.";
}

export default function Roadmap() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
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

  if (loading) return <Box p={4}><Typography>Loading...</Typography></Box>;
  if (error) return <Box p={4}><Typography color="error">{error}</Typography></Box>;

  // Calculate overall stats
  let totalSolved = 0;
  PATTERNS.forEach(({ name }) => {
    DIFFICULTIES.forEach(diff => {
      totalSolved += userStats?.solvedStats?.[name]?.[diff] || 0;
    });
  });
  const percentComplete = Math.round((totalSolved / TOTAL_PROBLEMS) * 100);

  // Find the next recommended step
  const nextStep = getNextStep(userStats);
  const encouragement = getEncouragement(percentComplete, totalSolved);

  return (
    <Layout centeredContent={false} backgroundImage="/roadmap_bg.jpg">
      <Paper
        elevation={8}
        sx={{
          borderRadius: 6,
          background: 'linear-gradient(120deg, #f3e5f5 0%, #e3f2fd 100%)',
          boxShadow: 10,
          px: { xs: 1, sm: 4 },
          py: { xs: 2, sm: 6 },
          maxWidth: 1200,
          mx: 'auto',
          mt: 6,
          mb: 6,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Box width="100%">
          {/* Dynamic Greeting & Encouragement */}
          <Box mb={3} textAlign="center">
            <Typography variant="h3" fontWeight={900} color="primary.main" mb={0.5} letterSpacing={1}>
              {percentComplete === 100 ? "Roadmap Complete!" : percentComplete === 0 ? "Welcome to Your Roadmap!" : "Welcome Back!"}
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={1.5}>
              {encouragement}
            </Typography>
          </Box>

          {/* Summary Card (Your Progress) - now first */}
          <Paper elevation={6} sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: 8, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
            <Grid container alignItems="center" justifyContent="center" spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={0.5}>
                  <EmojiEventsIcon fontSize="large" sx={{ color: 'primary.main' }} />
                  <Typography variant="h5" fontWeight={800} letterSpacing={0.5} textAlign="center">
                    Your Progress
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="center" gap={4} mt={2}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary.main" fontWeight={700}>{totalSolved}</Typography>
                    <Typography variant="caption" color="text.secondary">Solved</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={700}>{userStats?.streakInfo?.currentStreak ?? 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Current Streak</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={700}>{userStats?.streakInfo?.highestStreak ?? 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Best Streak</Typography>
                  </Box>
                  <Box minWidth={180} textAlign="center">
                    <LinearProgress
                      variant="determinate"
                      value={percentComplete}
                      sx={{
                        height: 14,
                        borderRadius: 7,
                        mb: 0.5,
                        background: '#e0e0e0',
                        boxShadow: 2,
                        transition: 'all 0.7s cubic-bezier(.4,2,.3,1)' // animate
                      }}
                      color={percentComplete === 100 ? "success" : "primary"}
                    />
                    <Typography variant="caption" color="text.secondary">{percentComplete}% Complete</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Intro Section (Next Up) - now after progress */}
          <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 4, boxShadow: 6 }}>
            {nextStep && percentComplete < 100 && (
              <Box display="flex" alignItems="center" gap={1}>
                <ArrowForwardIcon color="primary" />
                <Typography variant="subtitle1" color="primary.main" fontWeight={700}>
                  Next Up: <b>{nextStep.pattern}</b> - <b>{nextStep.difficulty}</b>
                </Typography>
              </Box>
            )}
            {percentComplete === 100 && (
              <Box display="flex" alignItems="center" gap={1}>
                <CelebrationIcon color="success" />
                <Typography variant="subtitle1" color="success.main" fontWeight={700}>
                  You've mastered every pattern! 🎉
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Pattern Roadmap */}
          <Stack spacing={4}>
            {PATTERNS.map(({ name, icon, desc, color }) => {
              // Calculate pattern progress
              const solved = DIFFICULTIES.reduce((acc, diff) => acc + Math.min(userStats?.solvedStats?.[name]?.[diff] || 0, TOTAL_PER_DIFFICULTY), 0);
              const maxForPattern = DIFFICULTIES.length * TOTAL_PER_DIFFICULTY;
              const percent = Math.round((solved / maxForPattern) * 100);
              const isPatternComplete = percent === 100;
              return (
                <Paper
                  key={name}
                  elevation={5}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    boxShadow: 6,
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.02)',
                      boxShadow: 12,
                    },
                  }}
                >
                  {/* Accent Bar */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -8,
                      top: 24,
                      width: 8,
                      height: 60,
                      borderRadius: 4,
                      background: color,
                      boxShadow: 2,
                    }}
                  />
                  <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                    <Avatar sx={{ bgcolor: color, color: '#fff', width: 40, height: 40, boxShadow: 2 }}>
                      {icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} color={isPatternComplete ? 'success.main' : percent > 0 ? 'primary.main' : 'text.primary'}>
                      {name}
                    </Typography>
                    {isPatternComplete && (
                      <Tooltip title="Pattern Mastered!">
                        <CelebrationIcon color="success" sx={{ ml: 1 }} />
                      </Tooltip>
                    )}
                    <Box flex={1} />
                    <Box minWidth={120}>
                      <LinearProgress
                        variant="determinate"
                        value={percent}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          background: '#e0e0e0',
                          boxShadow: 1,
                          transition: 'all 0.7s cubic-bezier(.4,2,.3,1)'
                        }}
                        color={isPatternComplete ? "success" : percent > 0 ? "primary" : "inherit"}
                      />
                      <Typography variant="caption" color="text.secondary">{percent}%</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={1} ml={7}>{desc}</Typography>
                  <Stack direction="row" spacing={2} ml={6}>
                    {DIFFICULTIES.map((diff) => {
                      const solved = userStats?.solvedStats?.[name]?.[diff] || 0;
                      const isComplete = solved >= TOTAL_PER_DIFFICULTY;
                      const isNext = nextStep && nextStep.pattern === name && nextStep.difficulty === diff;
                      return (
                        <Tooltip key={diff} title={`${solved}/${TOTAL_PER_DIFFICULTY} ${diff} problems solved`}>
                          <Badge
                            color="primary"
                            badgeContent={isNext ? "Next Up" : null}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            sx={{ '& .MuiBadge-badge': { fontSize: 11, fontWeight: 700, px: 1, py: 0.5 } }}
                          >
                            <Chip
                              label={
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  {diff}
                                  <Typography variant="caption" color="text.secondary">{`(${solved}/${TOTAL_PER_DIFFICULTY})`}</Typography>
                                  {isComplete && <CheckCircleIcon fontSize="small" color="success" />}
                                </Box>
                              }
                              color={isComplete ? "success" : isNext ? "primary" : percent > 0 ? "info" : "default"}
                              variant={isComplete ? "filled" : "outlined"}
                              clickable
                              onClick={() => navigate('/problem', { state: { pattern: name, difficulty: diff } })}
                              sx={{
                                fontWeight: 600,
                                fontSize: 15,
                                px: 2,
                                py: 1,
                                minWidth: 90,
                                boxShadow: isNext ? 4 : 1,
                                background: isNext ? 'linear-gradient(90deg, #bbdefb 0%, #e1bee7 100%)' : undefined,
                                transition: 'all 0.3s',
                                '&:hover': {
                                  boxShadow: 6,
                                  background: isNext ? 'linear-gradient(90deg, #90caf9 0%, #ce93d8 100%)' : undefined,
                                },
                              }}
                            />
                          </Badge>
                        </Tooltip>
                      );
                    })}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
          <Divider sx={{ my: 4, borderColor: '#bdbdbd', borderWidth: 2, borderRadius: 2 }} />
          <Box mt={2} textAlign="center">
            <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
              Click the highlighted step to continue your journey. Master all patterns to complete your roadmap!
            </Typography>
          </Box>

          {/* Visual Weblike Map Section */}
          <Box mt={8} mb={2} position="relative" minHeight={340} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h5" fontWeight={700} color="primary.main" mb={2} textAlign="center">
              Your Algorithm Web Map
            </Typography>
            {/* Web SVG lines */}
            <Box position="relative" width="600px" height="340px" mx="auto" zIndex={1}>
              <svg width="600" height="340" style={{ position: 'absolute', left: 0, top: 0 }}>
                {/* Connect nodes in a web/hex pattern (6 nodes) */}
                {/* Node positions (centered hexagon):
                  0: top center
                  1: top right
                  2: bottom right
                  3: bottom center
                  4: bottom left
                  5: top left
                */}
                {(() => {
                  // Hexagon positions (relative to center)
                  const cx = 600/2, cy = 170;
                  const r = 120;
                  const angles = [270, 330, 30, 90, 150, 210];
                  const points = angles.map(a => [
                    cx + r * Math.cos((a * Math.PI) / 180),
                    cy + r * Math.sin((a * Math.PI) / 180)
                  ]);
                  // Draw lines between each node and its two neighbors (web)
                  let lines = [];
                  for (let i = 0; i < 6; i++) {
                    lines.push(<line key={`l${i}a`} x1={points[i][0]} y1={points[i][1]} x2={points[(i+1)%6][0]} y2={points[(i+1)%6][1]} stroke="#bdbdbd" strokeWidth={4} />);
                    lines.push(<line key={`l${i}b`} x1={points[i][0]} y1={points[i][1]} x2={points[(i+2)%6][0]} y2={points[(i+2)%6][1]} stroke="#e0e0e0" strokeWidth={2} />);
                  }
                  return lines;
                })()}
              </svg>
              {/* Pattern Nodes */}
              {PATTERNS.map(({ name, icon, color }, idx) => {
                // Hexagon node positions
                const cx = 600/2, cy = 170;
                const r = 120;
                const angles = [270, 330, 30, 90, 150, 210];
                const [x, y] = [
                  cx + r * Math.cos((angles[idx] * Math.PI) / 180),
                  cy + r * Math.sin((angles[idx] * Math.PI) / 180)
                ];
                // Progress for this pattern
                const solved = DIFFICULTIES.reduce((acc, diff) => acc + Math.min(userStats?.solvedStats?.[name]?.[diff] || 0, TOTAL_PER_DIFFICULTY), 0);
                const maxForPattern = DIFFICULTIES.length * TOTAL_PER_DIFFICULTY;
                const percent = Math.round((solved / maxForPattern) * 100);
                const isPatternComplete = percent === 100;
                const isNextPattern = nextStep && nextStep.pattern === name;
                // Find first unsolved difficulty for this pattern
                let firstUnsolved = DIFFICULTIES.find(diff => (userStats?.solvedStats?.[name]?.[diff] || 0) < TOTAL_PER_DIFFICULTY) || 'Easy';
                return (
                  <Box
                    key={name}
                    position="absolute"
                    left={`calc(${x}px - 35px)`}
                    top={`calc(${y}px - 35px)`}
                    width={70}
                    height={70}
                    zIndex={3}
                  >
                    <Tooltip title={name + (isPatternComplete ? ' (Mastered!)' : '')}>
                      <Box
                        onClick={() => navigate('/problem', { state: { pattern: name, difficulty: firstUnsolved } })}
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: '50%',
                          bgcolor: isPatternComplete ? 'success.light' : isNextPattern ? 'primary.light' : '#f5f5f5',
                          border: `4px solid ${isPatternComplete ? color : isNextPattern ? color : '#bdbdbd'}`,
                          boxShadow: isPatternComplete ? 6 : isNextPattern ? 4 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: 10,
                            bgcolor: isPatternComplete ? 'success.main' : isNextPattern ? 'primary.main' : '#e0e0e0',
                          },
                        }}
                      >
                        <Box fontSize={36} color={isPatternComplete ? 'success.contrastText' : isNextPattern ? 'primary.contrastText' : color}>
                          {icon}
                        </Box>
                        {isPatternComplete && (
                          <CheckCircleIcon color="success" sx={{ position: 'absolute', bottom: 2, right: 2, fontSize: 24, bgcolor: '#fff', borderRadius: '50%' }} />
                        )}
                        {isNextPattern && !isPatternComplete && (
                          <ArrowForwardIcon color="primary" sx={{ position: 'absolute', top: 2, right: 2, fontSize: 22, bgcolor: '#fff', borderRadius: '50%' }} />
                        )}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -22,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 60,
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="caption" fontWeight={700} color={isPatternComplete ? 'success.main' : isNextPattern ? 'primary.main' : 'text.secondary'}>
                            {percent}%
                          </Typography>
                        </Box>
                      </Box>
                    </Tooltip>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Layout>
  );
} 