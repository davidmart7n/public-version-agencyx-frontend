import { firestore } from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { saveNotification, sendNotificationToAll } from ".";

// Trigger Firestore: Detecta Creación de Proyecto
export const projectCreatedTrigger = firestore
  .document("projects/{projectId}")
  .onCreate(async (snap, context) => {
    const newData = snap.data();
    const projectName = newData?.name;
    const clientId = newData?.clientId;

    console.log("Nuevo Proyecto Creado:", newData);
;

    let clientName = "Cliente desconocido";
    if (clientId) {
      try {
        const clientRef = admin.firestore().collection("clients").doc(clientId);
        const clientDoc = await clientRef.get();
        if (clientDoc.exists) {
          clientName = clientDoc.data()?.name || clientName;
        }
      } catch (error) {
        console.error("❌ Error al obtener el nombre del cliente:", error);
      }
    }

    const body = `Se ha creado el nuevo proyecto "${projectName}" para ${clientName}`;

    try {
      const notifTokensRef = admin.firestore().collection("notifTokens");
      const snapshot = await notifTokensRef.get();
      const tokens: string[] = [];

      snapshot.forEach((doc) => {
        const tokenData = doc.data();
        if (tokenData?.token) tokens.push(tokenData.token);
      });

      if (tokens.length > 0) {
        const title = "¡Nuevo Proyecto!";
        await saveNotification(title, body);
        await sendNotificationToAll(tokens, title, body);
        console.log("✅ Notificación enviada con éxito.");
      } else {
        console.log("⚠️ No se encontraron tokens de FCM.");
      }
    } catch (error) {
      console.error("❌ Error al enviar la notificación:", error);
    }
  });
