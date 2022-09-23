import { lazy } from 'react';
import { Navigate } from 'react-router';

import DefaultLayout from './view/layout/DefaultLayout';
import MainLayout from './view/layout/MainLayout';

const LoginView = lazy(() => import('./view/main/LoginView'));
const DashboardView = lazy(() => import('./view/main/DashboardView'));
const SessionView = lazy(() => import('./view/main/SessionView'));
const SessionDetailView = lazy(() => import('./view/main/SessionDetail'));
const CreateQuestionView = lazy(() => import('./view/main/CreateQuestion'));

const routes = [
  {
    path: 'lkpi',
    element: <DefaultLayout />,
    children: [
      {
        path: 'dashboard',
        element: <MainLayout />,
        children: [
          { path: 'main', element: <DashboardView /> },
          {
            path: 'session',
            element: <DefaultLayout />,
            children: [
              { path: '', element: <SessionView /> },
              { path: ':id', element: <SessionDetailView /> },
            ],
          },
          { path: 'create-question', element: <CreateQuestionView /> },
          { path: '', element: <Navigate to="main" /> },
        ],
      },
      { path: 'login', element: <LoginView /> },
      {
        path: '',
        element: <Navigate to="dashboard" />,
      },
    ],
  },
  { path: '', element: <Navigate to="/lkpi" /> },
  { path: '*', element: <Navigate to="/lkpi" /> },
];

export default routes;
