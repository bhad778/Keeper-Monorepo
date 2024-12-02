import { useEffect, useState } from 'react';
import Swiper from 'components/swiper/Swiper';
import { employeeSlidesData, employerSlidesData } from 'components/swiper/EducationSwiperSlides';
import { useDispatch, useSelector } from 'react-redux';
import { addLoggedInUser } from 'reduxStore';
import { RootState } from 'reduxStore/store';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'services';
import { Clickable, KeeperSelectButton, AppHeaderText } from 'components';

import useStyles from './AccountTypeStyles';
import { warmUpEmployeeSignUp, warmUpEmployerSignUp, warmUpGetForSwiping } from 'utils/globalUtils';

const AccountTypeScreen = () => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const [isEducationSwiperVisible] = useState(false);

  const navigate = useNavigate();
  const styles = useStyles(isEducationSwiperVisible);
  const dispatch = useDispatch();
  const { logOut } = useAuth();

  useEffect(() => {
    // this is because this resets redux data, and its only here for the case where
    // you browse as one thing, then come back to this screen and browse as the other,
    // all the swiping data will still be there and needs to be wiped
    logOut();

    warmUpGetForSwiping();
  }, []);

  const onChangeAccountType = (value: 'employee' | 'employer') => {
    if (accountType === 'employee') {
      warmUpEmployeeSignUp();
    } else if (accountType === 'employer') {
      warmUpEmployerSignUp();
    }

    dispatch(addLoggedInUser({ accountType: value }));
    navigateToDiscover();
  };

  const onLoginClick = () => {
    navigate('/phoneNumber', { state: { isLogIn: true } });
  };

  const navigateToDiscover = () => {
    navigate('/browse/discover');
  };

  return (
    <div style={styles.container}>
      {isEducationSwiperVisible ? (
        <Swiper slides={accountType === 'employee' ? employeeSlidesData : employerSlidesData} />
      ) : (
        <>
          <AppHeaderText style={styles.titleText}>
            What will you be
            <br />
            using Keeper for?
          </AppHeaderText>
          <span style={styles.buttonContainer}>
            <KeeperSelectButton
              title="Looking For Jobs"
              buttonStyles={styles.loginButtons}
              textStyles={styles.loginButtonText}
              onClick={() => onChangeAccountType('employee')}
            />
            <KeeperSelectButton
              title="Looking To Hire"
              buttonStyles={styles.loginButtons}
              textStyles={styles.loginButtonText}
              onClick={() => onChangeAccountType('employer')}
            />
          </span>
          <AppHeaderText style={styles.haveAccountText}>Already have an account?</AppHeaderText>
          <Clickable onClick={onLoginClick}>
            <AppHeaderText style={styles.loginText}>Login</AppHeaderText>
          </Clickable>
        </>
      )}
    </div>
  );
};

export default AccountTypeScreen;
