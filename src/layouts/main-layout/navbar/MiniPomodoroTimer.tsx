import { Box, Typography } from '@mui/material';
import { usePomodoro } from 'providers/PomodoroProvider';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MiniPomodoroTimer = () => {
  const { isRunning, timeLeft } = usePomodoro();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const shouldPulse = isRunning && timeLeft <= 10;

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return s <= 60 ? `${min}:${String(sec).padStart(2, '0')}` : `${min}`;
  };

  useEffect(() => {
    if (isRunning) {
      setIsExiting(false);
      setShow(true);
    } else {
      setIsExiting(true);
      setTimeout(() => setShow(false), 200);
    }
  }, [isRunning]);

  if (!show) return null;

  return (
    <Box
      onClick={() => navigate('/pomodoro')}
      sx={{
        cursor: 'pointer',
        width: 42,
        height: 42,
        borderRadius: '50%',
        backgroundColor: '#0b0e1c',
        border: '2.5px solid #1976ff',
        boxShadow: '0 0 6px #1976ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 1,
        animation: `${isExiting ? 'flupOut' : 'flupIn'} 200ms ease, ${
          shouldPulse ? 'pulse 1s infinite ease-in-out' : 'none'
        }`,
        transformOrigin: 'center',

        '@keyframes flupIn': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '80%': { transform: 'scale(1.05)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        '@keyframes flupOut': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0)', opacity: 0 },
        },
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.8rem',
          textShadow: '0 0 2px rgba(0,0,0,0.5)',
        }}
      >
        {formatTime(timeLeft)}
      </Typography>
    </Box>
  );
};

export default MiniPomodoroTimer;
