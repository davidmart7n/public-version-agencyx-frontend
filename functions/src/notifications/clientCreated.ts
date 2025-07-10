import { firestore } from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { saveNotification, sendNotificationToAll } from ".";

export const clientCreatedTrigger = firestore
  .document("clients/{clientId}")
  .onCreate(async (snap, context) => {
    const newData = snap.data();
    const clientName = newData?.name || "Nombre desconocido";
    const body = `¡Tenemos nuevo cliente! Welcome "${clientName}"`;

    try {
      const notifTokensRef = admin.firestore().collection("notifTokens");
      const snapshot = await notifTokensRef.get();
      const tokens: string[] = [];

      snapshot.forEach((doc) => {
        const tokenData = doc.data();
        if (tokenData?.token) tokens.push(tokenData.token);
      });

      if (tokens.length > 0) {
        const title = "¡Nuevo Cliente!";
        await saveNotification(title, body);
        await sendNotificationToAll(tokens, title, body);
        console.log("✅ Notificación enviada con éxito.");
      } else {
        console.log("⚠️ No se encontraron tokens en 'notifTokens'.");
      }
    } catch (error) {
      console.error("❌ Error al enviar notificación:", error);
    }
  });
