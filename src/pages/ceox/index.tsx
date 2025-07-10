import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useAuth } from 'providers/AuthProvider';
import { useReportData, Node } from 'components/sections/dashboard/ceox/useReportData';

export default function CeoxPage() {
  const { user, authLoading } = useAuth();
  const { tree, loading, error } = useReportData();
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  if (authLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <div>Por favor, inicia sesión para ver los reportes.</div>;

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!tree.length) return <div>No se encontraron reportes.</div>;

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  return (
    <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
      {/* Título principal */}
      <Box
        sx={{
          background: 'linear-gradient(135deg,rgb(0, 4, 255),rgb(247, 153, 255))',
          borderRadius: '15px',
          padding: '16px 32px',
          textAlign: 'center',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Rubik', sans-serif",
            fontWeight: 600,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          CEOX AI AGENT 🤖
        </Typography>
      </Box>

      <Typography
        variant="h6"
        sx={{
          mb: 2,
          ml:2,
          fontWeight: 'semibold',
        }}
      >
       CEOX - Reportes Semanales Inteligentes
      </Typography>


      {/* Lista de carpetas */}
      <Box>
        {tree
          .slice() // para no mutar el original
          .sort((a, b) => (a.name < b.name ? 1 : -1)) // orden inverso por nombre (fecha)
          .map((folder: Node) => (
            <Box
              key={folder.name}
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
                cursor: 'pointer',
                '&:hover': { boxShadow: 4 },
                width: '100%',
              }}
              onClick={() => toggleFolder(folder.name)}
            >

              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                📁 {folder.name}
              </Typography>

              <Collapse in={openFolders[folder.name]} timeout="auto" unmountOnExit>
                <List sx={{ mt: 2 }}>
                  {folder.children?.map((doc: Node) => (
                    <React.Fragment key={doc.name}>
                      <ListItem
                        component="a"
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ pl: 4 }}
                      >
                        <ListItemText primary={`📄 ${doc.name}`} />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
      </Box>
    </Card>
  );
}
