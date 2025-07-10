import React from 'react';
import { useParams } from 'react-router-dom';
import { Client, useProjects } from 'providers/ProjectsProvider';
import { Box, Typography, Card, CardContent, Stack, Divider, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUsers } from 'providers/UsersProvider';
import { FormattedMessage } from 'react-intl';
import { FaPhone, FaEnvelope, FaInstagram, FaGlobe, FaWhatsapp, FaQuestionCircle } from "react-icons/fa";


interface Props {
  client: Client;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
}

const contactIcons: Record<string, JSX.Element> = {
  phone: <FaPhone style={{ marginRight: "2px" }} />,
  email: <FaEnvelope style={{ marginRight: "2px" }} />,
  instagram: <FaInstagram style={{ marginRight: "2px" }} />,
  website: <FaGlobe style={{ marginRight: "2px" }} />,
  whatsapp: <FaWhatsapp style={{ marginRight: "2px" }} />,
};

const ClientDetails: React.FC<Props> = () => {
  const { clients } = useProjects();
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const client = clients.find((c) => c.id === clientId);

  const rgbToHex = (rgb: string) => {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return rgb;

    const [r, g, b] = match.slice(1).map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

  const cleanUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.origin + urlObj.pathname + urlObj.search + urlObj.hash;
    } catch (e) {
      return url; // Devuelve la URL original si no es válida
    }
  };

  if (!client) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <Typography variant="h5" color="textSecondary">
          Cliente no encontrado
        </Typography>
      </Box>
    );
  }

  const clientColorHex = rgbToHex(client.color);

  return (
    <Box>
      <Card sx={{ p: 5, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              fontSize: '2.5rem',
            }}
            variant="h1"
          >
            <Box
              sx={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                marginRight: '10px',
              }}
            />
            {client.name}
            <Box
              sx={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                marginLeft: '10px',
              }}
            />
          </Typography>

          {client.banner && (
            <Box sx={{ position: 'relative', width: '100%', height: 250, mt: 2 }}>
              <Box
                component="img"
                src={client.banner}
                alt="Banner"
                sx={{ width: '100%', height: '100%', borderRadius: 2, objectFit: 'cover' }}
              />
            </Box>
          )}

          <Typography
            sx={{ pt: 3, fontFamily: 'Yellowtail, sans-serif' }}
            fontWeight="lighter"
            variant="h4"
            textAlign="center"
          >
            {`"${client.slogan}"`}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Card sx={{ p: 3, backgroundColor: '#ebf7ff', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" fontFamily="Poppins, sans-serif">
                <FormattedMessage id="clientDescription" />
              </Typography>
              <Typography variant="body1" mt={2}>
                {client.description}
              </Typography>
            </CardContent>
          </Card>

          <Divider sx={{ my: 3 }} />

          <Card sx={{ p: 3, backgroundColor: '#ebf7ff', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" fontFamily="Poppins, sans-serif">
                <FormattedMessage id="ourServices" />
              </Typography>
              <Typography variant="body1" mt={2}>
                {client.services}
              </Typography>
            </CardContent>
          </Card>

          <Divider sx={{ my: 3 }} />

          <Card sx={{ p: 3, backgroundColor: '#ebf7ff', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" fontFamily="Poppins, sans-serif">
                Branding
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },  // Cambia a columna en pantallas pequeñas
                  justifyContent: 'space-between',
                  mt: 1,
                  gap: 2,  // Espacio entre los elementos
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography pb={2} variant="subtitle1" fontFamily="Poppins, sans-serif" fontWeight="bold">
                    Logo:
                  </Typography>
                  {client.photoUrl && (
                    <Box sx={{ position: 'relative', width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 } }}>
                      <Box
                        component="img"
                        src={client.photoUrl}
                        alt="Logo"
                        sx={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 2,
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontFamily="Poppins, sans-serif" fontWeight="bold">
                    Color:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2">{clientColorHex}</Typography>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: clientColorHex,
                        marginLeft: 2,
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontFamily="Poppins, sans-serif" fontWeight="bold">
                    <FormattedMessage id="fonts" />:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {client.fonts}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontFamily="Poppins, sans-serif" fontWeight="bold">
                    Brandwords:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {client.brandwords}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

          </Card>

          <Divider sx={{ my: 3 }} />
          <Card sx={{ p: 3, backgroundColor: "#ebf7ff", borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" fontFamily="Poppins, sans-serif">
                <FormattedMessage id="contact" />
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                {client.contact ? (
                  client.contact.map((contact) => {
                    const icon = contactIcons[contact.type];
                    const link = cleanUrl(contact.link || `#${contact.type}`);
                    console.log("Contact Link:", link); // Verifica el enlace final
                    return (
                      <Box key={contact.type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Typography variant="body2" ml={-0.25}>
                            {contact.value}
                          </Typography>
                        </a>

                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No hay información de contacto disponible.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientDetails;