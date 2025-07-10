import { Box, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { DataGrid, GridApi, GridColDef, GridSlots, useGridApiRef } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { collection, getDocs, getFirestore, Timestamp } from 'firebase/firestore';
import { app } from 'providers/firebaseConfig'; // Asegúrate de importar tu configuración de Firebase

import CustomDataGridFooter from 'components/common/table/CustomDataGridFooter';
import CustomDataGridHeader from 'components/common/table/CustomDataGridHeader';
import CustomDataGridNoRows from 'components/common/table/CustomDataGridNoRows';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';



// Interfaz para las notificaciones
interface NotificationData {
  id: string;
  title: string;
  description: string;
  date: string;
  timestamp: number;
}

// Mapa de títulos a emojis
const titleToEmoji: { [key: string]: string } = {
  "¡Tarea completada!": "✅",
  "¡Proyecto Completado!": "🏆",
  "¡Nuevo Proyecto!": "🚀",
  "¡Nuevo Cliente!": "🤝",
  "¡Evento confirmado!": "📆",
  "¡Es hoy!": "🔥",
  "¡Nueva actualización!": "🔄"

};

// Columnas de la tabla
export const notificationColumns: GridColDef<NotificationData>[] = [
  {
    field: 'title',
    headerName: 'Name',
    width: 200,
    renderCell: (params) => {
      const title = String(params.value); // Asegurarse de que params.value sea un string
      const emoji = titleToEmoji[title] || ''; // Obtener el emoji correspondiente al título
      return (
        <Typography sx={{ fontWeight: 500 }}>
          {emoji} {title} {/* Mostrar el emoji antes del título */}
        </Typography>
      );
    },
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
  },
  {
    field: 'description',
    headerName: 'Description',
    minWidth: 300,
    flex: 1,
    renderCell: (params) => (
      <Typography
        sx={{
          fontSize: 13,
          whiteSpace: 'normal',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {params.value}
      </Typography>
    ),
  },
];



const TransactionTable = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [searchText, setSearchText] = useState('');
  const apiRef = useGridApiRef<GridApi>();
  const db = getFirestore();

  // Obtener datos de Firestore
  useEffect(() => {
    const fetchNotifications = async () => {
      const querySnapshot = await getDocs(collection(db, 'notifications'));
      const fetchedNotifications = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp instanceof Timestamp
            ? new Date(data.timestamp.seconds * 1000 + Math.floor(data.timestamp.nanoseconds / 1000000))
            : null;

          return {
            id: doc.id,
            title: data.title || 'Sin título',
            description: data.body || 'Sin descripción',
            date: timestamp
              ? `${timestamp.getDate().toString().padStart(2, '0')}/${(timestamp.getMonth() + 1).toString().padStart(2, '0')}/${timestamp.getFullYear()}`
              : 'Fecha no válida',
            timestamp: timestamp ? timestamp.getTime() : 0,
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp);

      setNotifications(fetchedNotifications);
    };
    fetchNotifications();
  }, []);

  // Cargar datos en la tabla
  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.setRows(notifications);
    }
  }, [notifications, apiRef]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.currentTarget.value);
  };

  return (
    <Stack sx={{ overflow: 'auto', position: 'relative', height: 'auto', width: '100%', mr: 2 }}>
      <SimpleBar style={{ maxHeight: '100%' }}>
        {/* Contenedor con scroll horizontal */}
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <DataGrid
            autoHeight={false}
            rowHeight={52}
            columns={notificationColumns}
            rows={notifications}
            loading={notifications.length === 0}
            apiRef={apiRef}
            hideFooterSelectedRowCount
            disableColumnResize
            disableColumnMenu
            disableColumnSelector
            disableRowSelectionOnClick
            rowSelection={false}
            slots={{
              loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
              pagination: CustomDataGridFooter,
              toolbar: CustomDataGridHeader,
              noResultsOverlay: CustomDataGridNoRows,
            }}
            slotProps={{
              toolbar: {
                title: (
                  <Box sx={{ display: 'flex', mr: 7, mb: -1, alignItems: 'center' }}>
                    <Typography variant="h4" textTransform="capitalize" fontWeight={700} sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.9)' }}>
                      📣
                    </Typography>
                    <Box sx={{ width: 6, height: 24, backgroundColor: 'rgba(175, 32, 242, 0.7)', borderRadius: 1, mr: 1.5 }} />
                    <Typography variant="h4" textTransform="capitalize" fontWeight={700} sx={{ color: 'rgba(0, 0, 0, 0.9)' }}>
                      <FormattedMessage id="notifications" />
                    </Typography>
                  </Box>
                ) as any,  // Especificamos que `title` es un ReactNode
                onChange: handleChange,
              },
            }}

            initialState={{ pagination: { paginationModel: { page: 1, pageSize: 5 } } }}
            pageSizeOptions={[5, 10, 25]}
            sx={{
              boxShadow: 1,
              px: 3,
              borderColor: 'active.selected',
              height: 'auto',
              width: '100%',
              tableLayout: 'auto',
            }}
          />
        </Box>
      </SimpleBar>
    </Stack>
  );
};

export default TransactionTable; 