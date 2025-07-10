import PageLoader from 'components/loading/PageLoader';
import Splash from 'components/loading/Splash';
import AuthLayout from 'layouts/auth-layout';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import paths, { rootPaths } from './path';
import PrivateRoute from './PrivateRoute';
import ProjectDetailsPage from 'pages/project-details';
import ClientDetailsPage from 'pages/client-details/ClientDetailsPage';
import ArchivedProjectsPage from 'pages/archived-projects';
import HelpPage from 'pages/help';

/* ---------------- Lazy loads various components ------------------------- */
const App = lazy(() => import('App'));
const MainLayout = lazy(() => import('layouts/main-layout'));
const LoginPage = lazy(() => import('pages/authentication/login'));
const SignUpPage = lazy(() => import('pages/authentication/register'));
const ForgotPasswordPage = lazy(() => import('pages/authentication/forgot-password'));
const PasswordResetPage = lazy(() => import('pages/authentication/reset-password'));
const InstagramPage = lazy(() => import('pages/instagram'));
const ProjectsPage = lazy(() => import('pages/projects'));
const RankingPage = lazy(() => import('pages/ranking'));
const WebsitesPage = lazy(() => import('pages/websites'));
const CalendarPage = lazy(() => import('pages/calendar'));
const CeoxPage = lazy(() => import('pages/ceox')); // o la ruta correcta a tu componente CEOX
const PomodoroPage = lazy(() => import('pages/pomodoro'));
const TiktokPage = lazy(() => import('pages/tiktok'));
const Dashboard = lazy(() => import('pages/dashboard/index'));
const ReportsPage = lazy(() => import('pages/reports'));
const GlobalSettingsPage = lazy(() => import('pages/settings/global-settings'));
const PersonalSettingsPage = lazy(() => import('pages/settings/personal-settings'));
const NotFoundPage = lazy(() => import('pages/not-found'));
/* -------------------------------------------------------------------------- */

/**
 * @Defines the routes for the application using React Router.
 */
export const routes = [
  {
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: paths.default,
        element: (
          <Suspense fallback={<PageLoader />}>
            <MainLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            ),
          },
          {
            index: true,
            path: paths.projects,
            element: (
              <PrivateRoute>
                {' '}
                <ProjectsPage />
              </PrivateRoute>
            ),
          },
          {
            index: true,
            path: paths.archivedProjects,
            element: (
              <PrivateRoute>
                {' '}
                <ArchivedProjectsPage />
              </PrivateRoute>
            ),
          },
          {
            index: true,
            path: paths.projectDetails,
            element: (
              <PrivateRoute>
                {' '}
                <ProjectDetailsPage />
              </PrivateRoute>
            ),
          },
          {
            index: true,
            path: paths.clientDetails,
            element: (
              <PrivateRoute>
                {' '}
                <ClientDetailsPage />
              </PrivateRoute>
            ),
          },
          {
            index: true,
            path: paths.ranking,
            element: (
              <PrivateRoute>
                <RankingPage />
              </PrivateRoute>
            ),
          },
          {
            index: true,
            path: paths.calendar,
            element: (
              <PrivateRoute>
                <CalendarPage />
              </PrivateRoute>
            ),
          },
          {
            index: true,
            path: paths.ceox,
            element: (
              <PrivateRoute>
                <CeoxPage />
              </PrivateRoute>
            ),
          },
          {
            index: true,
            path: paths.websites,
            element: (
              <PrivateRoute>
                <WebsitesPage />
              </PrivateRoute>
            ),
          },
          {
            index: true,
            path: paths.pomodoro,
            element: (
              <PrivateRoute>
                <PomodoroPage />
              </PrivateRoute>
            ),
          },
          {
            index: true,
            path: paths.instagram,
            element: (
              <PrivateRoute>
                <InstagramPage />
              </PrivateRoute>
            ),
          },
          {
            path: paths.tiktok,
            element: (
              <PrivateRoute>
                <TiktokPage />
              </PrivateRoute>
            ),
          },
          {
            path: paths.reports,
            element: (
              <PrivateRoute>
                <ReportsPage />
              </PrivateRoute>
            ),
          },
          {
            path: paths.personalSettings,
            element: (
              <PrivateRoute>
                <PersonalSettingsPage />
              </PrivateRoute>
            ),
          },
          {
            path: paths.globalSettings,
            element: (
              <PrivateRoute>
                <GlobalSettingsPage />
              </PrivateRoute>
            ),
          },
          {
            path: paths.help,
            element: (
              <PrivateRoute>
                <HelpPage />
              </PrivateRoute>
            ),
          }
        ],
      },
      {
        path: rootPaths.authRoot,
        element: <AuthLayout />,
        children: [
          {
            path: paths.login,
            element: <LoginPage />,
          },
          {
            path: paths.signup,
            element: <SignUpPage />,
          },
          {
            path: paths.forgotPassword,
            element: <ForgotPasswordPage />,
          },
          {
            path: paths.resetPassword,
            element: <PasswordResetPage />,
          },
        ],
      },
      {
        path: rootPaths.errorRoot,
        children: [
          {
            path: paths.notFound,
            element: <NotFoundPage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to={paths.notFound} replace />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
