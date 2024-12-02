import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { TMatch } from 'types';
import { RootState } from 'reduxStore';
import { ChannelListItem } from 'components';
import { View } from 'react-native';
import { getMatchesContainerHeight, reorderObjectArrayByDate } from 'utils';

import { useStyles } from './ChannelListStyles';

type TChannelListComponent = {
  matches: TMatch[];
  isCandidateSort: boolean;
};

const ChannelList = ({ matches, isCandidateSort }: TChannelListComponent) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const employeeFirstName = useSelector((state: RootState) => state.loggedInUser.settings.firstName);
  const employeeLastName = useSelector((state: RootState) => state.loggedInUser.settings.lastName);
  const employeeImg = useSelector((state: RootState) => state.loggedInUser.settings.img);
  const isEmployee = accountType === 'employee';

  const styles = useStyles(matches.length);

  const returnChannelListItems = useCallback(() => {
    if (matches.length > 0) {
      return reorderObjectArrayByDate(matches, 'updated').map((channel: TMatch, index: number) => {
        return (
          <ChannelListItem
            key={index}
            channel={channel}
            isEmployee={isEmployee}
            jobColor={channel?.custom?.jobColor || ''}
            senderId={isEmployee ? loggedInUserId : channel?.custom?.jobId}
            senderName={
              isEmployee
                ? `${employeeFirstName} ${employeeLastName}`
                : `${channel?.custom?.jobTitle} ${channel?.custom?.companyName}`
            }
            senderImg={isEmployee ? employeeImg : channel?.custom?.jobImg}
            isCandidateSort={isCandidateSort}
          />
        );
      });
    } else {
      return [1, 2, 3, 4].map((item, index) => {
        return <View style={styles.blankChannelListItem} key={index} />;
      });
    }
  }, [
    matches,
    styles.blankChannelListItem,
    isEmployee,
    loggedInUserId,
    employeeFirstName,
    employeeLastName,
    employeeImg,
    isCandidateSort,
  ]);

  return (
    <View style={[styles.customChannelListWrapper, { height: getMatchesContainerHeight(matches.length) }]}>
      <View style={styles.customChannelList}>{returnChannelListItems()}</View>
    </View>
  );
};

export default ChannelList;
