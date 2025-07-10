
export const rootPaths = {
  root: '/',
  pagesRoot: '/',
  authRoot: '/authentication',
  errorRoot: '/error',
};

/**
 * Object containing various paths used in the application.
 */
const paths = {
  default: `${rootPaths.root}`,
  instagram: `${rootPaths.pagesRoot}instagram`,
  calendar: `${rootPaths.pagesRoot}calendar`,
  projects: `${rootPaths.pagesRoot}projects`,
    ceox: `${rootPaths.pagesRoot}ceox`, // <-- nueva ruta
  archivedProjects: `${rootPaths.pagesRoot}archived-projects`,
  projectDetails: `${rootPaths.pagesRoot}projects/:projectId`,
  clientDetails: `${rootPaths.pagesRoot}clients/:clientId`,
  ranking: `${rootPaths.pagesRoot}ranking`,
  pomodoro: `${rootPaths.pagesRoot}pomodoro`,
  websites: `${rootPaths.pagesRoot}websites`,
  tiktok: `${rootPaths.pagesRoot}tiktok`,
  reports: `${rootPaths.pagesRoot}reports`,
  inbox: `${rootPaths.pagesRoot}inbox`,
  personalSettings: `${rootPaths.pagesRoot}/user-settings/:userId`,
  globalSettings: `${rootPaths.pagesRoot}/global-settings`,
  help: `${rootPaths.pagesRoot}/help`,

  login: `${rootPaths.authRoot}/login`,
  signup: `${rootPaths.authRoot}/sign-up`,
  pendingApproval: `${rootPaths.authRoot}/pending-approval`,
  forgotPassword: `${rootPaths.authRoot}/forgot-password`,
  resetPassword: `${rootPaths.authRoot}/reset-password`,

  notFound: `${rootPaths.errorRoot}/404`,
};

export default paths;
