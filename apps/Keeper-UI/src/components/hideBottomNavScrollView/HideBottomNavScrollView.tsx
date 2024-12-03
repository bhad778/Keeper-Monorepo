/* eslint-disable no-undef */
import { bottomTabNavigatorBaseHeight } from 'constants/globalConstants';
import React, { useRef, useEffect } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { setBottomNavBarHeight } from 'reduxStore/LocalSlice/localSlice';

const SCREEN_HEIGHT = Dimensions.get('window').height;

let offset = 0;
let currentNavBarHeight = bottomTabNavigatorBaseHeight;

type HideBottomNavScrollViewProps = {
  children: any;
  currentEmployee?: any;
  style?: any;
};

const HideBottomNavScrollView = ({ children, currentEmployee, style }: HideBottomNavScrollViewProps) => {
  const dispatch = useDispatch();
  const resumeScrollViewRef = useRef(null);
  let isBottomTabNavListeningToScroll = true;

  const scrollResumeToTop = () => {
    resumeScrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  useEffect(() => {
    isBottomTabNavListeningToScroll = false;
    scrollResumeToTop();
  }, [currentEmployee]);

  const onScrollBeginDrag = (event: any) => {
    offset = event.nativeEvent.contentOffset.y;
  };

  // basics: if user scrolls down shrink navbar, but dont let it go below 0
  // if user scrolls up, navbar grows but doesnt let it get above bottomTabNavigatorBaseHeight
  const onScroll = (event: any) => {
    let currentOffset = event.nativeEvent.contentOffset.y;

    if (isBottomTabNavListeningToScroll) {
      if (currentOffset != -456) {
        if (currentOffset < 0) {
          currentOffset = 0;
        }
        const height = event.nativeEvent.contentSize.height;
        let dif = 0;

        const isScrollingUp = () => currentOffset - offset < 0;

        // if currentNavBarHeight is 0 and user is still scrolling down dont do anything
        if (currentNavBarHeight == 0 && !isScrollingUp()) {
          // not doing anything
        }
        // if currentNavBarHeight is bottomTabNavigatorBaseHeight and user is scrolling up dont do anything
        else if (currentNavBarHeight == bottomTabNavigatorBaseHeight && isScrollingUp()) {
          // not doing anything
        } // if scrolling up and we hit the top, dont do anything
        else if (offset == 0 && isScrollingUp()) {
          // not doing anything
        } else if (SCREEN_HEIGHT + currentOffset >= height) {
          // not doing anything
        } else {
          dif = currentOffset - offset;
          currentNavBarHeight -= dif;
          if (currentNavBarHeight > bottomTabNavigatorBaseHeight) {
            currentNavBarHeight = bottomTabNavigatorBaseHeight;
          }
          if (currentNavBarHeight < 0) {
            currentNavBarHeight = 0;
          }
        }

        if (dif < 0) {
          dispatch(setBottomNavBarHeight(currentNavBarHeight));
        } else if (dif) {
          dispatch(setBottomNavBarHeight(currentNavBarHeight));
        }

        // dont let it get below 0
        if (currentNavBarHeight <= 0) {
          currentNavBarHeight = 0;
          offset = currentOffset;
        }

        //dont let it get above bottomTabNavigatorBaseHeight
        if (currentNavBarHeight >= bottomTabNavigatorBaseHeight) {
          currentNavBarHeight = bottomTabNavigatorBaseHeight;
        }
      }
    }
    offset = currentOffset;
  };

  // at the letting go of the drag, run for loop to set height of nav bar
  // one at a time to look like its sliding up and down vs dissapearing and reappearing at full width
  const onScrollEndDrag = () => {
    if (currentNavBarHeight > 40) {
      currentNavBarHeight = bottomTabNavigatorBaseHeight;
      dispatch(setBottomNavBarHeight(currentNavBarHeight));
    } else {
      currentNavBarHeight = 0;
      dispatch(setBottomNavBarHeight(currentNavBarHeight));
    }
  };

  const onMomentumScrollEnd = () => {
    isBottomTabNavListeningToScroll = true;
  };

  return (
    <ScrollView
      style={style}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={e => onScrollBeginDrag(e)}
      onScroll={e => onScroll(e)}
      onScrollEndDrag={() => onScrollEndDrag()}
      onMomentumScrollEnd={() => onMomentumScrollEnd()}
      ref={resumeScrollViewRef}
      scrollEnabled>
      {children}
    </ScrollView>
  );
};

export default HideBottomNavScrollView;
