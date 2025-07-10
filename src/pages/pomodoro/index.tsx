import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  CircularProgress,
  CardContent,
} from '@mui/material';
import { Alarm } from '@mui/icons-material';
import { usePomodoro } from 'providers/PomodoroProvider';

const PomodoroPage = () => {
  const {
    timeLeft,
    isRunning,
    isWorkSession,
    workTime=25*60,
    breakTime,
    isAlarmActive,
    setIsRunning,
    setTimeLeft,
    setWorkTime,
    setBreakTime,
    setIsWorkSession,
    handleAlarmClick,
  } = usePomodoro();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleWorkTimeChange = (_: any, value: number) => {
    if (value) {
      setWorkTime(value * 60);
      setTimeLeft(value * 60);
      if (!isRunning) setIsWorkSession(true);
    }
  };

  const handleBreakTimeChange = (_: any, value: number) => {
    if (value) {
      setBreakTime(value * 60);
      if (!isRunning) {
        setTimeLeft(value * 60);
        setIsWorkSession(false);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "radial-gradient(circle at center, #001f3f, #000c1a)",
        borderRadius: 4,
        padding: 3,
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: { xs: 'auto', md: "85vh" },
        width: { xs: '90vw', md: "130vh" },
        margin: "auto",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 600,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          ⚡POMODOROX⚡
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="center" width="100%" position="relative">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={3}
            bgcolor="grey.900"
            color="white"
            borderRadius={3}
            boxShadow="0px 4px 15px rgba(255, 255, 255, 0.2)"
            width={320}
            my={3}
            border="1px solid rgba(255, 255, 255, 0.3)"
          >
            <Typography variant="h5" fontWeight="bold">
              {isWorkSession ? "Work Session" : "Break Time"}
            </Typography>
            <Box
              position="relative"
              width={128}
              height={128}
              my={3}
            >
              {/* ARO animado */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '4px solid',
                  borderColor: 'primary.main',
                  boxShadow: '0 0 12px rgba(0, 153, 255, 0.5)',
                  animation: isRunning ? 'pulseCombo 1.5s infinite ease-in-out' : 'none',
                  transformOrigin: 'center',
                  '@keyframes pulseCombo': {
                    '0%': {
                      boxShadow: '0 0 10px rgba(0,153,255,0.4)',
                      transform: 'scale(1)',
                    },
                    '50%': {
                      boxShadow: '0 0 20px rgba(0,153,255,0.9)',
                      transform: 'scale(1.05)',
                    },
                    '100%': {
                      boxShadow: '0 0 10px rgba(0,153,255,0.4)',
                      transform: 'scale(1)',
                    },
                  },
                }}
              />

              {/* NÚMERO estático */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" fontWeight="bold" color="white">
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={2} mt={2}>
              <Button variant="contained" color="success" onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button variant="contained" color="error" onClick={() => setTimeLeft(isWorkSession ? workTime : breakTime)}>
                Reset
              </Button>
            </Box>

            <Box display="flex" flexDirection="column" mt={3} gap={1} width="100%">
              <Typography variant="body1">Work Time (min)</Typography>
              <ToggleButtonGroup
                color="primary"
                exclusive
                value={workTime / 60}
                onChange={handleWorkTimeChange}
                fullWidth
              >
                <ToggleButton value={25}>25</ToggleButton>
                <ToggleButton value={50}>50</ToggleButton>
                <ToggleButton value={80}>80</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box display="flex" flexDirection="column" mt={2} gap={1} width="100%">
              <Typography variant="body1">Break Time (min)</Typography>
              <ToggleButtonGroup
                color="secondary"
                exclusive
                value={breakTime / 60}
                onChange={handleBreakTimeChange}
                fullWidth
              >
                <ToggleButton value={5}>5</ToggleButton>
                <ToggleButton value={10}>10</ToggleButton>
                <ToggleButton value={15}>15</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" mt={-1} mb={-4}>
          <IconButton
            onClick={handleAlarmClick}
            color={isAlarmActive ? "error" : "inherit"}
            sx={{
              color: isAlarmActive ? 'white' : 'grey.500',
              bgcolor: isAlarmActive ? 'success.main' : 'transparent',
              borderRadius: '50%',
              '&:hover': {
                bgcolor: isAlarmActive ? 'success.dark' : 'undefined',
              },
            }}
          >
            <Alarm fontSize="large" />
          </IconButton>
        </Box>
      </CardContent>
    </Box>
  );
};

export default PomodoroPage;
