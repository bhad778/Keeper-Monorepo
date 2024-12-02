import React, { memo, useCallback, useRef, useState } from 'react';

import { Image, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxStore';
import { AppBoldText, AppHeaderText, AppText, KeeperSelectButton } from 'components';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import EmployeeSlider1 from '../../assets/svgs/employeeSlider1.svg';
// import EmployeeSlider2 from '../../assets/svgs/employeeSlider2.svg';
import EmployeeSlider3 from '../../assets/svgs/employeeSlider3.svg';
import EmployeeSlider4 from '../../assets/svgs/employeeSlider4.svg';

import JobSlider2 from '../../assets/svgs/jobSlider2.svg';
import JobSlider3 from '../../assets/svgs/jobSlider3.svg';

import useStyles from './EducationSwiperStyles';

type TSlideData = {
  svg?: React.ReactNode;
  text: string;
};

const EducationSwiper = () => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const [currentIndex, setCurrentIndex] = useState(0);

  const styles = useStyles();
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const employeeSlidesData: TSlideData[] = [
    {
      svg: <EmployeeSlider1 style={styles.slideImage} />,
      text: 'After making a profile, a feed of jobs will be tailored just for your needs. The like and dislike buttons will be at the bottom after scrolling to the end.',
    },
    // {
    //   svg: <EmployeeSlider2 style={styles.slideImage} />,
    //   text: 'If you would like to see more than just a tailored list of jobs based on your experience, change your preferences.',
    // },
    {
      svg: <EmployeeSlider3 style={styles.slideImage} />,
      text: `Create your profile in order to be seen by employers. Upload your current resume to auto populate your profile or fill it out manually, it's up to you!`,
    },
    {
      svg: <EmployeeSlider4 style={styles.slideImage} />,
      text: `If you like a job and the employer likes you, it's a match! You will be able to connect directly with the employer to see if it is a good fit and set up a time to chat. `,
    },
    {
      text: `To get started, create your profile and get swiping! Or start by browsing some jobs first.`,
    },
  ];

  const employerSlidesData: TSlideData[] = [
    {
      svg: (
        <Image
          source={require('../../assets/images/jobSlider1.png')}
          style={{ height: 442, width: 202 }}
          // resizeMode='contain'
        />
      ),
      text: 'Keeper is your place to find quality tech talent tailored for you. Simply post a job, review tailored candidates, and like or dislike to view more.',
    },
    {
      svg: <JobSlider2 style={styles.slideImage} />,
      text: `Create a job in order to be seen by tech candidates. The information you include here will inform Keeper's algorithm to only show you qualified candidates. No more hassle!`,
    },
    {
      svg: <Image source={require('../../assets/images/jobSlider3.png')} style={{ height: 442, width: 202 }} />,
      text: `If you and a candidate both like each other, it's a match! You will be able to message each other to further discuss the opportunity`,
    },
    {
      text: `To get started, create a job and get swiping! Or start by browsing some of our highly qualified candidates first.`,
    },
  ];
  const isEmployee = accountType === 'employee';

  const slides = isEmployee ? employeeSlidesData : employerSlidesData;

  const isAtBeginning = currentIndex === 0;
  const isAtEnd = currentIndex === slides.length - 1;

  const Slide = useCallback(({ item }: any) => {
    return (
      <View style={styles.slideContainer} key={item.name}>
        {item.svg && (
          <>
            <View style={styles.slideTopSection}>{item.svg}</View>
            <View style={styles.slideBottomSection}>
              <AppHeaderText style={styles.bottomText}>{item.text}</AppHeaderText>
            </View>
          </>
        )}
        {!item.svg && (
          <>
            <View style={styles.fullSlide}>
              <AppBoldText style={styles.finalEmployerText}>{item.text}</AppBoldText>
              <KeeperSelectButton
                onPress={onSignUpClick}
                title={`Create ${isEmployee ? 'Your Profile' : 'A Job'}`}
                buttonStyles={styles.keepButton}
                isAppHeaderText
              />
              <KeeperSelectButton
                onPress={finishSwiper}
                title={isEmployee ? 'Browse Jobs' : 'Browse Candidates'}
                buttonStyles={styles.keepButton}
                isAppHeaderText
              />
            </View>
          </>
        )}
      </View>
    );
  }, []);

  // 011, 112

  const scrollProgrammatically = (indexDirection: 1 | -1) => {
    const pageNum = currentIndex + indexDirection;
    flatListRef.current?.scrollToIndex({ index: pageNum });
    setCurrentIndex(pageNum);
  };

  const finishSwiper = () => {
    navigation.navigate('Root', { screen: isEmployee ? 'Discover' : 'Job Board' });
  };

  const onMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  }, []);

  const onSignUpClick = useCallback(() => {
    if (isEmployee) {
      navigation.navigate('PhoneNumber');
    } else {
      navigation.navigate('Name');
    }
  }, [isEmployee, navigation]);

  const returnNextButton = () => {
    if (isAtEnd) {
      return <></>;
    }
    return (
      <>
        <AppBoldText style={styles.bottomText}>Next</AppBoldText>
        <Icon size={caretIconSize} name='chevron-right' style={styles.caretIcon} />
      </>
    );
  };

  const caretIconSize = 22;

  return (
    <View style={styles.educationSwiperContainer}>
      <FlatList
        ref={flatListRef}
        data={slides}
        pagingEnabled
        horizontal
        onMomentumScrollEnd={onMomentumScrollEnd}
        showsHorizontalScrollIndicator={false}
        renderItem={item => <Slide item={item.item} />}
      />

      <View style={styles.bottomButtonsSection}>
        <TouchableOpacity
          onPress={() => scrollProgrammatically(-1)}
          style={[styles.bottomButton, { height: isAtBeginning ? 0 : undefined }]}>
          <Icon size={caretIconSize} name='chevron-left' style={styles.caretIcon} />
          <AppBoldText style={styles.bottomText}>Prev.</AppBoldText>
        </TouchableOpacity>
        <AppHeaderText style={styles.bottomNumbers}>{`0${currentIndex + 1} / 0${slides.length}`}</AppHeaderText>
        <TouchableOpacity
          onPress={isAtEnd ? finishSwiper : () => scrollProgrammatically(1)}
          disabled={isAtEnd && !isEmployee}
          style={styles.bottomButton}>
          {returnNextButton()}
        </TouchableOpacity>

        {/* {isAtEnd && !isEmployee && (
          <TouchableOpacity
            onPress={navigateToSignUp}
            style={[styles.bottomButton, { position: 'absolute', right: 10, bottom: 40, width: undefined }]}>
            <AppBoldText style={styles.bottomText}>Sign up, Make Job, and Start Swiping</AppBoldText>
            <Icon size={caretIconSize} name='chevron-right' style={styles.caretIcon} />
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );
};

export default memo(EducationSwiper);
