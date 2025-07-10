import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HelpQuestions = () => {
    return (
        <Box sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Card sx={{ width: '100%', maxWidth: 1200, boxShadow: 3, borderRadius: 2, paddingTop: 1 }}>
                <CardContent>
                    <Grid container spacing={4}>
                        {/* Secciones Accordion */}
                        <Grid item xs={12}>
                            <Typography paddingLeft={2} paddingBottom={1} variant="h5" gutterBottom>📂 Secciones</Typography>

                            <Accordion sx={{ borderRadius: 2, boxShadow: 1, '&:not(:last-child)': { marginBottom: 1 } }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        '&:hover': { backgroundColor: 'primary.light' },
                                        borderRadius: 1,
                                        padding: '10px 20px',
                                    }}
                                >
                                    <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>Agency</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                    <Typography>
                                        Agency es el dashboard principal donde puedes ver un resumen de la actividad tanto tuya como de todo el equipo: proyectos, tareas, eventos, notificaciones, tu espacio personal y más. Toda la información relevante para tu trabajo con una visión 360° de la agencia centralizado en un solo lugar.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: 2, boxShadow: 1, '&:not(:last-child)': { marginBottom: 1 } }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        '&:hover': { backgroundColor: 'primary.light' },
                                        borderRadius: 1,
                                        padding: '10px 20px',
                                    }}
                                >
                                    <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>Proyectos y Clientes</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                    <Typography>
                                        Desde aquí podrás gestionar y seguir todos los proyectos y clientes de la agencia. Puedes visualizar, agregar o editar tanto los proyectos como las tareas que lo conforman y hacer un seguimiento de los avances de cada uno. Además, tendrás acceso a la creación, edición o lectura de información detallada de cada cliente de manera tan vistosa como profesional.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: 2, boxShadow: 1, '&:not(:last-child)': { marginBottom: 1 } }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    aria-controls="panel3a-content"
                                    id="panel3a-header"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        '&:hover': { backgroundColor: 'primary.light' },
                                        borderRadius: 1,
                                        padding: '10px 20px',
                                    }}
                                >
                                    <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>CalendaryX</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                    <Typography>
                                        CalendaryX es la herramienta de gestión de calendarios y eventos. Te permite organizar tus eventos, citas y reuniones del equipo de manera clara y eficiente.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: 2, boxShadow: 1, '&:not(:last-child)': { marginBottom: 1 } }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    aria-controls="panel4a-content"
                                    id="panel4a-header"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        '&:hover': { backgroundColor: 'primary.light' },
                                        borderRadius: 1,
                                        padding: '10px 20px',
                                    }}
                                >
                                    <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>PomodoroX</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                    <Typography>
                                        PomodoroX es una herramienta que te ayudará a mejorar tu productividad utilizando la técnica Pomodoro. Organiza tu tiempo en bloques de trabajo de 25, 50-80 minutos, seguidos de pequeños descansos, ayudándote a mantenerte enfocado y aumentar tu eficiencia.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: 2, boxShadow: 1, '&:not(:last-child)': { marginBottom: 1 } }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    aria-controls="panel4a-content"
                                    id="panel4a-header"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        '&:hover': { backgroundColor: 'primary.light' },
                                        borderRadius: 1,
                                        padding: '10px 20px',
                                    }}
                                >
                                    <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>Redes Sociales</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                    <Typography>
                                        Próximamente...
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: 2, boxShadow: 1, '&:not(:last-child)': { marginBottom: 1 } }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    aria-controls="panel4a-content"
                                    id="panel4a-header"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        '&:hover': { backgroundColor: 'primary.light' },
                                        borderRadius: 1,
                                        padding: '10px 20px',
                                    }}
                                >
                                    <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>CEOX</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                    <Typography>
                                        Próximamente...
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        {/* Preguntas Frecuentes Accordion */}
                        <Grid item xs={12}>
                            <Typography paddingBottom={1} paddingLeft={2} variant="h5" gutterBottom>💬 Preguntas Frecuentes</Typography>
                            <Accordion sx={{ borderRadius: 2, boxShadow: 1, '&:not(:last-child)': { marginBottom: 1 } }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    aria-controls="panel1b-content"
                                    id="panel1b-header"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        '&:hover': { backgroundColor: 'primary.light' },
                                        borderRadius: 1,
                                        padding: '10px 20px',
                                    }}
                                >
                                    <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>¿Cómo cambio mi email?</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                    <Typography>
                                        Para cambiar tu correo electrónico, ve a la sección de tu perfil y en el modal de edición ingresa tu nuevo correo y confirma el cambio aceptándolo en la bandeja de entrada del nuevo correo.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: 2, boxShadow: 1, '&:not(:last-child)': { marginBottom: 1 } }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    aria-controls="panel2b-content"
                                    id="panel2b-header"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        '&:hover': { backgroundColor: 'primary.light' },
                                        borderRadius: 1,
                                        padding: '10px 20px',
                                    }}
                                >
                                    <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>¿Cómo restablezco mi contraseña?</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                    <Typography>
                                        Para restablecer tu contraseña, ve a Configuración &gt; Cambiar de contraseña, ingresa tu contraseña actual y la nueva contraseña.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: 2, boxShadow: 1, '&:not(:last-child)': { marginBottom: 1 } }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    aria-controls="panel3b-content"
                                    id="panel3b-header"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        '&:hover': { backgroundColor: 'primary.light' },
                                        borderRadius: 1,
                                        padding: '10px 20px',
                                    }}
                                >
                                    <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>¿Cómo instalo las actualizaciones?</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                    <Typography>
                                        Simplemente, cuando llegue la notificación de actualización, haz clic en el botón de carga de la barra superior y la aplicación borrará los cachés anteriores y se reiniciará con la nueva versión.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: 2, boxShadow: 1, '&:not(:last-child)': { marginBottom: 1 } }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                    aria-controls="panel4b-content"
                                    id="panel4b-header"
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        '&:hover': { backgroundColor: 'primary.light' },
                                        borderRadius: 1,
                                        padding: '10px 20px',
                                    }}
                                >
                                    <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>¿Cómo activo/desactivo las notificaciones?</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                                    <Typography>
                                        - <strong>Desde ordenador</strong>: Dirígete a la web oficial de la app y haz clic en el icono de información y notificaciones.
                                        <br />
                                        - <strong>Desde móvil</strong>: Ve a Ajustes &gt; Apps &gt; Notificaciones y ajusta tus preferencias.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default HelpQuestions;
