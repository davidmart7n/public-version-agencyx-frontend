import { Box, Card, Grid, Link, Stack, Typography } from '@mui/material';
import RegisterForm from 'components/sections/authentication/RegisterForm';
import { motion } from 'framer-motion';

const SignUpPage = () => {
  return (
    <Box mx="auto" sx={{ mx: 'auto', p: 4, width: 1, height: 1 }}>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={9} md={6} lg={5} xl={4}>
          <Card
            sx={{
              py: { xs: 3, sm: 6 },
              px: { xs: 5, sm: 7.5 },
              bgcolor: 'common.white',
            }}
          >
            <Stack
              spacing={1}
              sx={{
                mb: 1,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  typography: {
                    whiteSpace: 'wrap',
                  },
                }}
              >
                Crear Nueva Cuenta
              </Typography>

              <Typography variant="button" color="text.secondary">
                ¿Ya tienes una cuenta?
                <Typography
                  ml={1}
                  color="primary"
                  component={Link}
                  href="/authentication/login"
                  variant="button"
                >
                  Inicia Sesión
                </Typography>
              </Typography>
            </Stack>
            <RegisterForm />
            <Box sx={{ textAlign: 'center', mb: 0, mt: 0 }}>
              <Box
                sx={{
                  mt: { xs: 2, sm: 3, md: 3 }, // ✅ Respetando tu margen responsive
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 60,
                  mr: 2,
                }}
              >
                {/* Logo izquierdo (AgencyX) animado */}
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

                {/* X centrada animada */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '27%', // ✅ Igual que lo hicimos en login para centrar mejor
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

                {/* Logo derecho (Maen Studios) animado */}
                <Box
                  sx={{
                    mb: { xs: 0.40, sm: 0.75 }, // 👈 Responsive: 0.65 en xs, 0.75 en sm y arriba
                    pl: { xs:3.15, sm: 3.5 },
                    width: 100,
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >   <motion.div
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUpPage;
