import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

type OnlyPublicAdminProps = {
  children: React.ReactNode;
};

// this file redirects you back to home screen if you are not an admin. Admins are only
// people that work for keeper that can access specific things, like growth engine
const OnlyAdminRoute = ({ children }: OnlyPublicAdminProps) => {
  const isAdmin = useSelector((state: RootState) => state.loggedInUser.isAdmin);

  if (!isAdmin) {
    return <Navigate to={'/'} />;
  }

  return <>{children}</>;
};

export default OnlyAdminRoute;
