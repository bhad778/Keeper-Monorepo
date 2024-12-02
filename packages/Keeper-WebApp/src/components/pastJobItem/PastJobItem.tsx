import { AppText, SubHeaderLarge } from 'components';
import { useCallback, useEffect, useState } from 'react';
import { TEmployeePastJob } from 'types';
import { Clickable } from 'components';
import { isPastJobComplete } from 'utils';

import { useStyles } from './PastJobItemStyles';

type PastJobItemType = {
  job: TEmployeePastJob;
  jobHistoryLength: number;
  index: number;
  hasCheckBeenPressed?: boolean;
  isSmallScreen?: boolean;
  onClick?: any;
  isWhite: boolean;
  isEditProfileScreen?: boolean;
  shouldTextBeWhite?: boolean;
  hasUploadedResume?: boolean;
  isJobHistoryScreen?: boolean;
};

const PastJobItem = ({
  onClick,
  job,
  jobHistoryLength,
  index,
  hasCheckBeenPressed,
  isWhite,
  isEditProfileScreen,
  shouldTextBeWhite,
  hasUploadedResume,
  isSmallScreen,
  isJobHistoryScreen,
}: PastJobItemType) => {
  const [activeAccordions, setActiveAccordions] = useState<any>([]);

  const isComplete = !isJobHistoryScreen || isPastJobComplete(job, !!hasCheckBeenPressed, hasUploadedResume);

  const styles = useStyles(isWhite, !!isSmallScreen, jobHistoryLength, !!shouldTextBeWhite, index, !!isComplete);

  useEffect(() => {
    setActiveAccordions([]);
  }, [job]);

  const onAccordionClick = useCallback(
    (i: number) => {
      // if already been clicked, remove from array else, add it in
      if (activeAccordions.includes(i)) {
        const index = activeAccordions.indexOf(i);
        if (index > -1) {
          const activeAccordionsCopy = activeAccordions;
          activeAccordionsCopy.splice(index, 1);
          setActiveAccordions([...activeAccordionsCopy]);
        }
      } else {
        setActiveAccordions([...activeAccordions, i]);
      }
    },
    [activeAccordions]
  );
  // const returnIcon = () => {
  //   // isObjectFieldCompleted
  //   return activeAccordions?.includes(index) ? (
  //     <Arrow style={styles.arrow} />
  //   ) : isWhite ? (
  //     isComplete ? (
  //       <ArrowRightWhite style={styles.arrow} />
  //     ) : (
  //       <ArrowRightRed style={styles.forwardIcon} />
  //     )
  //   ) : (
  //     <ArrowDownRight style={styles.arrow} />
  //   );
  // };

  // not sure why this function was made leaving it commented, doing nothing for now as tech debt
  function formatDateRange(input: string) {
    if (input === null) {
      return 'Present';
    } else {
      return input;
    }
  }

  const ArrowDownRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.18 40.18">
      <polygon
        fill="#ffffff"
        points="35.18 8.67 35.18 31.64 3.54 0 0 3.54 31.64 35.18 8.67 35.18 8.67 40.18 40.18 40.18 40.18 8.67 35.18 8.67"
      />
    </svg>
  );
  const ArrowUpRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.18 40.18" transform="scale(1,-1)">
      <polygon
        fill="#ffffff"
        points="35.18 8.67 35.18 31.64 3.54 0 0 3.54 31.64 35.18 8.67 35.18 8.67 40.18 40.18 40.18 40.18 8.67 35.18 8.67"
      />
    </svg>
  );

  const JobNumber = ({ number }) => {
    const svgs = Array.from({ length: number }, (_, index) => (
      <text
        key={index + 1}
        x="30%"
        y="65%"
        fontSize="20"
        fontWeight="bold"
        fill={'white'}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {String(index + 1).padStart(2, '0')}
      </text>
    ));

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        {svgs[index]}
      </svg>
    );
  };

  return (
    <Clickable
      key={index}
      onClick={() => {
        onClick ? onClick(index) : onAccordionClick(index);
      }}
    >
      <div style={styles.jobDetailsSection}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            paddingTop: 12,
            paddingBottom: 10,
          }}
        >
          <div style={styles.jobNumberContainer}>
            <AppText style={styles.jobNumber}>
              <JobNumber number={jobHistoryLength} />
            </AppText>
          </div>
          <div style={styles.jobTitleContainerStyles}>
            <SubHeaderLarge
              text={job?.jobTitle}
              textInputLabelStyle={styles.jobTitleText}
              containerStyles={styles.subHeaderContainerStyles}
            />
            <AppText style={styles.jobMonthsText}>
              {formatDateRange(job?.startDate) + ' - ' + formatDateRange(job?.endDate)}
            </AppText>
          </div>

          <div>
            <AppText style={styles.forwardIcon}>
              {activeAccordions.includes(index) || isEditProfileScreen ? <ArrowUpRight /> : <ArrowDownRight />}
            </AppText>
          </div>
        </div>

        <div style={{ width: '100%' }}>
          <SubHeaderLarge
            text={job?.company}
            textInputLabelStyle={activeAccordions.includes(index) ? styles.companyName : styles.hidden}
          />

          <AppText style={activeAccordions.includes(index) ? styles.jobDetailsOpened : styles.hidden}>
            {job?.jobDescription}
          </AppText>
        </div>
      </div>
    </Clickable>
  );
};
export default PastJobItem;
