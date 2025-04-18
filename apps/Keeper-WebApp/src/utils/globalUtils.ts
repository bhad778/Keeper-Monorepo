import { JobsService, MiscService, UsersService } from 'services';
import { TEmployeeEducation, TEmployeePastJob, TJob, TMatch } from 'keeperTypes';

export const numberWithCommas = (x: number | undefined): string | void => {
  if (x) {
    return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const extractGoodImageFromBrandFetchData = (brandFetchData: any) => {
  let goodImg = '';

  brandFetchData.logos.forEach((logoData: any) => {
    if (!goodImg) {
      logoData.formats.map((formatsData: any) => {
        if (
          formatsData.format === 'png' ||
          formatsData.format === 'jpeg' ||
          (formatsData.format === 'jpg' && formatsData.width >= 400)
        ) {
          goodImg = formatsData.src;
        }
      });
    }
  });

  return goodImg;
};

// if you want to dynamically get a nested objects property based on a variable string use this
export const getPropByString = (obj: any, propString: string) => {
  if (!propString) return obj;

  var prop,
    props = propString.split('.');

  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];

    var candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
};

export const checkTwoArraysEqual = (array1: string[] | number[], array2: string[] | number[]) => {
  return array1.sort().join(',') === array2.sort().join(',');
};

export const padToTime = (promise: Promise<any> | Promise<any>[], interval: number) => {
  // delay returns a promise that resolves after an interval
  const delay = (interval: number) => new Promise(resolve => setTimeout(resolve, interval));
  // caller can provide a singular or an array of promises, avoiding the extra .all
  const promises = Array.isArray(promise) ? promise : [promise];
  return Promise.all([...promises, delay(interval)]).then(results => results.slice(0, -1));
};

export const formatPhoneNumberInput = (value: any, previousValue?: any) => {
  if (!value) return value;
  const currentValue = value.replace(/[^\d]/g, '');
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) return currentValue;
    if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
  }
};

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

export const warmUpGetForSwiping = () => {
  JobsService.getJobsForSwiping({
    isPing: true,
  });
  UsersService.getEmployeesForSwiping({
    isPing: true,
  });
};

export const warmUpEmployeeSignUp = () => {
  UsersService.updateUserSettings({
    isPing: true,
  });
  MiscService.searchAndCollectCoreSignal({
    isPing: true,
  });
  UsersService.updateUserData({
    isPing: true,
  });
  UsersService.getEmployeeData({
    isPing: true,
  });
};

export const warmUpEmployerSignUp = () => {
  JobsService.addJob({
    isPing: true,
  });
  JobsService.getEmployersJobs({
    isPing: true,
  });
  UsersService.onSelectJob({
    isPing: true,
  });
  UsersService.getEmployerData({
    isPing: true,
  });
};

export const closeModalWithAlert = (closeModalAction: () => void) => {
  const confirmResponse = confirm(
    'Are you sure you want to back out? Press okay if you want to back out without saving.',
  );
  if (confirmResponse) {
    closeModalAction();
  }
};

export const toTitleCase = (str: string) => {
  if (str) {
    return str.replace(/\w\S*/g, (txt: string) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  } else {
    return '';
  }
};

export const extractReceiverIdFromChannelId = (channelId: string, senderId: string) => {
  // channelId is both sender and receiver id combined with a - so first remove loggedInUserId(senderId) from that string
  const receiverId = channelId.replace(senderId, '');

  // then remove the dash to get the receiverId
  return receiverId.replace('-', '');
};

export const convertBase64 = file => {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = error => {
      reject(error);
    };
  });
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

export const deepEqualCheck = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
  if (a === null || a === undefined || b === null || b === undefined) return false;
  if (a.prototype !== b.prototype) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => deepEqualCheck(a[k], b[k]));
};

// example- 03 becomes 2003
export const transformYearToString = (month: string) => {
  let monthValue = month;
  if (Number(monthValue) > 60) {
    monthValue = `19${monthValue}`;
  } else {
    monthValue = `20${monthValue}`;
  }
  return monthValue;
};

export const isPastJobComplete = (
  pastJob: TEmployeePastJob,
  hasCheckBeenPressed: boolean,
  hasUploadedResume?: boolean,
) => {
  if (!hasCheckBeenPressed && !hasUploadedResume) {
    return true;
  }

  // if theyve selected this job is present, then endate will be null, so dont count that when checking
  // if job is complated
  if (pastJob?.endDate === null) {
    return pastJob.startDate && !pastJob?.startDate.includes('00') && pastJob?.jobDescription && pastJob?.jobTitle;
  }

  return (
    pastJob.startDate &&
    !pastJob?.startDate.includes('00') &&
    pastJob.endDate &&
    !pastJob?.endDate.includes('00') &&
    pastJob?.jobDescription &&
    pastJob?.jobTitle
  );
};

export const isEducationHistoryItemComplete = (educationItem: TEmployeeEducation) => {
  return educationItem.endDate && educationItem.major && educationItem.school && educationItem.degree;
};

// example- the string 2019-03-27 transforms to March, 2019
export const transformDateToText = (textDate: string) => {
  if (!textDate) {
    return 'PRESENT';
  }
  const stringArray = textDate.split('/');

  return `${transformMonthToString(stringArray[0])}, ${transformYearToString(stringArray[1])}`;
};

export const isOdd = (num: number) => {
  return num % 2;
};

export const reorderObjectArrayByDate = (objectArray: any, dateKey: string, isDescending?: boolean) => {
  const objectArrayTemp = [...objectArray];
  return objectArrayTemp.sort((a: any, b: any) => {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    if (isDescending) {
      return new Date(a[dateKey]) - new Date(b[dateKey]);
    } else {
      return new Date(b[dateKey]) - new Date(a[dateKey]);
    }
  });
};

// we need to round odd numbers up, because if theres 3 then we need the height to be just as high
// as if there were 4, because odd numbers make the new row because we have rows of 2, so isOdd
// will return 1 if its odd, and 0 if its not
export const getMatchesContainerHeight = (jobsMatchesLength: number, isJobsBubble?: boolean) => {
  const jobsMatchesLengthRoundedUpToEven = jobsMatchesLength + isOdd(jobsMatchesLength);
  if (jobsMatchesLengthRoundedUpToEven === 0) {
    return 250;
  }
  return (jobsMatchesLengthRoundedUpToEven / 2) * 265 + (isJobsBubble ? 185 : 0);
};

export const getFirstNameAndInitialFromFullName = (fullName: string) => {
  const fullNameArray = fullName.split(' ');

  if (fullNameArray.length === 1) {
    return fullNameArray[0];
  } else {
    return `${fullNameArray[0]} ${fullNameArray[1].charAt(0)}.`;
  }
};

// pass an array of objects with a key, it will remove duplicate values of that key
export const filterArrayOfObjectsByKey = (arr: any, key: any) => {
  return arr.filter(
    (v, i, a) =>
      a.findIndex(v2 => {
        if (typeof v2 === 'object') {
          return v2[key].toLowerCase() === v[key].toLowerCase();
        }
      }) === i,
  );
};

export const convertBase64ToBlob = async (base64String: string) => {
  const r = await fetch(base64String);
  return await r.blob();
};

export const convertMilesToMeters = (miles: number) => {
  return Math.round(miles * 1609.344);
};

export const convertMetersToMiles = (meters: number) => {
  return Math.round(meters * 0.000621371192);
};

export const getGeoLocationFromAddress = async (address: string) => {
  const uriEncodedAddress = encodeURIComponent(address);
  const googleMapsApiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${uriEncodedAddress}&key=${googleMapsApiKey}`,
    );

    const data = await res.json();

    const coordinates = [data.results[0].geometry.location.lng, data.results[0].geometry.location.lat];

    return {
      type: 'Point',
      coordinates,
    };
  } catch (error) {
    console.error(error);
    return {
      type: 'Point',
      coordinates: [1, 2],
    };
  }
};

export const onShare = async (message: string) => {
  // try {
  //   const result = await Share.share({
  //     message,
  //   });
  //   if (result.action === Share.sharedAction) {
  //     if (result.activityType) {
  //       // shared with activity type of result.activityType
  //     } else {
  //       // shared
  //     }
  //   } else if (result.action === Share.dismissedAction) {
  //     // dismissed
  //   }
  // } catch (error: any) {
  //   Alert.alert(error.message);
  // }
};

export const removeDuplicateStringsFromArray = (stringArray: string[]) => {
  const uniq = stringArray.reduce((a, b) => {
    if (a.indexOf(b) < 0) a.push(b);
    return a;
  }, []);
  return uniq;
};

export const getMatchesFromEmployersJobs = (employersJobs: TJob[]) => {
  const matches: TMatch[] = [];
  if (employersJobs) {
    employersJobs.map((job: TJob) => {
      matches.push(...job.matches);
    });
  }
  return matches;
};
