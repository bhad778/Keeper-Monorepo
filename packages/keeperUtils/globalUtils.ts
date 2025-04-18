import * as countries from 'i18n-iso-countries';

import { TEmployeePastJob, TEmployeeSettings } from '../keeperTypes';

export const getLargestNumberFromArray = (numbersArray: number[] | string[]) => {
  let largest = numbersArray[0];

  for (let i = 1; i < numbersArray.length; i++) {
    if (numbersArray[i] > largest) {
      largest = numbersArray[i];
    }
  }

  return Number(largest);
};

export const getSmallestNumberFromArray = (numbersArray: number[] | string[]) => {
  let smallest = numbersArray[0];

  for (let i = 1; i < numbersArray.length; i++) {
    if (numbersArray[i] < smallest) {
      smallest = numbersArray[i];
    }
  }

  return Number(smallest);
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

// this takes in 02 and return 2002, 99 and returns 1999
export const getFullYearFrom2DigitYear = (lastTwoYearDigits: string) => {
  let firstTwoYearDigits = '';
  if (lastTwoYearDigits.charAt(0) > '6') {
    firstTwoYearDigits = '19';
  } else {
    firstTwoYearDigits = '20';
  }
  return firstTwoYearDigits + lastTwoYearDigits;
};

export const getYearsOfExperienceFromJobHistory = (jobHistory: TEmployeePastJob[]) => {
  const startYearArray: string[] = [];
  const endYearArray: any = [];
  jobHistory.forEach((pastJob: TEmployeePastJob) => {
    const fullStartYear = getFullYearFrom2DigitYear(pastJob.startDate.slice(-2));
    startYearArray.push(fullStartYear);

    if (pastJob.endDate === null) {
      endYearArray.push(new Date().getFullYear());
    } else {
      const fullEndYear = getFullYearFrom2DigitYear(pastJob.endDate.slice(-2));
      endYearArray.push(fullEndYear);
    }
  });

  const earliestStartYear = getSmallestNumberFromArray(startYearArray);
  const latestEndYear = getLargestNumberFromArray(endYearArray);

  const finalYearsOfExperience = latestEndYear - earliestStartYear;
  if (finalYearsOfExperience < 0 || typeof finalYearsOfExperience != 'number' || !finalYearsOfExperience) {
    return 0;
  }

  return latestEndYear - earliestStartYear;
};

// pass in one large string and an array of strings to return
// which strings in the array are contained in the large string
export const findContainedStrings = (largeString: string, arrayOfSmallStrings: string[]): string[] => {
  const lowerCaseLargeString = largeString.toLowerCase();

  // Filter substrings by checking if their lowercase version is included in the lowercase large string
  return arrayOfSmallStrings.filter(smallString => lowerCaseLargeString.includes(smallString.toLowerCase()));
};

export const shuffleArray = (array: any[]) => {
  const shuffledArray = [...array];

  let currentIndex = shuffledArray.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[currentIndex],
    ];
  }
  return shuffledArray;
};

export const transformMonthToString = (month: string) => {
  let monthValue = month;
  if (!monthValue) {
    monthValue = '';
  }
  switch (monthValue) {
    case '01':
      return 'January';
    case '02':
      return 'February';
    case '03':
      return 'March';
    case '04':
      return 'April';
    case '05':
      return 'May';
    case '06':
      return 'June';
    case '07':
      return 'July';
    case '08':
      return 'August';
    case '09':
      return 'September';
    case '10':
      return 'October';
    case '11':
      return 'November';
    case '12':
      return 'December';

    case 'January':
      return '01';
    case 'February':
      return '02';
    case 'March':
      return '03';
    case 'April':
      return '04';
    case 'May':
      return '05';
    case 'June':
      return '06';
    case 'July':
      return '07';
    case 'August':
      return '08';
    case 'September':
      return '09';
    case 'October':
      return '10';
    case 'November':
      return '11';
    case 'December':
      return '12';
    default:
      return 'Enter Date!';
  }
};

// const removeDuplicateStringsFromArray = (stringArray: string[]) => {
//   const uniq = stringArray.reduce(function (a: any, b: any) {
//     if (a.indexOf(b) < 0) a.push(b);
//     return a;
//   }, []);
//   return uniq;
// };

// export const getRelevantSkillsFromJobHistory = (jobHistory: TEmployeePastJob[]) => {
//   const totalRelevantSkills: string[] = [];
//   jobHistory.forEach((pastJob: TEmployeePastJob) => {
//     totalRelevantSkills.push(...pastJob.jobSkills);
//   });
//   return removeDuplicateStringsFromArray(totalRelevantSkills);
// };

export const convertMilesToMeters = (miles: number) => {
  return Math.round(miles * 1609.344);
};

export const checkIfProfileIsIncomplete = (settings: TEmployeeSettings) => {
  let isIncomplete = false;
  for (const [key, value] of Object.entries(settings)) {
    if (value === 0) {
      continue;
    }
    if (key === 'jobHistory' && settings.isSeekingFirstJob === true) {
      continue;
    }
    if (key === 'isSeekingFirstJob') {
      continue;
    }
    if (!value) {
      isIncomplete = true;
    }
  }
  return isIncomplete;
};
