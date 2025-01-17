import { AxiosError } from 'axios';
import { stateAbbreviations } from 'keeperConstants';

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

export const escapeRegex = (text: string) => {
  return text.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
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
