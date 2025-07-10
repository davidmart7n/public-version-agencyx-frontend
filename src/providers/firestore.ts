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
  DocumentReference,
  deleteDoc,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { app, storage } from './firebaseConfig'; // Importa la configuración de Firebase
import { Client, Project, Task } from './ProjectsProvider';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User } from './UsersProvider';

// Inicializar Firestore
export const firestore = getFirestore(app);

/* *********************************** */
/* **********   USERS    ************** */
/* *********************************** */
/**
 * Envía una solicitud de registro a Firestore con estado "pending".
 */
export const sendUserRequest = async (
  firstName: string,
  lastName: string,
  email: string,
  sector: string,
) => {
  try {
    await addDoc(collection(firestore, 'users'), {
      firstName,
      lastName,
      email,
      sector,
      status: 'pending',
      role: 'user', // Se asignará después por un admin
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error al enviar solicitud:', error);
    throw error;
  }
};

/**
 * Obtiene todas las solicitudes pendientes (solo para admins).
 */
export const getPendingRequests = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'users'));
    return querySnapshot.docs
      .map((doc) => {
        const data = doc.data(); // Obtener los datos del documento
        return { id: doc.id, ...data } as {
          id: string;
          email: string;
          status: string;
          role: string;
        };
      })
      .filter((user) => user.status === 'pending'); // Ahora "status" sí existe
  } catch (error) {
    console.error('Error al obtener solicitudes pendientes:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de una solicitud (aceptar/rechazar y asignar rol).
 */
export const updateUserStatus = async (
  userId: string,
  status: 'accepted' | 'rejected',
  role: 'admin' | 'user',
) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { status, role });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Modificado para aceptar `deleteUser` como parámetro
export const deleteUserFromFirestore = async (userId: string) => {
  try {
    // Eliminar de Firestore
    const userRef = doc(firestore, 'users', userId); // Referencia al documento del usuario
    await deleteDoc(userRef); // Elimina el documento de Firestore
    console.log(`Usuario ${userId} eliminado de Firestore correctamente`);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error; // Si ocurre un error, lo lanzamos para manejarlo en el frontend
  }
};

export const updateUserInFirestore = async (
  userId: string,
  updatedData: { [key: string]: any }
) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, updatedData); // Actualizamos solo los campos necesarios
    console.log(`Usuario ${userId} actualizado en Firestore`);
  } catch (error) {
    console.error('Error al actualizar el usuario en Firestore:', error);
    throw error;
  }
};



/* *********************************** */
/* **********   PROJECTS    ************** */
/* *********************************** */

// Método para obtener los proyectos desde Firestore
export const getProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'projects'));
    const projects = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const projectData = doc.data();

        // Obtener las tareas directamente desde la subcolección "tasks" de este proyecto
        const tasksSnapshot = await getDocs(collection(firestore, `projects/${doc.id}/tasks`));
        const tasks: Task[] = tasksSnapshot.docs.map((taskDoc) => {
          const taskData = taskDoc.data();
          return {
            id: taskDoc.id,
            name: taskData.name,
            description: taskData.description,
            isDone: taskData.isDone,
            dueDate: taskData.dueDate instanceof Timestamp ? taskData.dueDate.toDate() : null, // Conversión segura
            projectId: taskData.projectId,
            assignedUsers: taskData.assignedUsers || [], // Asegura un array vacío si no existe
          };
        });

        return {
          id: doc.id,
          name: projectData.name,
          clientId: projectData.clientId,
          progress: projectData.progress || 0,
          tasks, // Usamos las tareas mapeadas
          createdAt: projectData.createdAt,
          description: projectData.description,
          dueDate: projectData.dueDate,
          isArchived: projectData.isArchived,
          assignedUsers: projectData.assignedUsers || [], // Asegura un array vacío si no existe

        };
      }),
    );

    return projects;
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    throw error;
  }
};

export const fetchFirestoreProjectById = async (projectId: any): Promise<Project | null> => {
  if (!projectId) return null;

  try {
    const projectRef = doc(firestore, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      const projectData = projectSnap.data() as Project;
      return { ...projectData, id: projectSnap.id }; // Retorna el objeto del proyecto
    } else {
      console.warn(`Proyecto con ID ${projectId} no encontrado.`);
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo el proyecto:', error);
    return null;
  }
};

// Método para obtener las tareas de un proyecto específico desde Firestore
export const getTasksForProject = async (projectId: string) => {
  try {
    const tasksQuery = query(collection(firestore, 'tasks'), where('projectId', '==', projectId));
    const querySnapshot = await getDocs(tasksQuery);
    const tasks = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        isDone: data.isDone,
        dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : null, // ✅ Conversión segura
        projectId: data.projectId,
        assignedUsers: data.assignedUsers || [], // ✅ Asegurar array vacío si no existe
      };
    });
    return tasks;
  } catch (error) {
    console.error('Error al obtener las tareas del proyecto:', error);
    throw error;
  }
};
export const addProjectToFirestore = async (project: {
  name: string;
  clientId: string;
  description: string;
  dueDate: Date | null;
  assignedUsers: string[];
}) => {
  try {
    const docRef = await addDoc(collection(firestore, 'projects'), project);
    console.log('Proyecto añadido:', project);
    return docRef;
  } catch (error) {
    console.error('Error al agregar el proyecto:', error);
    throw error;
  }
};


export const deleteProjectFromFirestore = async (projectId: string) => {
  try {
    // 1. Obtener todas las tareas asociadas al proyecto
    const tasksQuery = query(
      collection(firestore, 'tasks'),
      where('projectId', '==', projectId)
    );

    const tasksSnapshot = await getDocs(tasksQuery);
    const batch = writeBatch(firestore);

    tasksSnapshot.forEach((taskDoc) => {
      batch.delete(taskDoc.ref);
    });

    // 2. Eliminar el proyecto
    const projectRef = doc(firestore, 'projects', projectId);
    batch.delete(projectRef);

    // 3. Ejecutar el batch
    await batch.commit();

    console.log('Proyecto y tareas asociadas eliminados correctamente.');
  } catch (error) {
    console.error('Error al eliminar el proyecto y sus tareas:', error);
    throw error;
  }
};

export const updateProjectInFirestore = async (
  projectId: string,
  updatedData: Partial<Project>,
) => {
  try {
    const projectRef = doc(firestore, 'projects', projectId); // Referencia al documento del proyecto
    await updateDoc(projectRef, updatedData); // Actualizar los datos en Firestore
    console.log('Proyecto actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    throw error;
  }
};

/* *********************************** */
/* **********   TASKS    ************** */
/* *********************************** */

// Método para obtener todas las tareas y usuarios asignados
export const getAllTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'tasks'));
    const tasks = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

        // Convertir dueDate si es un Timestamp
        const dueDate = data.dueDate instanceof Timestamp ? data.dueDate.toDate() : null;

        // Manejar assignedUsers
        const assignedUsers = await Promise.all(
          (data.assignedUsers || []).map(async (user: any) => {
            if (user instanceof DocumentReference) {
              // Es una referencia, obtener el documento
              const userDoc = await getDoc(user);
              return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
            } else if (typeof user === 'object' && user !== null && user.id) {
              // Ya es un objeto de usuario con datos
              return user;
            } else {
              console.warn('assignedUsers contiene un objeto inválido:', user);
              return null; // O manejar de otra manera
            }
          }),
        );

        return {
          id: docSnapshot.id,
          name: data.name,
          description: data.description,
          isDone: data.isDone,
          dueDate,
          projectId: data.projectId,
          assignedUsers: assignedUsers.filter((user) => user !== null), // Filtra valores inválidos
        };
      }),
    );

    return tasks;
  } catch (error) {
    console.error('Error al obtener todas las tareas:', error);
    throw error;
  }
};

export const addTaskToFirestore = async (newTask: Omit<Task, 'id'>) => {
  try {
    if (!newTask.projectId) {
    }
    3;
    // Primero obtenemos el proyecto del `newTask.projectId` para añadir el objeto del proyecto
    const projectRef = doc(firestore, 'projects', newTask.projectId);

    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      throw new Error('El proyecto no existe');
    }
    // Agregar la tarea dentro de la colección global "tasks" y la subcolección "tasks" del proyecto
    const tasksCollection = collection(firestore, 'tasks');

    const docRef = await addDoc(tasksCollection, {
      ...newTask,
      project: projectDoc.data(), // Guardamos el objeto completo del proyecto
    });

    const projectTasksCollection = collection(firestore, 'projects', newTask.projectId, 'tasks');
    await setDoc(doc(projectTasksCollection, docRef.id), {
      ...newTask,
      project: projectDoc.data(), // Guardamos también el objeto del proyecto dentro de la subcolección
    });

    console.log('Tarea añadida con éxito');
    return docRef;
  } catch (error) {
    console.error('Error al agregar tarea en Firestore:', error);
    throw error;
  }
};

export const updateTaskInFirestore = async (taskId: string, updatedTask: Partial<Task>) => {
  try {
    const taskRef = doc(firestore, 'tasks', taskId); // Accedemos al documento de la tarea en Firestore
    await updateDoc(taskRef, updatedTask); // Actualizamos solo los campos proporcionados
    console.log('Tarea actualizada con éxito');
  } catch (error) {
    console.error('Error al actualizar tarea en Firestore:', error);
    throw error;
  }
};

export const deleteTaskFromFirestore = async (taskId: string) => {
  const taskRef = doc(firestore, 'tasks', taskId);
  await deleteDoc(taskRef);
};

/* *********************************** */
/* **********   CLIENTS    ************** */
/* *********************************** */

// Método para crear un cliente en Firestore
export const addClientToFirestore = async (client: Client) => {
  try {
    const docRef = await addDoc(collection(firestore, 'clients'), client);
    console.log('Cliente agregado con éxito:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error al agregar cliente:', error);
    throw error;
  }
};

// Método para obtener todos los clientes de Firestore
export const getClientsFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'clients'));
    const clients = querySnapshot.docs.map((doc) => ({
      id: doc.id, // ID del cliente
      name: doc.data().name,
      email: doc.data().email,
      description: doc.data().description,
      services: doc.data().services,
      persons: doc.data().persons,
      photoUrl: doc.data().photoUrl,
      banner: doc.data().banner,
      color: doc.data().color,
      slogan: doc.data().slogan,
      brandwords: doc.data().brandwords,
      fonts: doc.data().fonts,
      contact: doc.data().contact

      // Nombre del cliente
    }));
    return clients;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    throw error;
  }
};

// Método para actualizar un cliente en Firestore
export const updateClientInFirestore = async (
  clientId: string,
  updatedData: { [key: string]: any },
) => {
  // Se permite cualquier clave y valor
  try {
    const clientRef = doc(firestore, 'clients', clientId);
    await updateDoc(clientRef, updatedData);
    console.log('Cliente actualizado con éxito');
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    throw error;
  }
};

// Método para eliminar un cliente de Firestore
export const deleteClientFromFirestore = async (clientId: string) => {
  try {
    const clientRef = doc(firestore, 'clients', clientId);
    await deleteDoc(clientRef);
    console.log('Cliente eliminado con éxito');
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    throw error;
  }
};

/* *********************************** */
/* **********   OTHERS    ************** */
/* *********************************** */
export const uploadPhotoToStorage = async (file: File, folder: string) => {
  try {
    const storageRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(storageRef, file);
    const photoUrl = await getDownloadURL(storageRef);
    return photoUrl;
  } catch (error) {
    console.error('Error al subir la foto:', error);
    throw error;
  }
};
