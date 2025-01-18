import { createBrowserRouter } from 'react-router-dom';
import {
  JobBoard,
  ViewResume,
  Matches,
  AccountType,
  LandingScreen,
  Layout,
  ErrorScreen,
  Discover,
  ViewJobPosting,
  GrowthEngine,
  PhoneNumber,
  EmployeeProfileScreen,
  Applications,
} from 'screens';
import { PrivateRoute, OnlyPublicRoute, OnlyAdminRoute } from 'routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingScreen />,
    errorElement: <ErrorScreen />,
  },
  {
    path: '/employeeHome',
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        path: 'discover',
        element: <Discover />,
      },
      {
        path: 'matches',
        element: <Matches />,
      },
      {
        path: 'applications',
        element: <Applications />,
      },
      {
        path: 'profile',
        element: <EmployeeProfileScreen />,
      },
    ],
  },
  {
    path: '/employerHome',
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        path: 'discover',
        element: <Discover />,
      },
      {
        path: 'jobBoard',
        element: <JobBoard />,
      },
      {
        path: 'matches',
        element: <Matches />,
      },
    ],
  },
  {
    path: '/browse',
    element: <Layout />,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        path: 'discover/:accountTypeParam?/:yearsOfExperienceParam?/:mainSkillParam?/:jobOrResumeIdParam?',
        element: <Discover />,
      },
      {
        path: 'matches',
        element: <Matches />,
      },
      {
        path: 'profile',
        element: <EmployeeProfileScreen />,
      },
    ],
  },
  {
    path: '/accountType',
    element: (
      <OnlyPublicRoute>
        <AccountType />
      </OnlyPublicRoute>
    ),
    errorElement: <ErrorScreen />,
  },
  {
    path: '/phoneNumber',
    element: (
      <OnlyPublicRoute>
        <PhoneNumber />
      </OnlyPublicRoute>
    ),
    errorElement: <ErrorScreen />,
  },
  {
    path: '/viewJobPosting/:id',
    element: <ViewJobPosting />,
    errorElement: <ErrorScreen />,
  },
  {
    path: '/viewResume/:id',
    element: <ViewResume />,
    errorElement: <ErrorScreen />,
  },
  {
    path: '/growthEngine',
    element: (
      <OnlyAdminRoute>
        <GrowthEngine />
      </OnlyAdminRoute>
    ),
    errorElement: <ErrorScreen />,
  },
]);

export default router;
