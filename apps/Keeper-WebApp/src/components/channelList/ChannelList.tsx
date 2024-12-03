import { useSelector } from 'react-redux';
import { TMatch } from 'keeperTypes';
import { RootState } from 'reduxStore';
import { ChannelListItem, SubHeaderLarge, SubHeaderSmall } from 'components';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useStyles } from './ChannelListStyles';

type TChannelListComponent = {
  matches: TMatch[];
  isCandidateSort: boolean;
  setSelectedChannel: (channel: TMatch) => void;
  isAChannelSelected: boolean;
};

const ChannelList = ({ matches, isCandidateSort, isAChannelSelected, setSelectedChannel }: TChannelListComponent) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const employeeFirstName = useSelector((state: RootState) => state.loggedInUser.settings.firstName);
  const employeeLastName = useSelector((state: RootState) => state.loggedInUser.settings.lastName);
  const employeeImg = useSelector((state: RootState) => state.loggedInUser.settings.img);

  const isEmployee = accountType === 'employee';
  const styles = useStyles(isAChannelSelected);
  const navigate = useNavigate();

  const returnChannelListItems = () => {
    if (matches.length > 0) {
      return matches.map((channel: TMatch, index: number) => {
        return (
          <ChannelListItem
            key={index}
            channel={channel}
            isEmployee={isEmployee}
            jobColor={channel?.custom?.jobColor || ''}
            senderId={(isEmployee ? loggedInUserId : channel?.custom?.jobId) || ''}
            senderName={
              isEmployee
                ? `${employeeFirstName} ${employeeLastName}`
                : `${channel?.custom?.jobTitle} ${channel?.custom?.companyName}`
            }
            senderImg={(isEmployee ? employeeImg : channel?.custom?.jobImg) || ''}
            isCandidateSort={isCandidateSort}
            setSelectedChannel={setSelectedChannel}
            isAChannelSelected={isAChannelSelected}
          />
        );
      });
    } else {
      return (
        <div style={styles.blankChannelListItem}>
          <div style={styles.topOfBlankListItem}>
            <SubHeaderLarge textInputLabelStyle={{ textAlign: 'center' }} text='Keep Swiping to Make a Match' />
          </div>
          <div
            onClick={() => navigate(isEmployee ? '/employeeHome/discover' : '/employerHome/jobBoard')}
            style={styles.bottomOfBlankListItem}>
            <SubHeaderSmall
              textInputLabelStyle={{ textAlign: 'center' }}
              text={!isEmployee ? 'Return to the Job Board to continue swiping' : 'Return to Discover to keep swiping '}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <Grid container style={styles.customChannelListWrapper}>
      {returnChannelListItems()}
    </Grid>
  );
};

export default ChannelList;
