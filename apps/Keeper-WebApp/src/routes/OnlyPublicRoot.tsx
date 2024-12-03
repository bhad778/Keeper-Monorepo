import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

type OnlyPublicRouteProps = {
  children: React.ReactNode;
};

// this file redirects you back to home screen if you are logged in
// it is used for instance for the screen where you enter your phone number
// if you are logged in you should not be able to see that screen
const OnlyPublicRoute = ({ children }: OnlyPublicRouteProps) => {
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to={'/'} />;
  }

  return <>{children}</>;
};

export default OnlyPublicRoute;
