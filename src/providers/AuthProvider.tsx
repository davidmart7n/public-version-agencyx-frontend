import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { app, auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { firestore } from './firebaseConfig';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: any; // Aquí podrías mejorar el tipo más tarde
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  updateRole: (newRole: string) => Promise<void>;
  sendRegistrationRequest: (
    email: string,
    password: string,
    fullname: string,
    sector: string,
  ) => Promise<void>;
  deleteUserAuth: (userId: string) => Promise<void>;
  authLoading: boolean; // 👈 Agregado
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { },
  logout: () => { },
  token: null,
  updateRole: async () => { },
  sendRegistrationRequest: async () => { },
  authLoading: true, // 👈 Agregado
  deleteUserAuth: async () => { }
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [FBToken, setFBToken] = useState<any>(null)
  const auth = getAuth();
  const [authLoading, setAuthLoading] = useState(true); // 👈 Agregado
  const firestore = getFirestore(app); // Esto es lo que necesitas para la consulta


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log('Auth state changed, current user:', fbUser);

      if (!fbUser) {
        setUser(null);
        setToken(null);
        setAuthLoading(false);
        return;
      }

      // 1) Guarda usuario y token de backend
      setUser(fbUser);
      const idToken = await fbUser.getIdToken();
      setFBToken(idToken);
      await fetchBackendToken(idToken);

      // 2) Referencia al doc de Firestore
      const userRef = doc(firestore, 'users', fbUser.uid);

      try {
        // 3) Lee el documento
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();

          // 4) Si el email en Firestore difiere, lo actualizamos
          if (data.email !== fbUser.email) {
            await updateDoc(userRef, { email: fbUser.email });
            console.log(`✨ Sincronizado Firestore ← Auth: ${fbUser.email}`);
          }

          // 5) Actualizamos el contexto con el resto de campos
          setUser((prev: any) => ({
            ...prev!,
            role:     data.role,
            fullName: data.fullName,
            sector:   data.sector,
            status:   data.status,
          }));
        }
      } catch (err) {
        console.error('❌ Error leyendo/sincronizando Firestore:', err);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función para obtener el token del backend
  const fetchBackendToken = async (firebaseToken: string) => {
    const url = `${import.meta.env.VITE_API_NODE_BASE_URL}/login`;
    console.log("FirebaseToken:", firebaseToken);
    console.log("Haciendo request a:", url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${firebaseToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        console.log("Token recibido:", data.token);
      } else {
        console.error('Error al obtener el token del backend:', data.error);
      }
    } catch (error) {
      console.error('Error en la autenticación con el backend:', error);
    }
  };



  // Función para eliminar el usuario desde el backend
  const deleteUserAuth = async (userId: string) => {
    if (!FBToken) {
      console.error('No se ha obtenido un token válido de Firebase.');
      return;
    }

    const url = `${import.meta.env.VITE_API_NODE_BASE_URL}/delete-user/${userId}`;
    console.log('FBToken:', FBToken);
    console.log("Haciendo request a:", url);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${FBToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario en Firebase Auth');
      }

      console.log(`Usuario ${userId} eliminado de Auth correctamente`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password); // Esto ya debería cambiar el `user` al estado autenticado.
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    await auth.signOut();
  };

  // Función para actualizar el rol de un usuario en Firestore
  const updateRole = async (newRole: string) => {
    if (user) {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, { role: newRole });
      setUser((prevUser: any) => ({ ...prevUser, role: newRole }));
    }
  };

  const sendRegistrationRequest = async (
    email: string,
    password: string,
    fullname: string,
    sector: string,
  ) => {
    try {
      const auth = getAuth();
      console.log('seguimos');

      // Crear usuario en Firebase Authentication
      const newUser = await createUserWithEmailAndPassword(auth, email, password);

      // Guardar información del usuario en Firestore
      const userRef = doc(firestore, 'users', newUser.user.uid);
      await setDoc(userRef, {
        id: newUser.user.uid,
        email,
        fullName: fullname,
        sector,
        status: 'pending',
        createdAt: new Date(),
        role: 'user',
      });

      console.log('Solicitud de registro enviada con éxito.');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error; // 🔥 Esta línea es clave para propagar el error
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        token,
        updateRole,
        sendRegistrationRequest,
        deleteUserAuth, // Agregado aquí para que pueda ser usado desde el frontend
        authLoading, // 👈 Lo pasamos como valor
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
