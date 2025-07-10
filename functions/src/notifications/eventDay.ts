import * as admin from "firebase-admin";
import {pubsub} from "firebase-functions/v1";
import {format} from "date-fns"; // Para formatear la fecha
import { saveNotification, sendNotificationToAll } from ".";

// Función para verificar si el evento es hoy
export const eventDayTrigger = pubsub.schedule("00 07 * * *")
  .timeZone("Europe/Madrid") // Zona horaria de España
  .onRun(async () => {
    console.log("🟢 Iniciando eventDayTrigger...");

    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(),
      now.getDate());
    console.log(`📅 Fecha actual: ${todayDate.toISOString()}`);

    try {
      // Consulta para obtener todos los eventos
      const eventsRef = admin.firestore().collection("events");
      const snapshot = await eventsRef.get();
      console.log(`🔍 Eventos encontrados: ${snapshot.size}`);

      snapshot.forEach(async (doc) => {
        const eventData = doc.data();

        // Acceder correctamente al campo `start` en lugar de `date`
        let eventDate: Date | null = null;

        if (eventData?.start && eventData.start.toDate) {
          eventDate = eventData.start.toDate();
        }

        console.log(`📌 Evento: ${doc.id}, Nombre: 
            ${eventData?.title || "Sin nombre"}, Fecha:
             ${eventDate ? eventDate.toISOString() : "Fecha inválida"}`);

        if (!eventDate) {
          console.warn(`⚠️ El evento "${eventData?.title}"
             no tiene una fecha válida.`);
          return;
        }

        // Compara si el evento es hoy
        if (
          eventDate.getFullYear() === todayDate.getFullYear() &&
          eventDate.getMonth() === todayDate.getMonth() &&
          eventDate.getDate() === todayDate.getDate()
        ) {
          console.log(`✅ El evento "${eventData?.title}" es hoy.
             Preparando notificación...`);
          const eventName = eventData?.title || "Evento sin nombre";

          // Formatear la fecha y hora del evento
          const formattedTime = format(eventDate, "HH:mm");
          const body = `Hoy a las ${formattedTime} es el evento
           "${eventName}".`;

          // Obtener los tokens de la colección "notifTokens"
          const notifTokensRef = admin.firestore().collection("notifTokens");
          const snapshotTokens = await notifTokensRef.get();
          const tokens: string[] = [];

          console.log(`🔎 Tokens encontrados: ${snapshotTokens.size}`);
          snapshotTokens.forEach((doc) => {
            const tokenData = doc.data();
            if (tokenData?.token) {
              tokens.push(tokenData.token);
            }
          });

          console.log(`📲 Tokens obtenidos: ${tokens.length}`);

          if (tokens.length > 0) {
            const title = "¡Es hoy!";
            await saveNotification(title, body);
            console.log("💾 Notificación guardada en la base de datos");

            // Enviar la notificación a todos los tokens encontrados
            await sendNotificationToAll(tokens, title, body);
            console.log(`🚀 Notificación enviada para el evento:
                 ${eventName}`);
          } else {
            console.
              warn("⚠️ No se encontraron tokens de FCM en 'notifTokens'.");
          }
        } else {
          console.log(`❌ El evento "${eventData?.title}" NO es hoy.`);
        }
      });

      console.log("✅ Finalizando eventDayTrigger.");
    } catch (error) {
      console.error("❌ Error al verificar los eventos:", error);
    }
  });
