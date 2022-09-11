import { lazy } from 'react';
import { Navigate } from 'react-router';

import DefaultLayout from './view/layout/DefaultLayout';

const CreateQuestionView = lazy(() => import('./view/main/CreateQuestion'));

const routes = [
  {
    path: 'ikpi',
    element: <DefaultLayout />,
    children: [
      { path: 'create-question', element: <CreateQuestionView /> },

      //   {
      //     path: 'main',
      //     element: <DefaultLayout />,
      //     children: [
      //       { path: '', element: <Navigate to="main" /> },
      //     ],
      //   },
      {
        path: '',
        element: <Navigate to="create-question" />,
      },
    ],
  },
  { path: '', element: <Navigate to="/ikpi" /> },
  { path: '*', element: <Navigate to="/ikpi" /> },
];

export default routes;
