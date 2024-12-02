import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxStore';
import { WithBadge } from 'components';
import { Discover, Matches, EmployeeProfileScreen, JobBoard } from 'screens';
import { getMatchesFromEmployersJobs } from 'utils';
import Octicons from 'react-native-vector-icons/Octicons';
import { useTheme } from 'theme/theme.context';

import DiscoverIconGrey from '../assets/svgs/discoverIconGrey.svg';
import DiscoverIconWhite from '../assets/svgs/discoverIconWhite.svg';
import CogIconWhite from '../assets/svgs/settingsIconWhite.svg';
import CogIconGrey from '../assets/svgs/settingsIconGrey.svg';
import { bottomTabNavigatorBaseHeight } from 'constants/globalConstants';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const bottomNavBarHeight = useSelector((state: RootState) => state.local.bottomNavBarHeight);
  const employeeMatches = useSelector((state: RootState) => state.loggedInUser.matches);
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);
  const isNewEmployee = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);
  const isEmployerNew = useSelector((state: RootState) => state.loggedInUser.isNew);

  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const hasReceivedLikeNotification = useSelector((state: RootState) => state.loggedInUser.hasReceivedLikeNotification);

  const [hasNotification, setHasNotification] = useState(false);
  const [currentTab, setCurrentTab] = useState('Discover');

  const { theme } = useTheme();
  const isEmployee = accountType === 'employee';
  const matches = isEmployee ? employeeMatches : getMatchesFromEmployersJobs(employersJobs || []);
  const initialScreen = isEmployee && isNewEmployee ? 'Profile' : isEmployee ? 'Discover' : 'Job Board';

  useEffect(() => {
    let localHasNotification = false;
    matches?.map(match => {
      if (match?.custom.hasNotification) {
        localHasNotification = true;
      }
    });
    setHasNotification(localHasNotification || !!hasReceivedLikeNotification);
  }, [matches]);

  const returnProfileIcon = useCallback((color: string) => {
    if (isEmployee) {
      return <Octicons name='person' size={35} color={color === 'white' ? 'white' : 'grey'} />;
    } else if (!isEmployee && color === 'white') {
      return <CogIconWhite style={styles.cogIconStyles} />;
    } else if (!isEmployee && color != 'white') {
      return <CogIconGrey style={styles.cogIconStyles} />;
    }
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={initialScreen}
      detachInactiveScreens={true}
      tabBarOptions={{
        // showLabel: false,
        labelStyle: {
          top: -18,
          position: 'relative',
        },
        iconStyle: {
          top: -5,
          position: 'relative',
        },
        style: {
          borderTopWidth: 0,
          height: bottomTabNavigatorBaseHeight,
          bottom: bottomNavBarHeight - bottomTabNavigatorBaseHeight,
          position: 'absolute',
          left: 0,
          right: 0,
        },
        safeAreaInsets: {
          bottom: 0,
        },
        activeTintColor: 'white',
        inactiveTintColor: '#808080',
        inactiveBackgroundColor: theme.color.primary,
        activeBackgroundColor: theme.color.primary,
      }}>
      {(isEmployee || !isLoggedIn) && (
        <Tab.Screen
          name={isEmployee ? 'Profile' : isEmployerNew ? 'Sign Up' : 'Job Board'}
          component={EmployeeProfileScreen}
          initialParams={{ isFromBottomTabNav: true }}
          listeners={() => ({
            tabPress: e => {
              setCurrentTab('Profile');
            },
          })}
          options={{
            tabBarIcon: ({ color, focused }) => {
              return returnProfileIcon(color);
            },
          }}
        />
      )}

      {!isEmployee && isLoggedIn && (
        <Tab.Screen
          name={'Job Board'}
          component={JobBoard}
          listeners={() => ({
            tabPress: e => {
              setCurrentTab('Job Board');
            },
          })}
          options={() => ({
            tabBarIcon: ({ color }) => {
              return color === 'white' ? (
                <CogIconWhite style={styles.cogIconStyles} />
              ) : (
                <CogIconGrey style={styles.cogIconStyles} />
              );
            },
          })}
        />
      )}

      <Tab.Screen
        name={'Discover'}
        component={Discover}
        listeners={() => ({
          tabPress: e => {
            setCurrentTab('Discover');
          },
        })}
        options={() => ({
          tabBarIcon: ({ color }) => {
            return color === 'white' ? (
              <DiscoverIconWhite style={styles.discoverIcon} />
            ) : (
              <DiscoverIconGrey style={styles.discoverIcon} />
            );
          },
        })}
      />

      <Tab.Screen
        name='Matches'
        component={Matches}
        listeners={() => ({
          tabPress: e => {
            setCurrentTab('Matches');
          },
        })}
        options={{
          tabBarIcon: ({ color }) => {
            return color === 'white' ? (
              <WithBadge hasNotification={hasNotification}>
                <Octicons name='people' size={40} color='white' />
              </WithBadge>
            ) : (
              <WithBadge hasNotification={hasNotification}>
                <Octicons name='people' size={40} color='grey' />
              </WithBadge>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabs: { position: 'relative' },
  settingsIcon: { height: 34, width: 33, paddingBottom: 2 },
  discoverIcon: { height: 32, width: 32, paddingBottom: 2 },
  messagesIcon: { height: 31, width: 36, paddingBottom: 2 },
  cogIconStyles: { height: 31, width: 36, paddingBottom: 2 },
});

export default BottomTabNavigator;
