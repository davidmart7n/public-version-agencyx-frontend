import * as admin from "firebase-admin";

import {clientCreatedTrigger} from "./notifications/clientCreated";
import {eventDayTrigger} from "./notifications/eventDay";
import { welcomeUserTrigger } from "./sendWelcomeEmail";
import { eventCreatedTrigger } from "./notifications/eventCreatedTrigger";
import { projectCompleted } from "./notifications/projectCompleted";
import { taskCompletedTrigger } from "./notifications/taskCompleted";
import { projectCreatedTrigger } from "./notifications/projectCreated";



admin.initializeApp();


// Exporta todas las funciones necesarias
export {projectCreatedTrigger, taskCompletedTrigger,
   projectCompleted, eventCreatedTrigger, clientCreatedTrigger,
  eventDayTrigger,welcomeUserTrigger};
