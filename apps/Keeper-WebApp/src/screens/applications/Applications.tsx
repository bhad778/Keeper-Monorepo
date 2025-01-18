import { RootState } from 'reduxStore/store';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { ApplicationsService } from 'keeperServices';
import { TJob } from 'keeperTypes';

import useStyles from './ApplicationsStyles';

const Applications = () => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const [applications, setApplications] = useState<TJob[]>();

  const dispatch = useDispatch();
  const styles = useStyles(true);

  useEffect(() => {
    ApplicationsService.findApplicationsByUserId({ employeeId: 'asdf' }).then(res => {
      res.data && setApplications(res.data);
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
