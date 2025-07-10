import * as functions from 'firebase-functions/v1';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(functions.config().resend.key);
// const publicDomain = functions.config().app.public_domain;

export const welcomeUserTrigger = functions
  .firestore
  .document('users/{uid}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before?.status === 'pending' && after?.status === 'accepted') {
      const userEmail = after.email;
      const fullName = after.fullName || 'Compañero';
      const firstName = fullName.split(' ')[0];
      const sector = after.sector || 'tu sector';

      try {
        // Leer y preparar plantilla HTML
        const templatePath = path.resolve(__dirname, './templates/welcome-email.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        // Reemplazar variables dinámicas
        html = html
          .replace(/{{name}}/g, fullName)
          .replace(/{{sector}}/g, sector)
          .replace(/{{loginUrl}}/g, 'src="https://maenstudiosx.space/email-assets/')
          .replace(/src="images\//g, 'src="https://maenstudiosx.space/email-assets/');

        // Crear versión texto plano
        const text = `Hola ${fullName}, bienvenido a Maen Studios.\nTu sector: ${sector}.\nAccede aquí: maenstudiosx.space/authentication/login`;

        // Enviar correo
        const { data, error } = await resend.emails.send({
          from: 'AgencyX App <notifications@maenstudiosx.space>',
          to: userEmail,
          subject: `🎉 ¡Bienvenido a Maen Studios, ${firstName}!`,
          html,
          text, // ✅ versión plain text
        });

        if (error) {
          console.error(`❌ Error al enviar correo a ${userEmail}:`, error);
        } else {
          console.log(`✅ Email de bienvenida enviado a ${userEmail}`, data);
        }

      } catch (err) {
        console.error(`❌ Error inesperado al enviar email a ${userEmail}:`, err);
      }
    }
  });
