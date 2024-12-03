import { Link, Outlet } from 'react-router-dom';
import { RootState } from 'reduxStore/store';
import PubNub, { StatusEvent, MessageEvent } from 'pubnub';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addMatches, addReceivedLike, updateMatch, updateMatchNotificationRedux } from 'reduxStore';
import { AppHeaderText, InitialsAvatar, WithBadge } from 'components';
import KeeperLogo from 'assets/images/keeperLogo.png';
import { useLocation } from 'react-router-dom';
import { getMatchesFromEmployersJobs } from 'utils';

import useStyles from './LayoutStyles';

const Layout = () => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const employeeMatches = useSelector((state: RootState) => state.loggedInUser.matches);
  const selectedChannel = useSelector((state: RootState) => state.local.selectedChannel);
  const isEmployeeNew = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);
  const isEmployerNew = useSelector((state: RootState) => state.loggedInUser.isNew);
  const hasReceivedLikeNotification = useSelector((state: RootState) => state.loggedInUser.hasReceivedLikeNotification);
  const selectedJobId = useSelector((state: RootState) => state.local.selectedJob._id);

  const isEmployee = accountType === 'employee';
  const isNew = isEmployee ? isEmployeeNew : isEmployerNew;
  const matches = isEmployee ? employeeMatches : getMatchesFromEmployersJobs(employersJobs || []);

  const dispatch = useDispatch();
  const location = useLocation();
  const styles = useStyles(location.pathname, !!selectedJobId);

  const [hasNotification, setHasNotification] = useState(false);

  const pubNubPublishKey = import.meta.env.VITE_PUBNUB_PUBLISH_KEY;
  const pubNubSubscribeKey = import.meta.env.VITE_PUBNUB_SUBSCRIBE_KEY;

  const pubnub = new PubNub({
    publishKey: pubNubPublishKey,
    subscribeKey: pubNubSubscribeKey,
    userId: loggedInUserId || 'blank',
  });

  useEffect(() => {
    let localHasNotification = false;
    matches?.map((match) => {
      if (match?.custom.hasNotification) {
        localHasNotification = true;
      }
    });
    setHasNotification(localHasNotification || !!hasReceivedLikeNotification);
  }, [hasReceivedLikeNotification, matches]);

  // const onPageReload = () => {
  //   loadInitialData();
  // };

  const returnHasNotification = (matchId: string, selectedChannelId: string | undefined) => {
    const currentUrl = window.location.href;
    // if you are not on matches page always show notification
    if (!currentUrl.includes('matches')) {
      return true;
    } else {
      // if you are on matches page, only show notification if that match isnt currently selected
      return selectedChannelId != matchId;
    }
  };

  useEffect(() => {
    const listener = {
      status: (statusEvent: StatusEvent) => {
        if (statusEvent.category === 'PNConnectedCategory') {
          console.log('Connected');
        }
      },
      message: (messageEvent: MessageEvent) => {
        if (messageEvent.message.type === 'message') {
          const matchId = messageEvent.message.matchData?.id;
          const message = messageEvent.message.message;
          const matchNotificationObject = {
            matchId,
            hasNotification: returnHasNotification(matchId, selectedChannel?.id),
          };

          // update notification locally, it gets updated in DB when message is sent
          dispatch(updateMatchNotificationRedux({ ...matchNotificationObject }));
          // update match with latest text
          dispatch(
            updateMatch({
              matchData: {
                id: matchId,
                updated: new Date(),
                description: message.text || '',
              },
            })
          );
        } else if (messageEvent.message.type === 'match') {
          const jobId = messageEvent.message.matchData?.custom?.jobId;
          const matchData = messageEvent.message.matchData;

          dispatch(addMatches({ newMatches: [matchData], jobId }));
        } else if (messageEvent.message.type === 'like') {
          const receivedLikeId = messageEvent.message.senderId;
          const jobId = isEmployee ? '' : messageEvent.message.jobId;

          dispatch(addReceivedLike({ receivedLikeId, jobId }));
        }
      },
    };

    pubnub.addListener(listener);

    pubnub.subscribe({
      // subscribe to your own userId, other users sending you notifications will
      // send all through your loggedInUserId channel, it is sorted and dealt with
      // when it is caught by the other browser
      channels: [loggedInUserId || ''],
    });

    // fires on page reload
    // window.addEventListener('beforeunload', onPageReload);

    return () => {
      pubnub.removeListener(listener);

      pubnub.unsubscribeAll();

      // window.removeEventListener('beforeunload', onPageReload);
    };
  }, [selectedChannel]);

  return (
    <div style={styles.container}>
      <div style={styles.navBar}>
        <img src={KeeperLogo} style={styles.logo} />

        <div style={styles.navLinksContainer}>
          <Link style={{ ...styles.navItem, ...styles.discoverNav }} to={'discover'}>
            <AppHeaderText style={styles.discoverNavText}>Discover</AppHeaderText>
          </Link>

          {!isEmployee && isLoggedIn && (
            <Link style={{ ...styles.navItem, ...styles.jobBoardNav }} to={'jobBoard'}>
              <AppHeaderText style={styles.jobBoardNavText}>Job Board</AppHeaderText>
            </Link>
          )}

          {/* if theyre not logged in they always see this screen */}
          {(isEmployee || !isLoggedIn) && (
            <Link style={{ ...styles.navItem, ...styles.profileNav }} to={`profile`}>
              <AppHeaderText style={styles.profileNavText}>{isNew ? 'Sign Up' : 'Profile'}</AppHeaderText>
            </Link>
          )}

          <Link style={{ ...styles.navItem, ...styles.matchesNav }} to={`matches`}>
            <WithBadge hasNotification={hasNotification}>
              <AppHeaderText style={styles.employeeMatchesText}>Matches</AppHeaderText>
            </WithBadge>
          </Link>
        </div>

        {/* <CogIcon style={styles.settingsIcon} /> */}

        <InitialsAvatar />
      </div>
      <Outlet />
    </div>
  );
};
export default Layout;
