import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Collapse,
} from '@mui/material';
import { ExpandMore, ExpandLess, Edit } from '@mui/icons-material';
import { useEventsGoals } from 'providers/EventsGoalsProvider';
import { useUsers } from 'providers/UsersProvider';
import { FormattedMessage, useIntl } from 'react-intl';
import { useGridApiInitialization } from '@mui/x-data-grid/hooks/core/useGridApiInitialization';
import { useIntlContext } from 'providers/IntlProvider';


const MonthlyGoals = () => {
  const { isAdmin } = useUsers();
  const { goals, updateGoal, addGoal} = useEventsGoals();
  const currentMonth = new Date().getMonth(); // Número del mes (0 = Enero, 1 = Febrero, etc.)
  const [expandedGoal, setExpandedGoal] = useState<Record<string, boolean>>({});
  const [editedGoal, setEditedGoal] = useState<
    Record<string, { title: string; description: string }>
  >({});
  const [isEditing, setIsEditing] = useState<boolean>(false); // Solo un estado de edición global

  const goalColors = ['green', '#f5d354', 'red']; // Definir los colores para los números
  const { currentLanguage } = useIntlContext(); // Obtener el idioma actual del contexto
  // Función para obtener el nombre del mes actual
  const monthName = new Intl.DateTimeFormat(currentLanguage, { month: "long" }).format(new Date());

  useEffect(() => {
    const initialEditedGoal: Record<string, { title: string; description: string }> = {};
    goals.forEach((goal) => {
      initialEditedGoal[goal.id] = {
        title: goal.title,
        description: goal.description,
      };
    });

    // Asegúrate de añadir también los placeholders vacíos
    for (let i = goals.length; i < 3; i++) {
      const tempId = `new-${i}`;
      initialEditedGoal[tempId] = { title: '', description: '' };
    }

    
    setEditedGoal(initialEditedGoal);
  }, [goals]);


  const handleToggleGoal = (goalId: string) => {
    setExpandedGoal((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
  };

  const handleGoalChange = (goalId: string, newText: string, type: 'title' | 'description') => {
    setEditedGoal((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        [type]: newText, // Actualiza con una cadena vacía si newText está vacío
      },
    }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => {
      const next = !prev;
  
      if (prev) {
        Object.keys(editedGoal).forEach((goalId) => {
          const { title, description } = editedGoal[goalId];
  
          // Permitir campos vacíos
          const isNew = goalId.startsWith('new-');
  
          if (isNew) {
            // Permitir metas nuevas incluso si ambos campos están vacíos
            addGoal({ title, description });
          } else {
            // Actualizar meta existente
            const goalToUpdate = goals.find((goal) => goal.id === goalId);
            if (goalToUpdate) {
              updateGoal(goalId, { ...goalToUpdate, title, description });
            }
          }
        });
      }
  
      return next;
    });
  };
  
  

  const filledGoals = [...goals];
  const placeholdersCount = 3 - goals.length;

  for (let i = 0; i < placeholdersCount; i++) {
    const tempId = `new-${i}`;
    filledGoals.push({
      id: tempId,
      title: editedGoal[tempId]?.title || '',
      description: editedGoal[tempId]?.description || '',
    });
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          zIndex: 10,
          background: 'linear-gradient(135deg, #0072ff, #00c6ff)',
          borderRadius: '15px',
          padding: '16px 32px',
          textAlign: 'center',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          width: '100%',
          marginBottom: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Rubik',
            textShadow: '0px 0px 8px rgba(0, 0, 0, 0.7)',
            textAlign: 'center',
            fontWeight: 700,
            color: 'white',
            mb: 0,
            textTransform: 'uppercase',
            borderRadius: 1,
            padding: '5px 15px',
            display: 'inline-block',
          }}
        >
          <FormattedMessage id="goalsFor" />
          {monthName}🚀
        </Typography>
      </Box>
  
      <Grid container spacing={3} mb={0} sx={{ zIndex: 1 }}>
        {filledGoals.map((goal, index) => (
          <Grid item xs={12} sm={4} key={goal.id}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
                position: 'relative',
              }}
            >
              {isAdmin && index === 2 && (
                <IconButton
                  onClick={handleEditToggle}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontSize: '1.2rem',
                    color: 'rgba(0, 0, 0, 0.54)',
                    '&:hover': {
                      color: '#0072ff',
                    },
                  }}
                >
                  <Edit />
                </IconButton>
              )}
              <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  <span style={{ color: goalColors[index % goalColors.length] }}>{index + 1}</span>
                </Typography>
                {isAdmin ? (
                  isEditing ? (
                    <TextField
                      fullWidth
                      value={editedGoal[goal.id]?.title ?? ''}
                      onChange={(e) => handleGoalChange(goal.id, e.target.value, 'title')}
                      variant="outlined"
                      sx={{ mb: 1, '& .MuiInputBase-root': { fontWeight: 'bold' } }}
                    />
                  ) : (
                    <Typography variant="h6">{goal.title}</Typography>
                  )
                ) : (
                  <Typography variant="h6">{goal.title}</Typography>
                )}
  
                <IconButton onClick={() => handleToggleGoal(goal.id)} sx={{ mt: 1 }}>
                  {expandedGoal[goal.id] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
  
                <Collapse in={expandedGoal[goal.id]}>
                  {isAdmin ? (
                    isEditing ? (
                      <TextField
                        fullWidth
                        multiline
                        value={editedGoal[goal.id]?.description ?? ''}
                        onChange={(e) => handleGoalChange(goal.id, e.target.value, 'description')}
                        variant="outlined"
                        rows={4}
                        InputProps={{
                          style: { resize: 'none', overflowY: 'hidden', lineHeight: '1.4' },
                        }}
                        sx={{
                          mt: 2,
                          '& .MuiInputBase-root': { paddingBottom: 0, paddingTop: 0 },
                          '& textarea': { maxHeight: '150px', height: 'auto' },
                        }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: '0.875rem', mt: 1 }}>
                        {goal.description}
                      </Typography>
                    )
                  ) : (
                    <Typography sx={{ fontSize: '0.875rem', mt: 1 }}>{goal.description}</Typography>
                  )}
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
export default MonthlyGoals;
