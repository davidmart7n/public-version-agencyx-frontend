import * as admin from "firebase-admin";
import { https } from "firebase-functions/v1";
import cors from "cors";
import { sendNotificationToAll, saveNotification } from "."; // ajusta si es necesario

const corsHandler = cors({ origin: true });

export const projectCompleted = https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
  
      if (req.method === "OPTIONS") {
        return res.status(204).send("");
      }
  
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
      }
  
      const { title, body } = req.body;
      if (!title || !body) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
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
          await sendNotificationToAll(tokens, title, body);
          await saveNotification(title, body);
          return res.status(200).json({ message: "Notificación enviada con éxito" });
        } else {
          return res.status(404).json({ error: "No se encontraron tokens" });
        }
      } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
      }
    });
  });
  
