import { Box, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { useUsers } from "providers/UsersProvider"; // ⬅️ Nuevo hook

// Emojis según el momento del día
const morningEmoji = "🌅";
const afternoonEmoji = "☀️";
const nightEmoji = "🌙";

// Frases motivadoras (igual que antes)
const morningQuotesEs = [
  "Hoy es una nueva oportunidad. ¡Aprovéchala!",
  "Empieza el día con energía y hazlo increíble.",
  "Cada mañana es una página en blanco. ¡Escríbela bien!",
  "Despierta con determinación, ve a la cama con satisfacción.",
  "El primer paso es el más importante. ¡Hazlo ahora!"
];

const afternoonQuotesEs = [
  "Sigue avanzando, ¡estás haciendo un gran trabajo!",
  "La mejor manera de predecir el futuro es crearlo.",
  "Aprovecha la tarde para acercarte a tus metas.",
  "El esfuerzo de hoy es el éxito de hoy y de mañana.",
  "Recuerda que cada esfuerzo cuenta, incluso los pequeños."
];

const nightQuotesEs = [
  "El futuro pertenece a aquellos que creen en su potencial.",
  "Celebra tus logros de hoy, por pequeños que sean.",
  "La constancia es la clave del éxito. ¡Sigue adelante!",
  "Lo que hagas ahora creará un mejor mañana.",
  "Tu esfuerzo de hoy es la base de tu éxito futuro."
];

const morningQuotesEn = [
  "Today is a new opportunity. Make the most of it!",
  "Start the day with energy and make it great.",
  "Every morning is a blank page. Write it well!",
  "Wake up with determination, go to bed with satisfaction.",
  "The first step is the most important one. Take it now!"
];

const afternoonQuotesEn = [
  "Keep moving forward, you're doing great!",
  "The best way to predict the future is to create it.",
  "Use the afternoon to get closer to your goals.",
  "What you do today can improve all your tomorrows.",
  "Remember, every effort counts, even the small ones."
];

const nightQuotesEn = [
  "The future belongs to those who believe in their potential.",
  "Celebrate today's achievements, no matter how small.",
  "Consistency is the key to success. Keep going!",
  "What you do now will create a better tomorrow.",
  "Your effort today is the foundation of your future success."
];

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const Greeting = () => {
  const intl = useIntl();
  const { currentUser, loadingCurrentUser } = useUsers(); // ⬅️ Usamos el nuevo provider

  const hour = new Date().getHours();
  const dayOfYear = getDayOfYear();
  const locale = intl.locale.startsWith("es") ? "es" : "en";

  let greetingKey = "greeting.night";
  let emoji = nightEmoji;
  let quotes = locale === "es" ? nightQuotesEs : nightQuotesEn;

  if (hour < 14) {
    greetingKey = "greeting.morning";
    emoji = morningEmoji;
    quotes = locale === "es" ? morningQuotesEs : morningQuotesEn;
  } else if (hour < 19) {
    greetingKey = "greeting.afternoon";
    emoji = afternoonEmoji;
    quotes = locale === "es" ? afternoonQuotesEs : afternoonQuotesEn;
  }

  if (loadingCurrentUser) return null; // ⬅️ Evita parpadeos si aún no cargó

  const userName = currentUser?.fullName?.split(" ")[0] || "Usuario";
  const motivationalQuote = quotes[dayOfYear % quotes.length];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", pl: 2, pb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h4">
        {intl.formatMessage({ id: greetingKey })}, {userName}!{emoji}
        </Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ pl: 0, color: "text.secondary", mt: 1 }}>
        {motivationalQuote}
      </Typography>
    </Box>
  );
};

export default Greeting;