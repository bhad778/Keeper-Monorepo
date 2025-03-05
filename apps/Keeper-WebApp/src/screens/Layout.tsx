import { Link, Outlet } from 'react-router-dom';
import { RootState } from 'reduxStore/store';
import { useSelector } from 'react-redux';
import { AppBoldText, AppHeaderText, InitialsAvatar } from 'components';
import { useLocation } from 'react-router-dom';

import useStyles from './LayoutStyles';

const Layout = () => {
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);

  const location = useLocation();
  const styles = useStyles(location.pathname);

  return (
    <div style={styles.container}>
      <div style={styles.navBar}>
        <div style={styles.logoTextContainer}>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <div style={styles.logoContainer}>
              <AppBoldText style={styles.logoText}>Zyra</AppBoldText>
            </div>
          </Link>
          <Link to='/' style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
            <div style={styles.logoContainer}>
              <AppBoldText style={styles.subLogoText}>
                - Explore jobs from every major jobs site in one place
              </AppBoldText>
            </div>
          </Link>
        </div>
        <div style={styles.navLinksContainer}>
          <Link style={styles.navItem} to={'exploreJobs'}>
            <AppHeaderText style={{ ...styles.navText, ...styles.jobsNavText }}>Explore Jobs</AppHeaderText>
          </Link>
          <Link style={styles.navItem} to={'applications'}>
            <AppHeaderText style={{ ...styles.navText, ...styles.applicationsNavText }}>Applications</AppHeaderText>
          </Link>
          {isLoggedIn ? (
            <InitialsAvatar currentPath={location.pathname} />
          ) : (
            <Link style={styles.navItem} to={'signUp'}>
              <AppHeaderText style={{ ...styles.navText, ...styles.logInNavText }}>Sign Up</AppHeaderText>
            </Link>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};
export default Layout;
