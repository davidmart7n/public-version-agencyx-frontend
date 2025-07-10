import * as admin from "firebase-admin";
import {firestore} from "firebase-admin";

// Función para enviar notificación a múltiples dispositivos
export const sendNotificationToAll = async (
  tokens: string[],
  title: string,
  body: string
) => {
  const message = {
    notification: {
      title,
      body,
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Enviando notificación");
    let successCount = 0;
    let failureCount = 0;
    const failedTokens: string[] = [];

    response.responses.forEach((resp, idx) => {
      if (resp.success) {
        successCount++;
      } else {
        failureCount++;
        failedTokens.push(tokens[idx]);
      }
    });

    console.log(`${successCount} notificaciones enviadas con éxito`);
    if (failureCount > 0) {
      console.log("Tokens que fallaron:", failedTokens);
      await removeInvalidTokens(failedTokens);
    }
  } catch (error) {
    console.error("Error enviando las notificaciones:", error);
  }
};

// Función para eliminar tokens inválidos de Firestore
const removeInvalidTokens = async (tokens: string[]) => {
  try {
    const notifTokensRef = firestore().collection("notifTokens");
    const snapshot = await notifTokensRef.where("token", "in", tokens).get();

    const batch = firestore().batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`${tokens.length} tokens inválidos eliminados de Firestore`);
  } catch (error) {
    console.error("Error eliminando tokens inválidos:", error);
  }
};

// Guarda notificaciones en "notifications" de Firestore.
export const saveNotification = async (title: string, body: string) => {
  try {
    const notificationRef = firestore().collection("notifications").
      doc(); // Crea un nuevo documento
    const notification = {
      title,
      body,
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    await notificationRef.set(notification);
    // Guardamos la notificación en Firestore
    console.log("Notificación guardada en Firestore");
  } catch (error) {
    console.error("Error guardando la notificación:", error);
  }
};
