import AWS from 'aws-sdk';
import axios, { AxiosError } from 'axios';
import { stateAbbreviations } from 'keeperConstants';
import { CompaniesService } from 'keeperServices';

const sqs = new AWS.SQS();

export const checkIfCompanyExistsInDatabase = async (sourceWebsiteUrl: string) => {
  try {
    const queryPayload = {
      query: { sourceWebsiteUrl },
    };

    const company = await CompaniesService.findCompany(queryPayload);
    return !!company; // Returns true if the company exists, false otherwise
  } catch (error) {
    logApiError('checkIfCompanyExistsInDatabase', { sourceWebsiteUrl }, error);
    throw error; // Let the caller handle the error
  }
};

export const sendMessageToQueue = async (queueUrl: string, messageBody: any, delaySeconds?: number) => {
  try {
    await sqs
      .sendMessage({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(messageBody),
        DelaySeconds: delaySeconds, // Delay before the message is visible in the queue
      })
      .promise();
    console.info(`Message queued with delay of ${delaySeconds || 'zero'} seconds:`, messageBody);
  } catch (error) {
    console.error(`Error queuing message to queue ${queueUrl}:`, error);
    logApiError('sendMessageToQueue', { queueUrl, messageBody }, error);
    throw error; // Let the caller handle the error
  }
};

export const requestWithRetry = async (requestFunction, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFunction();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt)); // Exponential backoff
      } else {
        throw error; // Let the caller handle the error after max retries
      }
    }
  }
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

export const getGeoLocationFromAddress = async (address, googleMapsApiKey) => {
  const uriEncodedAddress = encodeURIComponent(address);

  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${uriEncodedAddress}&key=${googleMapsApiKey}`,
    );

    const data = res.data;

    if (data.status !== 'OK' || data.results.length === 0) {
      console.error(`Geocoding API returned no results for address: ${address}`);
      return null;
    }

    const location = data.results[0].geometry.location;

    if (!location.lat || !location.lng) {
      console.error(
        `Geolocation data is missing latitude or longitude for address: ${address}. Location data: ${JSON.stringify(
          location,
        )}`,
      );
      return null;
    }

    const coordinates = [location.lng, location.lat]; // [longitude, latitude]

    return {
      type: 'Point',
      coordinates,
    };
  } catch (error) {
    console.error(`Error fetching geolocation for address: ${address}`, error);
    return null;
  }
};

export const normalizeCompanyName = (name: string) => {
  if (!name) return null;

  // Trim leading and trailing spaces
  let normalizedName = name.trim();

  // Remove text within parentheses and the parentheses themselves
  normalizedName = normalizedName.replace(/\s*\(.*?\)\s*/g, '').trim();

  // Remove trailing punctuation and common company suffixes
  const suffixesToRemove = [
    ', inc',
    'inc',
    'inc.',
    ', llc',
    'llc',
    ', ltd',
    'ltd',
    'ltd.',
    ', corp',
    'corp',
    'corp.',
    ', co',
    'co',
    'co.',
    ', incorporated',
    'incorporated',
  ];
  const suffixRegex = new RegExp(`\\b(${suffixesToRemove.join('|')})\\b[.,\\s]*$`, 'i');
  normalizedName = normalizedName.replace(suffixRegex, '').trim();

  // Remove any trailing punctuation left over
  normalizedName = normalizedName.replace(/[,.\s]+$/, '');

  // Check for acronyms or short names (less than 4 characters)
  if (normalizedName.length < 4) {
    return normalizedName.toUpperCase();
  }

  // Capitalize words, except for conjunctions/prepositions/articles unless they are the first word
  const lowerCaseExceptions = ['and', 'or', 'of', 'the', 'a', 'an', 'in', 'at', 'by', 'for', 'on', 'to', 'with', 'as'];
  normalizedName = normalizedName.replace(/\b\w+\b/g, (word, index) => {
    if (index === 0 || !lowerCaseExceptions.includes(word.toLowerCase())) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      return word.toLowerCase();
    }
  });

  return normalizedName;
};

export const normalizeUrl = (url: string, removeQueryParams = false) => {
  if (!url) return null;

  try {
    // Ensure the URL has a protocol
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

    // Parse the URL
    const parsedUrl = new URL(formattedUrl);

    // Get the hostname and remove 'www.' prefix if present
    const host = parsedUrl.host.replace(/^www\./, '');

    // If removeQueryParams is true, return the base URL without path, query params, or fragments
    if (removeQueryParams) {
      return `https://www.${host}`;
    }

    // Build the base normalized URL including the pathname
    let normalizedUrl = `https://www.${host}${parsedUrl.pathname}`.replace(/\/$/, ''); // Remove trailing slash

    // Append query parameters and fragments if removeQueryParams is false
    if (!removeQueryParams) {
      if (parsedUrl.search) {
        normalizedUrl += parsedUrl.search; // Add query parameters
      }
      if (parsedUrl.hash) {
        normalizedUrl += parsedUrl.hash; // Add fragments
      }
    }

    return normalizedUrl;
  } catch (error) {
    console.error(`Error normalizing URL: ${url}`, error);
    return null; // Return null if URL parsing fails
  }
};

export const logApiError = (apiCallName: string, params: Record<string, any>, error: unknown): void => {
  const paramsString = Object.entries(params)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(', ');

  if (axios.isAxiosError(error) && error.request) {
    const status = error.response?.status ?? 'unknown';
    const data = error.response?.data ?? 'no data';

    console.error(
      `Error during API call "${apiCallName}" with parameters: { ${paramsString} }. Status: ${status}, Error Message: ${JSON.stringify(
        data,
      )}`,
    );
  } else {
    console.error(`Error during API call "${apiCallName}" with parameters: { ${paramsString} }. General error:`, error);
  }
};

export const normalizeLocation = (rawLocation: string): string | null => {
  if (!rawLocation) return null;

  try {
    // List of state abbreviations and full names

    const stateNames = Object.keys(stateAbbreviations).join('|'); // Full state names
    const stateAbbr = Object.values(stateAbbreviations).join('|'); // State abbreviations

    // Dynamic regex to match city and state
    const stateRegex = new RegExp(`([\\w\\s]+),\\s*(${stateAbbr}|${stateNames})`, 'i');

    // Match the input with the regex
    const match = rawLocation.match(stateRegex);

    if (match) {
      const city = match[1].trim(); // The part before the comma
      const stateOrFullName = match[2].trim(); // The matched state

      // Convert full state name to abbreviation, if applicable
      const state = stateAbbreviations[stateOrFullName] || stateOrFullName;

      // Return normalized location
      return `${city}, ${state}`;
    }

    console.warn(`Could not normalize location: ${rawLocation}`);
    return null;
  } catch (error) {
    console.error(`Error normalizing location: ${rawLocation}`, error);
    return null; // Return null on failure
  }
};

export const normalizeTitle = (text: string) => {
  if (!text) return null;

  // List of words not to capitalize unless they are the first word
  const exceptions = new Set([
    'a',
    'an',
    'and',
    'at',
    'but',
    'by',
    'for',
    'in',
    'nor',
    'of',
    'on',
    'or',
    'so',
    'the',
    'to',
    'up',
    'yet',
  ]);

  // Split the text into words
  const words = text.split(/\s+/);

  // Normalize each word
  const normalizedWords = words.map((word, index) => {
    const lowerCasedWord = word.toLowerCase();
    if (index === 0 || !exceptions.has(lowerCasedWord)) {
      // Capitalize the first letter if it's the first word or not in the exceptions list
      return word.charAt(0).toUpperCase() + lowerCasedWord.slice(1);
    }
    // Otherwise, keep it lowercase
    return lowerCasedWord;
  });

  // Join the words back together
  return normalizedWords.join(' ');
};

// returns strings in the array of strings (first param) that are in the longer string (second param)
export const findStringsInLongString = (strings: string[], longString: string): string[] => {
  return strings.filter(str => longString.toLowerCase().includes(str.toLowerCase()));
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const escapeRegex = (text: string) => {
  return text.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
};

export const convertMilesToMeters = (miles: number) => {
  return Math.round(miles * 1609.344);
};

// pass in a string and it will return an array of each string within that string that began with a $
// argument example- $30.52 - $40.69 an hour
// output example- [30.52, 40.69]
export const extractDollarNumbers = (inputString: string): number[] => {
  // Regular expression to match words starting with $
  const dollarStrings = inputString.match(/\$\d+/g);

  // Convert the matched strings to numbers after removing the $
  const dollarNumbers = dollarStrings?.map(str => Number(str.replace('$', ''))) || [];

  return dollarNumbers;
};

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Check if the error response has data or statusText
    if (error.response?.data) {
      return typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
    }
    if (error.response?.statusText) {
      return error.response.statusText;
    }
    return 'An Axios error occurred without response data.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};
