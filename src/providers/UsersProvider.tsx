import React, {
  createContext,
  useContext,
  ReactNode,
  FC,
  useState,
  useEffect,
} from 'react';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import { deleteUserFromFirestore, updateUserInFirestore } from './firestore';
import { useAuth } from './AuthProvider';

export interface User {
  id: string;
  photoUrl: string;
  fullName: string;
  sector: string;
  role: 'admin' | 'user';
  email: string;
  status: string;
  createdAt: Date;
}

interface UsersContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isAdmin: boolean;
  currentUser: User | null;
  loadingCurrentUser: boolean;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, updatedData: { [key: string]: any }) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider: FC<UsersProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { user: authUser, deleteUserAuth } = useAuth();

  useEffect(() => {
    if (!authUser?.uid) {
      setCurrentUser(null);
      setLoadingCurrentUser(false);
      return;
    }

    const userRef = doc(firestore, 'users', authUser.uid);

    // 1) Fetch inicial
    getDoc(userRef)
      .then((snap) => {
        if (snap.exists()) {
          console.log('Snapshot exists?', snap.exists(), 'data:', snap.data());
          const data = snap.data();
          setCurrentUser({
            id: snap.id,
            photoUrl: data.photoUrl || '',
            fullName: data.fullName || '',
            role: data.role || 'user',
            sector: data.sector || 'employee',
            email: data.email || '',
            status: data.status || '',
            // ← fallback original de fechas
            createdAt: (data.createdAt as Date) || new Date(),
          });
        } else {
          setCurrentUser(null);
        }
        setLoadingCurrentUser(false);
      })
      .catch((err) => {
        console.error('Error fetching user document:', err);
        setLoadingCurrentUser(false);
      });

    // 2) Suscripción real-time sin snapshots de caché
    const unsubscribe = onSnapshot(
      userRef,
      { includeMetadataChanges: true },
      (snap) => {
        if (snap.metadata.fromCache) return;

        if (snap.exists()) {
          const data = snap.data();
          setCurrentUser({
            id: snap.id,
            photoUrl: data.photoUrl || '',
            fullName: data.fullName || '',
            role: data.role || 'user',
            sector: data.sector || 'employee',
            email: data.email || '',
            status: data.status || '',
            // ← idem aquí
            createdAt: (data.createdAt as Date) || new Date(),
          });
        } else {
          setCurrentUser(null);
        }
        setLoadingCurrentUser(false);
      }
    );

    return () => unsubscribe();
  }, [authUser?.uid]);

  useEffect(() => {
    setIsAdmin(currentUser?.role === 'admin');
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            photoUrl: data.photoUrl || '',
            fullName: data.fullName || '',
            role: data.role || 'user',
            sector: data.sector || 'employee',
            email: data.email || '',
            status: data.status || '',
            // ← y aquí también el fallback clásico
            createdAt: (data.createdAt as Date) || new Date(),
          } as User;
        });
        setUsers(usersList);
      } catch (err) {
        console.error('Error fetching users list:', err);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId: string) => {
    try {
      await deleteUserAuth(userId);
      await deleteUserFromFirestore(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const updateUser = async (
    userId: string,
    updatedData: { [key: string]: any }
  ) => {
    try {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updatedData } : u))
      );
      await updateUserInFirestore(userId, updatedData);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
        isAdmin,
        currentUser,
        loadingCurrentUser,
        deleteUser,
        updateUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
