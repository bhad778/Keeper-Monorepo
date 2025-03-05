import { useDispatch, useSelector } from 'react-redux';
import { addLoggedInUser, setSwipingDataRedux } from 'reduxStore';
import { RootState } from 'reduxStore/store';
import toast from 'react-hot-toast';
import { formatPhoneNumberInput } from 'utils/globalUtils';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { MiscService, UsersService } from 'services';
import { useLocation, useNavigate } from 'react-router-dom';
import { TEmployee, TLoggedInUserData } from 'keeperTypes';
import { LoadingScreen } from 'screens';
import { AppHeaderText, BackButton, KeeperSelectButton, KeeperTextInput } from 'components';

import useStyles from './PhoneNumberStyles';

type TGetEmployeeData = {
  loggedInUserData: TLoggedInUserData;
  employeesForSwiping: TEmployee[];
};

const PhoneNumber = () => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const isEmployeeNew = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);
  const isEmployerNew = useSelector((state: RootState) => state.loggedInUser.isNew);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signInResponse, setSignInResponse] = useState();
  const [firstName] = useState('');
  const [lastName] = useState('');

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const styles = useStyles(isPhoneNumberValid, isVerificationCodeValid);

  const isEmployee = accountType === 'employee';
  const isNew = isEmployee ? isEmployeeNew : isEmployerNew;
  const isLogIn = location?.state?.isLogIn;

  useEffect(() => {
    if (verificationCode.length === 6) {
      setIsVerificationCodeValid(true);
    }
  }, [verificationCode]);

  const onChangePhoneNumber = (value: string) => {
    setPhoneNumber(formatPhoneNumberInput(value));
    // The lenth of the value this condition is checking includes parentheses and dashes along with numbers
    if (value.length <= 15 && value.length >= 14) {
      setIsPhoneNumberValid(true);
    } else {
      setIsPhoneNumberValid(false);
    }
  };

  const sendPhoneNumber = () => {
    const numericPhoneNumber = '+1' + phoneNumber.replace(/\D/g, '');

    Auth.signIn(numericPhoneNumber, 'Password$4')
      .then((signInResponse: any) => {
        setIsLoading(false);
        setSignInResponse(signInResponse);
      })
      .catch((error: any) => {
        setIsLoading(false);

        if (error.message == 'Incorrect username or password.') {
          toast.error('You need to sign up first!');
        }
        console.error(error);
      });
  };

  const onNextButtonPress = async () => {
    const numericPhoneNumber = '+1' + phoneNumber.replace(/\D/g, '');

    if (isLogIn) {
      try {
        setIsLoading(true);

        sendPhoneNumber();
      } catch (error) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);

      signUp(numericPhoneNumber);
    }

    // navigation.navigate('VerificationCode', { phoneNumber: numericPhoneNumber, signInResponse: true });
  };

  const sendVerificationCode = async () => {
    try {
      setIsLoading(true);
      await Auth.confirmSignIn(signInResponse, verificationCode, 'SMS_MFA');
      const currentUserInfo = await Auth.currentUserInfo();

      const numericPhoneNumber = '+1' + phoneNumber.replace(/\D/g, '');
      const isEmployer = currentUserInfo.attributes['custom:accountType'] === 'employer';
      if (isEmployer) {
        UsersService.getEmployerData({
          phoneNumber: numericPhoneNumber,
        })
          .then(({ loggedInUserData, employeesForSwiping }: TGetEmployeeData) => {
            loggedInUserData.isLoggedIn = true;
            dispatch(addLoggedInUser(loggedInUserData));
            // only update swiping data if they are not new, which means they have a tailored feed. If they are new they
            // are still only browsing and updating swiping data would just reset all their swipes they already did
            if (!loggedInUserData.isNew) {
              dispatch(setSwipingDataRedux(employeesForSwiping));
            }

            setIsLoading(false);

            navigate('/employerHome/jobBoard');
          })
          .catch(error => {
            // if your account gets deleted in DB but not in cognito, this will cause a messed up bug
            // the backend needs to return a specific error if user exists in cognito but not in DB
            // a modal needs to pop up saying we will delete your account?
            console.error(error);
            setIsLoading(false);
          });
      } else {
        UsersService.getEmployeeData({
          phoneNumber: numericPhoneNumber,
        })
          .then(({ loggedInUserData, jobsForSwiping }) => {
            dispatch(addLoggedInUser(loggedInUserData));
            // only update swiping data if they are not new, which means they have a tailored feed. If they are new they
            // are still only browsing and updating swiping data would just reset all their swipes they already did
            if (!loggedInUserData.preferences.isNew) {
              dispatch(setSwipingDataRedux(jobsForSwiping));
            }
            setIsLoading(false);
            dispatch(addLoggedInUser({ isLoggedIn: true }));

            // this just makes the api call warm
            MiscService.searchAndCollectCoreSignal({ fullName: '', companyName: '', isPing: true });

            navigate('/exploreJobs');

            // if (isNew) {
            //   navigate('/employeeHome/profile');
            // } else {
            //   navigate('/employeeHome/discover');
            // }
          })
          .catch(error => {
            console.error('error signing in', error);
            setIsLoading(false);
          });
      }
    } catch (error: any) {
      if (error.code == 'CodeMismatchException') {
        toast.error('Wrong error code');
      } else if (error.message == 'Invalid session for the user, session is expired.') {
        toast.error('Code expired');
      }
      console.error('error signing in', error);
      setIsLoading(false);
    }
  };

  const signUp = async (numericPhoneNumber: string) => {
    // these custom attributes were created initially but later chosen to not be used,
    // it is tech debt to not require these eventually
    const stringifiedSignUpObject = {
      'custom:firstName': firstName,
      'custom:lastName': lastName,
      'custom:email': email,
      'custom:cityState': 'empty',
      // 'custom:accountType': accountType,
      'custom:accountType': 'employee',
      'custom:relevantSkills': 'empty',
      'custom:yearsOfExp': '0',
      'custom:reqYearsOfExp': '0',
    };
    Auth.signUp({
      username: numericPhoneNumber,
      password: 'Password$4',
      attributes: stringifiedSignUpObject,
    })
      .then(() => {
        sendPhoneNumber();
      })
      .catch(error => {
        if (error.code == 'UsernameExistsException') {
          // if phone number already exists, then just go again but call log in function this
          // time not signUp, no need to make the user switch from signing up to log in
          sendPhoneNumber();
          // toast.error('Phone number already exists, try logging in');
        } else {
          console.error('error signing up:', error);
          setIsLoading(false);
        }
      });
  };

  const onBackClick = () => {
    setSignInResponse(undefined);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div style={styles.container}>
      {signInResponse ? (
        <>
          <BackButton onClick={onBackClick} iconStyles={styles.backIcon} />

          <KeeperTextInput
            value={verificationCode}
            label='Enter Verification Code'
            labelStyles={styles.label}
            onChange={setVerificationCode}
            onKeyDown={(event: any) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                sendVerificationCode();
              }
            }}
          />

          <KeeperSelectButton
            disabled={!isVerificationCodeValid}
            title='Submit'
            onClick={sendVerificationCode}
            buttonStyles={styles.verificationSubmitButton}
            textStyles={styles.verificationSubmitButtonText}
          />
        </>
      ) : (
        <>
          {/* {!isEmployee && (
            <>
              <KeeperTextInput
                value={firstName}
                label="First Name"
                labelStyles={styles.label}
                onChange={(value) => setFirstName(value)}
              />
              <KeeperTextInput
                value={lastName}
                label="Last Name"
                labelStyles={styles.label}
                onChange={(value) => setLastName(value)}
              />
            </>
          )} */}
          {/* {!isEmployee && !isLogIn && (
            <AppHeaderText style={styles.titleText}>Sign Up and Create Your First Job</AppHeaderText>
          )} */}

          {!isLogIn && (
            <KeeperTextInput
              value={email}
              label='Email'
              labelStyles={styles.label}
              onChange={setEmail}
              containerStyles={styles.textInputContainer}
            />
          )}

          <KeeperTextInput
            value={phoneNumber}
            label='Phone Number'
            labelStyles={styles.label}
            containerStyles={styles.textInputContainer}
            subLabel={'We use this only to send you a one time password and make sure you are not AI'}
            onChange={onChangePhoneNumber}
            onKeyDown={(event: any) => {
              if (event.key === 'Enter' && isPhoneNumberValid) {
                event.preventDefault();
                onNextButtonPress();
              }
            }}
          />

          <KeeperSelectButton
            disabled={!isPhoneNumberValid}
            title='Submit'
            onClick={onNextButtonPress}
            buttonStyles={styles.submitButton}
            textStyles={styles.submitButtonText}
          />
        </>
      )}
    </div>
  );
};

export default PhoneNumber;
