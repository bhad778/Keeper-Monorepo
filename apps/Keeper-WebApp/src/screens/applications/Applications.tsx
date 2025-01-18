import { RootState } from 'reduxStore/store';
import { useSelector } from 'react-redux';
import { Grid, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { ApplicationsService } from 'keeperServices';
import { TJob } from 'keeperTypes';

import useStyles from './ApplicationsStyles';

const Applications = () => {
  const employeeId = useSelector((state: RootState) => state.loggedInUser._id);

  const [applications, setApplications] = useState<TJob[]>();

  const styles = useStyles(true);

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

  return (
    <Box sx={styles.container}>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={styles.header}>
            <Box sx={styles.headerText}>Applications</Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Applications;
