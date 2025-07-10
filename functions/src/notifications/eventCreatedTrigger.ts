import { firestore } from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { saveNotification, sendNotificationToAll } from ".";
import { format } from "date-fns";

export const eventCreatedTrigger = firestore
  .document("events/{eventId}")
  .onCreate(async (snap, context) => {
    const newData = snap.data();
    const eventName = newData?.title || "Evento desconocido";

    const startTimestamp = newData?.start?.toDate?.();
    const startDate = startTimestamp
      ? format(startTimestamp, "dd/MM/yyyy 'a las' HH:mm")
      : "Fecha desconocida";

    const body = `Se ha programado el evento "${eventName}" para el ${startDate}`;

    try {
      const notifTokensRef = admin.firestore().collection("notifTokens");
      const snapshot = await notifTokensRef.get();
      const tokens: string[] = [];

      snapshot.forEach((doc) => {
        const tokenData = doc.data();
        if (tokenData?.token) tokens.push(tokenData.token);
      });

      if (tokens.length > 0) {
        const title = "¡Evento confirmado!";
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
