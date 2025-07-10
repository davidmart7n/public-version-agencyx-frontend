import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getDoc, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { getMessaging, getToken, Messaging, onMessage } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import * as Sentry from '@sentry/react';

// Internal fallback values
let _app: ReturnType<typeof initializeApp> | null = null;
let _auth: Auth | null = null;
let _firestore: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _messaging: Messaging | null = null;

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  _app = initializeApp(firebaseConfig);
  _auth = getAuth(_app);
  _firestore = getFirestore(_app);
  _storage = getStorage(_app);
  _messaging = getMessaging(_app);

  onMessage(_messaging, (payload) => {
    console.log('Mensaje recibido en primer plano:', payload);
  });
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error);
  Sentry.captureException(error);
}

// ✅ Funciones getter seguras
export const app = _app!;
export const auth = _auth!;
export const firestore = _firestore!;
export const storage = _storage!;
export const messaging = _messaging!;

// 🔥 Solicita token de notificación y lo guarda
export const requestFirebaseToken = async () => {
  try {
    if (!_messaging) throw new Error('Firebase Messaging no está inicializado');
    if (!_auth) throw new Error('Firebase Auth no está inicializado');
    if (!_firestore) throw new Error('Firestore no está inicializado');

    const token = await getToken(_messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!token) {
      console.warn('⚠️ No se pudo obtener el token FCM');
      return null;
    }

    console.log('✅ Token FCM obtenido:', token);

    const user = _auth.currentUser;
    if (user) {
      // DEBUG: ver doc antes de merge
      const beforeSnap = await getDoc(doc(_firestore, 'users', user.uid));
      console.log('📄 Doc antes de merge:', beforeSnap.data());

      // DEBUG: log de la operación de guardado
      console.log('🔔 Guardando FCM token en Firestore:', {
        uid: user.uid,
        token,
        merge: true,
      });

      await setDoc(
        doc(_firestore, 'users', user.uid),
        { fcmToken: token },
        { merge: true }
      );

      await setDoc(
        doc(_firestore, 'notifTokens', token),
        {
          token,
          uid: user.uid,
          createdAt: new Date().toISOString(),
          device: navigator.userAgent,
        },
        { merge: true }
      );

      console.log('📝 Token guardado en Firestore para el usuario y colección global');
    } else {
      console.warn('⚠️ No hay usuario autenticado, no se pudo guardar el token');
    }

    return token;
  } catch (error) {
    console.error('❌ Error obteniendo o guardando el token:', error);
    Sentry.captureException(error);
    return null;
  }
};
