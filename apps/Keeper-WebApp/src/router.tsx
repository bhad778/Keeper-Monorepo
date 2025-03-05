import { createBrowserRouter } from 'react-router-dom';
import { Layout, ErrorScreen, PhoneNumber, EmployeeProfileScreen, Applications, FindJobs } from 'screens';
// import { PrivateRoute, OnlyPublicRoute, OnlyAdminRoute } from 'routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        path: 'exploreJobs',
        element: <FindJobs />,
      },
      {
        path: 'applications',
        element: <Applications />,
      },
      {
        path: 'signUp',
        element: <PhoneNumber />,
      },
      {
        path: 'profile',
        element: <EmployeeProfileScreen />,
      },
    ],
  },
]);

export default router;
