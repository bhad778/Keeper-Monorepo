import * as React from 'react';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import { Button, AppHeaderText } from 'components';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { useNavigate } from 'react-router-dom';

import useStyles from './SwiperStyles';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';

type TSlideData = {
  svg?: string;
  text: string;
};

type SwiperProps = {
  slides: TSlideData[];
};

const Swiper = ({ slides }: SwiperProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const [activeStep, setActiveStep] = React.useState(0);

  const styles = useStyles();
  const navigate = useNavigate();

  const isEmployee = accountType === 'employee';
  const maxSteps = slides.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const onCreateProfileClick = () => {
    navigate('/phoneNumber');
  };

  const onBrowseClick = () => {
    navigate('/browse/discover');
  };

  return (
    <Box sx={styles.swiperContainer}>
      <SwipeableViews axis="x" index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
        {slides.map((slide, index) => (
          <div key={slide.text}>
            {Math.abs(activeStep - index) <= 2 ? (
              <>
                {slide.svg ? (
                  <div style={styles.imgContainer}>
                    <Box component="img" sx={styles.img} src={slide.svg} />
                    <AppHeaderText style={styles.slideText}>{slide.text}</AppHeaderText>
                  </div>
                ) : (
                  <div style={styles.finalButtonsContainer}>
                    <AppHeaderText style={styles.slideText}>{slide.text}</AppHeaderText>
                    <Button
                      text="Create Your Profile"
                      buttonStyles={styles.finishButtons}
                      onClick={onCreateProfileClick}
                    />
                    <Button
                      text={isEmployee ? 'Browse Jobs' : 'Browse Candidates'}
                      buttonStyles={styles.finishButtons}
                      onClick={onBrowseClick}
                    />
                  </div>
                )}
              </>
            ) : null}
          </div>
        ))}
      </SwipeableViews>

      <MobileStepper
        style={styles.mobileStepper}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            onClick={handleNext}
            style={{
              visibility: activeStep === maxSteps - 1 ? 'hidden' : '',
              backgroundColor: 'white',
            }}
            text="Next"
          >
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button
            onClick={handleBack}
            style={{
              visibility: activeStep === 0 ? 'hidden' : '',
              backgroundColor: 'white',
            }}
            text="Back"
          >
            <KeyboardArrowLeft />
          </Button>
        }
      />
    </Box>
  );
};

export default Swiper;
