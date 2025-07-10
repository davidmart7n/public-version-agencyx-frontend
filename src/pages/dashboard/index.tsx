import { Box, CircularProgress, Divider, Grid, Paper, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import PageHeader from 'components/common/PageHeader';
import TeamMembers from 'components/sections/dashboard/members/TeamMembers';
import ProgressTracker from 'components/sections/dashboard/progressTracker/ProgressTracker';
import TodoList from 'components/sections/dashboard/todos/TodoList';
import TransactionTable from 'components/sections/dashboard/transactions/TransactionTable';
import MonthlyGoals from 'components/sections/dashboard/montlyGoals/MontlyGoals';
import AgendaSection from 'components/sections/dashboard/calendar/AgendaSection';
import PersonalTodoList from 'components/sections/dashboard/todos/PersonalTodoList';
import YourProgressTracker from 'components/sections/dashboard/progressTracker/YourProgressTracker';
import Greeting from 'components/sections/dashboard/greeting/Greeting';
import { requestFirebaseToken } from 'providers/firebaseConfig';
import { useUsers } from 'providers/UsersProvider';
import { FormattedMessage } from 'react-intl';
import { getAuth } from 'firebase/auth';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const location = useLocation();
  const transactionRef = useRef<HTMLDivElement>(null);
  const navbarHeight = 150;
  const { currentUser } = useUsers();

  const userName = currentUser?.fullName?.split(" ")[0] || "Usuario";
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);


  const isInStandaloneMode = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;

  // 🧠 Solicita el token FCM tras la primera interacción del usuario
  useEffect(() => {
    const handleFirstClick = async () => {
      const firebaseUser = getAuth().currentUser;
  
      if (
        !hasInteracted &&
        firebaseUser &&
        typeof window !== 'undefined' &&
        'Notification' in window &&
        (!isMobile || isInStandaloneMode())
      ) {
        setHasInteracted(true);
  
        
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await requestFirebaseToken(); // Ya no vuelve a pedir permiso dentro
            console.log('🔔 Token FCM solicitado y procesado correctamente');
          } else {
            console.log('🔕 Permiso de notificaciones denegado');
          }
        } catch (error) {
          console.error('❌ Error al solicitar notificaciones:', error);
        }
      } else {
        if (!firebaseUser) {
          console.log('⚠️ Usuario aún no autenticado. No se solicita token.');
        }
      }
    };
  
    document.addEventListener('click', handleFirstClick, { once: true });
    return () => document.removeEventListener('click', handleFirstClick);
  }, [hasInteracted, isMobile]);
  

  useEffect(() => {
    if (location.state?.fromNotifications) {
      setTimeout(() => {
        if (transactionRef.current) {
          const elementPosition = transactionRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - navbarHeight - 20,
            behavior: "smooth",
          });
        }
      }, 1000);
    }
  }, [location.key]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "white", p: 4, borderRadius: 2 }}>
      <Box sx={{ backgroundColor: "white", p: 4, pt: 2, pb: 3, borderRadius: 2 }}>
        <Greeting />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ padding: 3, pt: 1, background: 'rgb(236, 242, 255)', borderRadius: 2, boxShadow: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MonthlyGoals />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Divider sx={{ borderTop: 4, borderRadius: 1, borderTopColor: 'text.disabled', m: 1 }} />

      <Paper sx={{ mt: 3, backgroundColor: 'rgb(236, 242, 255)', padding: 3, borderRadius: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ borderRadius: 2, boxShadow: 3 }}>
              <TodoList />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ borderRadius: 2, boxShadow: 3 }}>
              <ProgressTracker />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ borderTop: 4, borderRadius: 1, borderTopColor: 'text.disabled', m: 1, mt: 3 }} />

      <Paper sx={{ mt: 3, backgroundColor: 'rgb(236, 242, 255)', padding: 2.5, borderRadius: 3 }}>
        <Grid container spacing={1} ref={transactionRef}>
          <TransactionTable />
        </Grid>
      </Paper>

      <Paper sx={{ mt: 3, backgroundColor: 'rgb(236, 242, 255)', p: 3, borderRadius: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <AgendaSection />
          </Grid>
          <Grid item xs={12} md={6}>
            <TeamMembers />
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ borderTop: 4, borderRadius: 1, borderTopColor: 'text.disabled', mx: 1, mt: 4.5 }} />

      <Typography
        variant="h3"
        fontWeight={700}
        textAlign="left"
        sx={{ mb: 1.5, ml: 4, mt: 5.5, display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.9)' }}
      >
        ✌️ <FormattedMessage id="personalSpace" />
      </Typography>

      <Typography variant="subtitle1" sx={{ ml: 5, color: "text.secondary", mt: 0 }}>
        <FormattedMessage id="personalSpaceMessage" /> ✅
      </Typography>

      <Paper
        sx={{
          mt: 3,
          backgroundColor: 'rgb(236, 242, 255)',
          padding: 3,
          borderRadius: 4,
          border: '4px solid  rgb(196, 212, 255)',
          boxShadow: 'none',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ borderRadius: 8, boxShadow: 3 }}>
              <PersonalTodoList />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ borderRadius: 8, boxShadow: 3 }}>
              <YourProgressTracker />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;

