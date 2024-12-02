import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addMatches } from 'reduxStore';
import { MiscService, UsersService } from 'services';
import { TEmployee, TJob, TMatch } from 'types';

const useMatch = () => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const loggedInUserEmail = useSelector((state: RootState) => state.loggedInUser.email);
  const employeeFirstName = useSelector((state: RootState) => state.loggedInUser.settings.firstName);
  const employeeLastName = useSelector((state: RootState) => state.loggedInUser.settings.lastName);
  const employeeProfilePic = useSelector((state: RootState) => state.loggedInUser.settings.img);
  const loggedInUserExpoPushToken = useSelector((state: RootState) => state.loggedInUser.expoPushToken);

  const isEmployee = accountType === 'employee';

  const dispatch = useDispatch();

  const createMatch = useCallback(
    async (newMatchUser: TEmployee | TJob, jobThatGotMatch?: TJob) => {
      let loggedInUserMatch: TMatch = {};

      let otherUserMatch: TMatch = {};

      if (isEmployee) {
        const tempNewMatchUser = newMatchUser as TJob;

        loggedInUserMatch = {
          name: tempNewMatchUser.settings.title || '',
          custom: {
            profileUrl: tempNewMatchUser.settings.img || '',
            hasNotification: true,
            expoPushToken: tempNewMatchUser.expoPushToken || '',
            isNew: true,
            jobId: tempNewMatchUser._id || '',
            jobOwnerId: tempNewMatchUser.ownerId,
            jobOwnerEmail: tempNewMatchUser.ownerEmail || '',
            jobColor: tempNewMatchUser.color,
            jobTitle: tempNewMatchUser.settings.title || '',
            jobImg: tempNewMatchUser.settings.img || '',
            companyName: tempNewMatchUser.settings.companyName || '',
            employeeColor: '',
            employeeId: loggedInUserId || '',
            employeeEmail: loggedInUserEmail || '',
          },
          description: 'Send the first message!',
          eTag: '',
          id: loggedInUserId + '-' + tempNewMatchUser._id,
          updated: new Date().toString(),
        };

        otherUserMatch = {
          name: employeeFirstName + ' ' + employeeLastName,
          custom: {
            profileUrl: employeeProfilePic || '',
            hasNotification: true,
            expoPushToken: loggedInUserExpoPushToken || '',
            isNew: true,
            jobId: tempNewMatchUser._id || '',
            jobOwnerId: tempNewMatchUser.ownerId,
            jobOwnerEmail: tempNewMatchUser.ownerEmail || '',
            jobColor: tempNewMatchUser.color,
            jobTitle: tempNewMatchUser.settings.title || '',
            jobImg: tempNewMatchUser.settings.img || '',
            companyName: tempNewMatchUser.settings.companyName || '',
            employeeColor: '',
            employeeId: loggedInUserId || '',
            employeeEmail: loggedInUserEmail || '',
          },
          description: 'Send the first message!',
          eTag: '',
          id: loggedInUserId + '-' + tempNewMatchUser._id,
          updated: new Date().toString(),
        };
      } else {
        const tempNewMatchUser = newMatchUser as TEmployee;

        loggedInUserMatch = {
          name: tempNewMatchUser.settings.firstName + ' ' + tempNewMatchUser.settings.lastName,
          custom: {
            profileUrl: tempNewMatchUser.settings.img || '',
            hasNotification: true,
            expoPushToken: tempNewMatchUser.expoPushToken || '',
            isNew: true,
            // we will have to make a receivedLikes object array, in each object it includes the id of the
            // job that received the like, the color, and the id of who liked it, the jobTitle, the companyName, and the jobImg
            jobId: jobThatGotMatch?._id || '',
            jobOwnerId: loggedInUserId || '',
            jobOwnerEmail: loggedInUserEmail || '',
            jobColor: jobThatGotMatch?.color || '',
            jobTitle: jobThatGotMatch?.settings.title || '',
            jobImg: jobThatGotMatch?.settings.img || '',
            companyName: jobThatGotMatch?.settings.companyName || '',
            employeeColor: '',
            employeeId: tempNewMatchUser._id || '',
            employeeEmail: tempNewMatchUser.email || '',
          },
          description: 'Send the first message!',
          eTag: '',
          id: jobThatGotMatch?._id + '-' + tempNewMatchUser._id,
          updated: new Date().toString(),
        };

        otherUserMatch = {
          name: jobThatGotMatch?.settings.title || '',
          custom: {
            profileUrl: jobThatGotMatch?.settings.img || '',
            hasNotification: true,
            expoPushToken: loggedInUserExpoPushToken || '',
            isNew: true,
            jobId: jobThatGotMatch?._id || '',
            jobOwnerId: loggedInUserId || '',
            jobOwnerEmail: loggedInUserEmail || '',
            jobColor: jobThatGotMatch?.color || '',
            jobTitle: jobThatGotMatch?.settings.title || '',
            jobImg: jobThatGotMatch?.settings.img || '',
            companyName: jobThatGotMatch?.settings.companyName || '',
            employeeColor: '',
            employeeId: tempNewMatchUser._id || '',
            employeeEmail: tempNewMatchUser.email || '',
          },
          description: 'Send the first message!',
          eTag: '',
          id: jobThatGotMatch?._id + '-' + tempNewMatchUser._id,
          updated: new Date().toString(),
        };
      }

      try {
        UsersService.addMatch({
          accountType,
          loggedInUserMatch,
          otherUserMatch,
        }).then((response: any) => {
          try {
            const messageObject = {
              to: newMatchUser.expoPushToken || '',
              title: 'You got a match!',
              body: `Send ${
                isEmployee ? `${employeeFirstName} ${employeeLastName}` : jobThatGotMatch?.settings.companyName
              } a message!`,
              sound: 'default',
              data: {
                type: 'match',
                senderId: (isEmployee ? loggedInUserId : jobThatGotMatch?._id) || '',
                receiverId:
                  (isEmployee
                    ? response.otherUserMatch.custom.jobOwnerId
                    : response.otherUserMatch.custom.employeeId) || '',
                matchData: response.otherUserMatch,
              },
            } as const;
            MiscService.sendPubnubNotification({
              messageObject,
            });
          } catch (error) {
            console.error('there was an error sending expo push notification from message send- ', error);
          }

          dispatch(
            addMatches({
              newMatches: [response.loggedInUserMatch],
              jobId: jobThatGotMatch?._id,
            }),
          );
        });
      } catch (error) {
        console.error(`There was an error adding the match ${loggedInUserMatch}`);
      }
    },
    [
      accountType,
      dispatch,
      employeeFirstName,
      employeeLastName,
      employeeProfilePic,
      isEmployee,
      loggedInUserEmail,
      loggedInUserExpoPushToken,
      loggedInUserId,
    ],
  );

  return {
    createMatch,
  };
};

export default useMatch;
