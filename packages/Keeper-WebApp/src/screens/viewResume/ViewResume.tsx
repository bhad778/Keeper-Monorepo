import { useEffect, useState } from 'react';
import ResumeComponent from 'components/resumeComponent/ResumeComponent';
import { TEmployeeSettings } from 'types';
import { UsersService } from 'services';
import { LoadingScreen } from 'screens';
import { useParams } from 'react-router-dom';

import { useStyles } from './ViewResumeStyles';

type ViewResumeProps = {
  employeeSettings?: TEmployeeSettings;
};

// this is the screen that employees
// see when they view their own resume
const ViewResume = ({ employeeSettings }: ViewResumeProps) => {
  const { id } = useParams();

  const [localEmployeeSettings, setLocalEmployeeSettings] = useState<TEmployeeSettings | undefined>(
    employeeSettings || undefined
  );

  const styles = useStyles();

  useEffect(() => {
    const getData = async () => {
      try {
        const employeeData = await UsersService.getEmployee({
          userId: id || '',
        });
        if (employeeData.error && employeeData.error == 'Account deleted error') {
          // Alert.alert('This user no longer exists!', 'Press ok to go back.', [
          //   {
          //     text: 'OK',
          //     onClick: () => {
          //       navigation.goBack();
          //     },
          //   },
          // ]);
        } else {
          setLocalEmployeeSettings(employeeData.settings);
        }
      } catch (error) {
        // Alert.alert('There was an error!', 'Press ok to go back.', [
        //   {
        //     text: 'OK',
        //     onClick: () => {
        //       navigation.goBack();
        //     },
        //   },
        // ]);
      }
    };
    if (id) {
      getData();
    }
  }, []);

  if (!localEmployeeSettings) {
    return <LoadingScreen />;
  }

  return (
    <div style={styles.container}>
      {/* <BackButton iconStyles={styles.backButtonIcon} /> */}
      {localEmployeeSettings && (
        <ResumeComponent isOwner={true} currentEmployeeSettings={{ ...localEmployeeSettings }} />
      )}
    </div>
  );
};

export default ViewResume;
