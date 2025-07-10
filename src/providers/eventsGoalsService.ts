import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
  getDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { app, firestore as firebaseFirestore } from './firebaseConfig'; // Importa la configuración de Firestore
import { Goal, Event } from './EventsGoalsProvider';

const firestore = getFirestore(app); // Obtén la instancia de Firestore

// Eventos
export const fetchEventsFromFirestore = async (): Promise<Event[]> => {
  try {
    const eventsCollection = collection(firestore, 'events'); // Obtén la colección de eventos
    const querySnapshot = await getDocs(eventsCollection); // Obtener todos los documentos

    const eventsList: Event[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Asegúrate de que los valores de start y end sean de tipo Date
      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        start: data.start ? data.start.toDate() : new Date(), // Convierte a Date
        end: data.end ? data.end.toDate() : new Date(), // Convierte a Date
        color: data.color || '',
      };
    });

    return eventsList; // Devolver la lista de eventos
  } catch (error) {
    console.error('Error fetching events from Firestore:', error);
    return []; // En caso de error, devuelve un array vacío
  }
};

export const addEventToFirestore = async (event: {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
}) => {
  try {
    const eventsCollection = collection(firestore, 'events'); // Obtén la colección de eventos
    await addDoc(eventsCollection, event); // Añadir evento a Firestore
  } catch (error) {
    console.error('Error adding event to Firestore:', error);
  }
};

export const updateEventInFirestore = async (
  eventId: string,
  updatedEvent: { title: string; start: Date; end: Date; description: string; color: string },
) => {
  try {
    const eventDocRef = doc(firestore, 'events', eventId); // Referencia al documento del evento
    await updateDoc(eventDocRef, updatedEvent); // Actualizar evento en Firestore
  } catch (error) {
    console.error('Error updating event in Firestore:', error);
  }
};

export const removeEventFromFirestore = async (eventId: string) => {
  try {
    const eventDocRef = doc(firestore, 'events', eventId); // Referencia al documento del evento
    await deleteDoc(eventDocRef); // Eliminar evento de Firestore
  } catch (error) {
    console.error('Error removing event from Firestore:', error);
  }
};

// Objetivos

export const fetchGoalsFromFirestore = async (): Promise<Goal[]> => {
  try {
    const goalsCollection = collection(firestore, 'goals'); // Obtén la colección de objetivos
    const querySnapshot = await getDocs(goalsCollection); // Obtener todos los documentos

    const goalsList: Goal[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Asegúrate de que cada documento tenga los campos `title` y `description`
      return {
        id: doc.id, // El ID del documento
        title: data.title || '', // Usar un valor por defecto si no existe
        description: data.description || '', // Usar un valor por defecto si no existe
      };
    });

    return goalsList; // Devolver la lista de objetivos
  } catch (error) {
    console.error('Error fetching goals from Firestore:', error);
    return []; // En caso de error, devuelve un array vacío
  }
};

export const addGoalToFirestore = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
  const goalsCollection = collection(firestore, 'goals');
  const docRef = await addDoc(goalsCollection, goal);
  return { id: docRef.id, ...goal };
};

export const updateGoalInFirestore = async (
  goalId: string,
  updatedGoal: { title: string; description: string },
) => {
  try {
    const goalDocRef = doc(firestore, 'goals', goalId); // Referencia al documento del objetivo
    await updateDoc(goalDocRef, updatedGoal); // Actualizar objetivo en Firestore
  } catch (error) {
    console.error('Error updating goal in Firestore:', error);
  }
};

export const removeGoalFromFirestore = async (goalId: string) => {
  try {
    const goalDocRef = doc(firestore, 'goals', goalId); // Referencia al documento del objetivo
    await deleteDoc(goalDocRef); // Eliminar objetivo de Firestore
  } catch (error) {
    console.error('Error removing goal from Firestore:', error);
  }
};
