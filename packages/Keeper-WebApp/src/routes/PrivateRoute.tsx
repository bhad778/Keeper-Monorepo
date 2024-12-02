import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to={'/accountType'} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
