import { lazy } from 'react';
import { Navigate } from 'react-router';

import DefaultLayout from './view/layout/DefaultLayout';
import MainLayout from './view/layout/MainLayout';

const DashboardView = lazy(() => import('./view/main/Dashboard'));
const CreateQuestionView = lazy(() => import('./view/main/CreateQuestion'));

const routes = [
  {
    path: 'ikpi',
    element: <DefaultLayout />,
    children: [
      {
        path: 'dashboard',
        element: <MainLayout />,
        children: [
          { path: 'session', element: <DashboardView /> },
          { path: 'create-question', element: <CreateQuestionView /> },
          { path: '', element: <Navigate to="session" /> },
        ],
      },
      {
        path: '',
        element: <Navigate to="dashboard" />,
      },
    ],
  },
  { path: '', element: <Navigate to="/ikpi" /> },
  { path: '*', element: <Navigate to="/ikpi" /> },
];

export default routes;
