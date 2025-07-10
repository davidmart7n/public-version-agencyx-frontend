import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {
  addEventToFirestore,
  updateEventInFirestore,
  removeEventFromFirestore,
  updateGoalInFirestore,
  removeGoalFromFirestore,
  fetchGoalsFromFirestore,
  fetchEventsFromFirestore,
  addGoalToFirestore,
} from './eventsGoalsService'; // Importar los servicios

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
}

interface EventsGoalsContextType {
  events: Event[];
  goals: Goal[];
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, updatedEvent: Event) => void;
  removeEvent: (eventId: string) => void;
  updateGoal: (goalId: string, updatedGoal: Goal) => void;
  removeGoal: (goalId: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
}
// Define el tipo para las props del provider, incluyendo `children`
interface EventsGoalsProviderProps {
  children: ReactNode;
}
const EventsGoalsContext = createContext<EventsGoalsContextType | undefined>(undefined);

export const EventsGoalsProvider: React.FC<EventsGoalsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  /* ************************************* */
  /* **********   EVENTS    ************** */
  /* *************************************** */

  const loadEvents = async () => {
    try {
      const fetchedEvents = await fetchEventsFromFirestore(); // Obtener eventos desde Firestore
      setEvents(fetchedEvents); // Actualizar el estado con los eventos obtenidos
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const addEvent = (event: Event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    addEventToFirestore(event); // Guardar en Firestore
  };

  const updateEvent = (eventId: string, updatedEvent: Event) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === eventId ? updatedEvent : event)),
    );
    updateEventInFirestore(eventId, updatedEvent); // Actualizar en Firestore
  };

  const removeEvent = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    removeEventFromFirestore(eventId); // Eliminar de Firestore
  };

  /* ************************************* */
  /* **********   GOALS    ************** */
  /* *************************************** */
  const addGoal = async (newGoal: Omit<Goal, 'id'>) => {
    if (goals.length >= 3) return; // 🔒 Límite de 3 goals
  
    try {
      const savedGoal = await addGoalToFirestore(newGoal);
      setGoals((prevGoals) => [...prevGoals, savedGoal]);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };
  
  
  const updateGoal = (goalId: string, updatedGoal: Goal) => {
    setGoals((prevGoals) => prevGoals.map((goal) => (goal.id === goalId ? updatedGoal : goal)));
    updateGoalInFirestore(goalId, updatedGoal); // Actualizar en Firestore
  };

  const removeGoal = (goalId: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
    removeGoalFromFirestore(goalId); // Eliminar de Firestore
  };
  const loadGoals = async () => {
    try {
      const fetchedGoals = await fetchGoalsFromFirestore(); // Obtén los objetivos desde Firestore
      setGoals(fetchedGoals); // Actualiza el estado con los objetivos obtenidos
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  // Llamamos a `loadGoals` cuando el componente se monta
  useEffect(() => {
    loadGoals();
    loadEvents();
  }, []);

  return (
    <EventsGoalsContext.Provider
      value={{
        events,
        goals,
        addEvent,
        updateEvent,
        removeEvent,
        addGoal,
        updateGoal,
        removeGoal,
      }}
    >
      {children}
    </EventsGoalsContext.Provider>
  );
};

export const useEventsGoals = () => {
  const context = useContext(EventsGoalsContext);
  if (!context) {
    throw new Error('useEventsGoals must be used within an EventsGoalsProvider');
  }
  return context;
};
