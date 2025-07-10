import { firestore } from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { saveNotification, sendNotificationToAll } from ".";

// Trigger Firestore: Detectar tarea completada
export const taskCompletedTrigger = firestore
  .document("tasks/{taskId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    console.log("📋 before:", beforeData);
    console.log("📋 after:", afterData);

    if (beforeData?.isDone === false && afterData?.isDone === true) {
      console.log("✅ La tarea fue marcada como completada.");

      const taskName = afterData?.name;
      const assignedUsers = Array.isArray(afterData?.assignedUsers) ? afterData.assignedUsers : [];

      const fullNames: string[] = assignedUsers
        .map((user) => user?.fullName)
        .filter((name) => typeof name === "string" && name.trim() !== "");

      let body = "";
      if (fullNames.length === 1) {
        body = `${fullNames[0]} ha completado la tarea "${taskName}"`;
      } else if (fullNames.length > 1) {
        body = `${fullNames.join(", ")} han completado la tarea "${taskName}"`;
      } else {
        body = `Se ha completado la tarea: ${taskName}`;
      }

      try {
        const notifTokensRef = admin.firestore().collection("notifTokens");
        const snapshot = await notifTokensRef.get();
        const tokens: string[] = [];

        snapshot.forEach((doc) => {
          const tokenData = doc.data();
          if (tokenData?.token) tokens.push(tokenData.token);
        });

        if (tokens.length > 0) {
          const title = "¡Tarea completada!";
          await saveNotification(title, body);
          await sendNotificationToAll(tokens, title, body);
          console.log("✅ Notificación enviada con éxito.");
        } else {
          console.log("⚠️ No se encontraron tokens.");
        }
      } catch (error) {
        console.error("❌ Error al enviar notificación:", error);
      }
    } else {
      console.log("⏸ La tarea aún no está marcada como completada.");
    }
  });
