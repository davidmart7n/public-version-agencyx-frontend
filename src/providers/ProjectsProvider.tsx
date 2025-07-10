import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAllTasks,
  getProjects,
  getTasksForProject,
  addProjectToFirestore,
  deleteProjectFromFirestore,
  updateProjectInFirestore,
  addTaskToFirestore,
  updateTaskInFirestore,
  deleteTaskFromFirestore,
  addClientToFirestore, // ✅ Función para agregar cliente
  updateClientInFirestore,
  deleteClientFromFirestore,
  getClientsFromFirestore,
  fetchFirestoreProjectById,
} from './firestore';
import { User } from './UsersProvider';
import { useNavigate } from 'react-router-dom';

// Tipos de datos
export interface Task {
  id: string;
  name: string;
  description: string;
  projectId: string;
  dueDate: Date | null;
  assignedUsers: User[];
  isDone: boolean;
}

export interface Client {
  email: string;
  description: string;
  services: string;
  persons: string;
  photoUrl: string;
  banner: string;
  color: string;
  id: string;
  name: string;
  slogan: string;
  brandwords: string;
  fonts: string;
    // Nuevo campo para contactos
    contact: {
      type: "phone" | "email" | "instagram" | "website" | "whatsapp"; // Restringe los valores posibles
      value: string; // Información del contacto
      link?: string; // URL asociada (si aplica)
    }[];
  }


export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  tasks: Task[];
  progress: number;
  dueDate: Date | null;
  isArchived: boolean;
  assignedUsers?: string[]; // Asignar usuarios al proyecto
}

interface ProjectsContextType {
  projects: Project[];
  tasks: Task[];
  clients: Client[];
  fetchProjects: () => void;
  fetchProjectById: (
    projectId: string,
  ) => { id: string; name: string; clientId: string; tasks: Task[]; progress: number } | null;
  fetchAllTasks: () => Promise<void>;
  fetchTasksForProject: (projectId: string) => Promise<Task[]>;
  fetchClients: () => void;
  addProject: (newProject: { name: string; clientId: string }) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  updateProject: (
    projectId: string,
    updatedData: { name: string; clientId: string },
  ) => Promise<void>;
  addTask: (newTask: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addClient: (newClient: { name: string }) => Promise<void>; // ✅ Agregar cliente
  updateClient: (clientId: string, updatedData: { [key: string]: any }) => Promise<void>; // ✅ Actualizar cliente
  deleteClient: (clientId: string) => Promise<void>; // ✅ Eliminar cliente
  rgbToHex: (rgb: any) => string; // Añade rgbToHex aquí
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  /* ************************************* */
  /* **********   PROJECTS    ************** */
  /* *************************************** */
  // Obtener proyectos
  
  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getProjects(); // Obtener todos los proyectos

      // Mapeamos proyectos y calculamos el progreso basado en las tareas asociadas
      const updatedProjects = await Promise.all(
        fetchedProjects.map(async (project) => {
          const tasks = await getTasksForProject(project.id); // Obtener las tareas para este proyecto
          const progress = calculateProjectProgress(tasks); // Calcular el progreso basado en las tareas

          return {
            ...project,
            tasks, // Añadir las tareas asociadas al proyecto
            progress, // Establecer el progreso calculado
          };
        }),
      );

      setProjects(updatedProjects); // Guardar los proyectos con el progreso actualizado
    } catch (error) {
      console.error('Error obteniendo los proyectos:', error);
    }
  };

  const fetchProjectById = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId); // Busca en el estado

    if (!project) {
      console.warn(`Proyecto con ID ${projectId} no encontrado`);
      return null;
    }

    return {
      id: project.id,
      name: project.name,
      clientId: project.clientId,
      tasks: project.tasks || [], // Maneja posibles valores nulos
      progress: project.progress || 0,
    };
  };

  // Agregar nuevo proyecto
  const addProject = async (newProject: {
    name: string;
    clientId: string;
    description: string;
    dueDate: Date | null;
    assignedUsers: string[]; // ✅ lo añades aquí
  }) => {
    try {
      const docRef = await addProjectToFirestore(newProject);
      const projectWithId: Project = {
        id: docRef.id,
        name: newProject.name,
        clientId: newProject.clientId,
        tasks: [],
        progress: 0,
        description: newProject.description,
        dueDate: newProject.dueDate,
        isArchived: false,
        assignedUsers: newProject.assignedUsers, // Directly assign string[] as expected
      };
    } catch (error) {
      console.error('Error al agregar proyecto:', error);
    }
  };
  // Eliminar proyecto
  const deleteProject = async (projectId: string) => {
    try {
      await deleteProjectFromFirestore(projectId);
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
    }
  };

  // Actualizar proyecto
  const updateProject = async (
    projectId: string,
    updatedData: Partial<Project> // 🔹 Ahora acepta cualquier propiedad del proyecto
  ) => {
    try {
      await updateProjectInFirestore(projectId, updatedData);
  
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, ...updatedData } : project
        )
      );
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
    }
  };
  
  

  const calculateProjectProgress = (tasks: Task[]): number => {
    const completedTasks = tasks.filter((task) => task.isDone).length;
    // console.log(completedTasks)
    return tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;
  };

  /* *********************************** */
  /* **********   TASKS    ************** */
  /* *********************************** */

  const fetchAllTasks = async () => {
    const fetchedTasks = await getAllTasks();
    setTasks(fetchedTasks);
  };

  // Obtener tareas para un proyecto
  // Aquí aseguramos que se retorna Task[] o null
  // Asumiendo que `getTasksForProject` devuelve `Task[]` o `null` en caso de error
  const fetchTasksForProject = async (projectId: string): Promise<Task[]> => {
    try {
      const fetchedTasks = await getTasksForProject(projectId);
      return fetchedTasks || []; // Retorna un array vacío si no se obtienen tareas
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return []; // En caso de error, retornamos un array vacío
    }
  };

  // ✅ Nueva función para agregar una tarea
  const addTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      console.log('nivel 1');

      await addTaskToFirestore(newTask);
      setTasks((prevTasks) => [...prevTasks, { ...newTask, id: 'temp-id' }]);
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  };

  // Actualizar tarea
  const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      // Primero actualizar en Firestore
      await updateTaskInFirestore(taskId, updatedTask);
  
      // Luego actualizar en el contexto (estado local)
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      );
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };
  

  const deleteTask = async (taskId: string) => {
    await deleteTaskFromFirestore(taskId);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  /* *********************************** */
  /* **********   CLIENTS    ************** */
  /* *********************************** */

  // Obtener clientes
  const fetchClients = async () => {
    const fetchedClients = await getClientsFromFirestore();
    setClients(fetchedClients);
  };

  // ✅ Función para agregar cliente
  const addClient = async (newClient: {
    name: string;
    id: string;
    photoUrl: string;
    banner: string;
    description: string;
    services: string;
    persons: string;
    color: string;
    email: string;
    slogan: string;
    brandwords: string;
    fonts: string;
    contact:{ type: "phone" | "email" | "instagram" | "website" | "whatsapp"; value: string; link?: string }[];
  }) => {
    try {
      const docRef = await addClientToFirestore(newClient);
      const clientWithId: Client = {
        id: docRef.id,
        name: newClient.name,
        email: newClient.email,
        description: newClient.description,
        services: newClient.services,
        persons: newClient.persons,
        photoUrl: newClient.photoUrl,
        banner: newClient.banner,
        color: rgbToHex(newClient.color),
        slogan: newClient.slogan,
        brandwords: newClient.brandwords,
        fonts: newClient.fonts,
        contact: newClient.contact
      };
      setClients((prevClients) => [...prevClients, clientWithId]);
    } catch (error) {
      console.error('Error al agregar cliente!:', error);
    }
  };

  const updateClient = async (clientId: string, updatedData: { [key: string]: any }) => {
    // Se permite cualquier clave y valor
    try {
      await updateClientInFirestore(clientId, updatedData);
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId ? { ...client, ...updatedData } : client,
        ),
      );
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
    }
  };

  // ✅ Función para eliminar cliente
  const deleteClient = async (clientId: string) => {
    try {
      await deleteClientFromFirestore(clientId);
      setClients((prevClients) => prevClients.filter((client) => client.id !== clientId));
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  /* *********************************** */
  /* **********   OTROS    ************** */
  /* *********************************** */

  const rgbToHex = (rgb: any) => {
    if (typeof rgb === 'string' && rgb.startsWith('rgb')) {
      const result = rgb.match(/\d+/g);
      if (result && result.length === 3) {
        return `#${(
          (1 << 24) |
          (parseInt(result[0]) << 16) |
          (parseInt(result[1]) << 8) |
          parseInt(result[2])
        )
          .toString(16)
          .slice(1)
          .toUpperCase()}`;
      }
    }
    return rgb;
  };

  useEffect(() => {
    fetchAllTasks();
    fetchProjects();
    fetchClients();
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        tasks,
        clients,
        fetchProjects,
        fetchProjectById,
        fetchAllTasks,
        fetchTasksForProject,
        fetchClients,
        addProject,
        deleteProject,
        updateProject,
        addTask,
        updateTask,
        deleteTask,
        addClient, // ✅ Agregamos `addClient` al contexto
        updateClient,
        deleteClient,
        rgbToHex,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
