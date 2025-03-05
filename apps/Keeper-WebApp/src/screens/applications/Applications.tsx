import { RootState } from 'reduxStore/store';
import { useSelector } from 'react-redux';
import { Grid, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { ApplicationsService, TApplicationWithJob } from 'keeperServices';
import { TJob } from 'keeperTypes';
import { AppBoldText, AppHeaderText, Match } from 'components';

import useStyles from './ApplicationsStyles';
import { useTheme } from 'theme/theme.context';

const Applications = () => {
  const employeeId = useSelector((state: RootState) => state.loggedInUser._id);

  const [applications, setApplications] = useState<TApplicationWithJob[]>();

  const styles = useStyles();
  const { theme } = useTheme();

  useEffect(() => {
    ApplicationsService.findApplicationsByUserId({ employeeId: employeeId || '' })
      .then(res => {
        console.log('Applications:', res.data);
        res.data && setApplications(res.data);
      })
      .catch(error => {
        console.error('Error finding applications:', error);
      });
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
