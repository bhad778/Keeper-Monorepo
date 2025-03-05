import { RootState } from 'reduxStore/store';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { ApplicationsService, TApplicationWithJob } from 'keeperServices';
import { AppBoldText, Match } from 'components';
import { useTheme } from 'theme/theme.context';

import useStyles from './ApplicationsStyles';

const Applications = () => {
  const employeeId = useSelector((state: RootState) => state.loggedInUser._id);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);

  const [applications, setApplications] = useState<TApplicationWithJob[]>();

  const styles = useStyles();
  const { theme } = useTheme();

  useEffect(() => {
    if (isLoggedIn) {
      ApplicationsService.findApplicationsByUserId({ employeeId: employeeId || '' })
        .then(res => {
          res.data && setApplications(res.data);
        })
        .catch(error => {
          console.error('Error finding applications:', error);
        });
    }
  }, []);

  const onMatchPress = () => {};

  return (
    <Grid container style={styles.container}>
      {applications && applications.length > 0 ? (
        applications?.map((application, index) => {
          return (
            <Match
              key={index}
              title={application.jobId.jobTitle}
              text={application.jobId.jobSummary}
              img={application.jobId.companyLogo || ''}
              color={theme.color.pink}
              isEmployee={false}
              isCandidateSort={true}
              onPress={onMatchPress}
            />
          );
        })
      ) : (
        <AppBoldText style={styles.noApplicationsText}>
          Once you apply to jobs you can keep track of them here.
        </AppBoldText>
      )}
    </Grid>
  );
};

export default Applications;
