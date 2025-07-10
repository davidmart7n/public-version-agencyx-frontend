import { Box, Card, CircularProgress, Grid, Link, Modal, Stack, Typography } from '@mui/material';
import LoginForm from 'components/sections/authentication/LoginForm';
import { useState } from 'react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <Box mx="auto" sx={{ mx: 'auto', p: 4, width: 1, height: 1, mb: 0 }}>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={9} md={6} lg={5} xl={4}>
          <Card
            sx={{
              py: { xs: 3, sm: 6 },
              px: { xs: 5, sm: 7.5 },
              bgcolor: 'common.white',
              pt: 10
            }}
          >
            <Stack spacing={1} sx={{ mb: 1, textAlign: 'center' }}>
              <Typography variant="h1" sx={{ typography: { whiteSpace: 'nowrap' } }}>
                Inicia Sesión
              </Typography>

              <Typography variant="button" color="text.secondary">
                ¿Nuevo en el Equipo?
                <Typography
                  ml={1}
                  color="primary"
                  component={Link}
                  href="/authentication/sign-up"
                  variant="button"
                >
                  Crea una Cuenta
                </Typography>
              </Typography>
            </Stack>

            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <LoginForm />
            )}

            <Box textAlign="center" mt={2}>
              <Link
                component="button"
                variant="body2"
                onClick={() => setShowVideo(true)}
                sx={{
                  mt: 1.5,
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: {
                    xs: '0.8rem',   // Para móviles
                    sm: '1rem',     // Tablets
                    md: '1.05rem',  // Escritorio
                  },
                  color: 'primary.main',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'secondary.main',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Quickstart Xperience
              </Link>
            </Box>





            {/* Logos inferiores */}
            <Box sx={{ textAlign: 'center', mb: 0, mt: 2 }}>
              <Box
                sx={{
                  mt: { xs: 0, sm: 2, md: 2 },
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 60,
                  mr: 2,
                }}
              >
                <Box sx={{ pr: 1.5, mt: 1.5, width: 100, display: 'flex', justifyContent: 'flex-end' }}>
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  >
                    <Box
                      component="img"
                      src="/AgencyX.png"
                      alt="AgencyX Logo"
                      sx={{
                        height: { xs: '120px', sm: '150px', md: '150px' },
                        width: 'auto',
                      }}
                    />
                  </motion.div>
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '27%',
                    transform: 'translate(-50%)',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 1 }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 'bold',
                        color: 'text.secondary',
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </Typography>
                  </motion.div>
                </Box>

                <Box
                  sx={{
                    mb: { xs: 0.40, sm: 0.75 },
                    pl: { xs: 3.15, sm: 3.5 },
                    width: 100,
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  >
                    <Box
                      component="img"
                      src="/45978c9a-71ea-4cfb-b4fa-ad43be89b1c9.png"
                      alt="Maen Studios Logo"
                      sx={{
                        height: { xs: '40px', sm: '50px', md: '50px' },
                        width: 'auto',
                      }}
                    />
                  </motion.div>
                </Box>
              </Box>
            </Box>

            {/* Modal de video */}
            <Modal
              open={showVideo}
              onClose={() => setShowVideo(false)}
              BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
            >
              <Box
                onClick={() => setShowVideo(false)} // Cierra al hacer click fuera
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  onClick={(e) => e.stopPropagation()} // Evita que el click dentro cierre el modal
                  sx={{
                    width: '90%',
                    maxWidth: 800,
                    boxShadow: 24,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '56.25%', // 16:9
                    }}
                  >
                    <Box
                      component="iframe"
                      src="https://www.youtube.com/embed/0BjowJ-NS74"
                      title="AgencyX QuickStart"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: 2,
                        border: 0,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Modal>

          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
