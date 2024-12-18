import axios from 'axios';
import Company, { TCompany } from '../models/Company';
import {
  BrightDataSeniorityEnum,
  JobSourceWebsiteEnum,
  TBrightDataGlassdoorCompany,
  TBrightDataIndeedCompany,
  TBrightDataIndeedJob,
  TBrightDataLinkedInCompany,
  TBrightDataLinkedInJob,
} from '../types/brightDataTypes';
import { TCompensationRange, TJob, TJobCompensation } from '../types/employerTypes';
import { EmploymentTypeEnum } from '../types/globalTypes';
import { extractDollarNumbers, findStringsInLongString, normalizeLocation, normalizeUrl } from './globalUtils';
import AWS from '../../../awsConfig';
import { TechnologiesList } from './coreSignalUtils';

const sqs = new AWS.SQS();

const brightDataApiKey = process.env.BRIGHTDATA_API_KEY;

export const requeueTimeout = 600; // 10 minutes

const linkedInRequiredYearsOfExperienceTransformer = (
  job_seniority_level: TBrightDataLinkedInJob['job_seniority_level'],
): number => {
  switch (job_seniority_level) {
    case BrightDataSeniorityEnum.NotApplicable:
      return 3;
    case BrightDataSeniorityEnum.Internship:
      return 0;
    case BrightDataSeniorityEnum.EntryLevel:
      return 1;
    case BrightDataSeniorityEnum.Associate:
      return 2;
    case BrightDataSeniorityEnum.MidSeniorLevel:
      return 6;
    case BrightDataSeniorityEnum.Director:
      return 9;
    default:
      return 0;
  }
};

const brightDataRequiredSkillsTransformer = (job_summary: string): string[] => {
  let foundSkills: string[] = findStringsInLongString(TechnologiesList, job_summary);
  if (foundSkills && foundSkills.length > 0) {
    return foundSkills;
  } else {
    const foundFrontendString = findStringsInLongString(['frontend', 'front end', 'front-end'], job_summary);
    if (foundFrontendString && foundFrontendString.length > 0) {
      foundSkills.push('Javascript', 'Typescript', 'HTML', 'CSS', 'React');
    }
    const foundBackendString = findStringsInLongString(['backend', 'back end', 'back-end'], job_summary);
    if (foundBackendString && foundBackendString.length > 0) {
      foundSkills.push('Java', '.NET', 'Node', 'Sql', 'Mongodb', 'Python');
    }
  }
  return findStringsInLongString(TechnologiesList, job_summary);
};

const indeedRequiredYearsOfExperienceTransformer = (job_seniority_level: TBrightDataIndeedJob['job_title']): number => {
  const seniorKeyWords = ['senior', 'director', 'III', '3', 'sr ', 'staff', 'principal', 'lead'];
  // const midKeyWords = ['II', '2', 'experienced'];
  const juniorKeyWords = ['associate', 'intern', 'I', '1', 'junior', 'entry'];

  if (findStringsInLongString(seniorKeyWords, job_seniority_level)?.length > 0) {
    return 7;
  } else if (findStringsInLongString(juniorKeyWords, job_seniority_level)?.length > 0) {
    return 0;
  } else {
    return 4;
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

export const transformGlassdoorUrlToReviews = url => {
  if (!url || typeof url !== 'string') return null;

  try {
    // Ensure it's a valid URL
    const parsedUrl = new URL(url);

    // Ensure it's a Glassdoor URL
    if (!parsedUrl.hostname.includes('glassdoor.com')) {
      console.error('URL is not a valid Glassdoor URL:', url);
      return null;
    }

    // Match the URL against the Glassdoor Overview pattern
    const regex = /\/Overview\/Working-at-([^/]+)-EI_IE(\d+)\./;
    const match = parsedUrl.pathname.match(regex);

    if (!match) {
      console.error('URL does not match the Glassdoor Overview pattern:', url);
      return null;
    }

    // Extract company name and identifier
    const companyName = match[1];
    const identifier = match[2];

    // Construct the Reviews URL
    return `https://www.glassdoor.com/Reviews/${companyName}-Reviews-${identifier}.htm`;
  } catch (error) {
    console.error('Error transforming Glassdoor URL:', url, error);
    return null;
  }
};

// typical format is this- "$150,000.00/yr - $200,000.00/yr"
const transformBrightDataSalaryRange = (salaryRange: string): TCompensationRange => {
  // Use a regular expression to extract the numeric values
  const salaryRegex = /\$([\d,]+\.\d{2})/g;

  // Extract matches from the string
  const matches = [...salaryRange.matchAll(salaryRegex)];

  // If we don't find two matches, return an error or handle accordingly
  if (matches.length !== 2) {
    console.error('Invalid salary range format');
    return {
      min: 0,
      max: 0,
    };
  }

  // Convert the matched strings to numbers
  const min = parseFloat(matches[0][1].replace(/,/g, ''));
  const max = parseFloat(matches[1][1].replace(/,/g, ''));

  return { min, max };
};

const removeQueryParams = (url: string) => {
  return url?.replace(/\?.*$/, '');
};

// typical format is this- "$150,000.00/yr - $200,000.00/yr"
export const linkedInSalaryTransformer = (
  job_base_pay_range: TBrightDataLinkedInJob['job_base_pay_range'],
): TJobCompensation | undefined => {
  let compensationType: EmploymentTypeEnum = EmploymentTypeEnum.Salary;

  if (job_base_pay_range && findStringsInLongString(['/hr'], job_base_pay_range)?.length > 0) {
    compensationType = EmploymentTypeEnum.Contract;
  }
  if (job_base_pay_range && job_base_pay_range?.split(' ').length === 3) {
    return {
      type: compensationType,
      payRange: transformBrightDataSalaryRange(job_base_pay_range),
    };
  } else {
    return undefined;
  }
};

// null, $30.52 - $40.69 an hour, $33,540 - $54,455 a year, From $55,000 a year, $26.13 an hour
export const indeedSalaryTransformer = (
  salary_formatted: TBrightDataIndeedJob['salary_formatted'],
): TJobCompensation | null => {
  if (salary_formatted) {
    let compensationType: EmploymentTypeEnum = EmploymentTypeEnum.Salary;

    if (findStringsInLongString(['hour'], salary_formatted)?.length > 0) {
      compensationType = EmploymentTypeEnum.Contract;
    }

    const dollarStringsArray = extractDollarNumbers(salary_formatted);

    if (dollarStringsArray.length === 2) {
      return {
        type: compensationType,
        payRange: {
          min: dollarStringsArray[0],
          max: dollarStringsArray[1],
        },
      };
    } else if (dollarStringsArray.length === 1) {
      if (compensationType === EmploymentTypeEnum.Contract) {
        const minSalaryRange = dollarStringsArray[0] - 20;
        const maxSalaryRange = dollarStringsArray[0] + 20;

        return {
          type: compensationType,
          payRange: {
            min: minSalaryRange,
            max: maxSalaryRange,
          },
        };
      } else {
        const minSalaryRange = dollarStringsArray[0] - 10000;
        const maxSalaryRange = dollarStringsArray[0] + 10000;

        return {
          type: compensationType,
          payRange: {
            min: minSalaryRange,
            max: maxSalaryRange,
          },
        };
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const linkedInJobTransformer = (brightDataJob: TBrightDataLinkedInJob): TJob => {
  const transformedJob: TJob = {
    expoPushToken: null as unknown as string,
    createdAt: new Date(),
    receivedLikes: [],
    matches: [],
    geoLocation: undefined,
    hasGottenToEditProfileScreen: false,
    hasReceivedLikeNotification: false,
    requiredYearsOfExperience: linkedInRequiredYearsOfExperienceTransformer(brightDataJob.job_seniority_level),
    relevantSkills: brightDataRequiredSkillsTransformer(brightDataJob.job_summary),
    compensation: linkedInSalaryTransformer(brightDataJob.job_base_pay_range) || null,
    sourceWebsite: JobSourceWebsiteEnum.LinkedIn,

    sourceWebsiteApplicationUrl: brightDataJob.url,
    jobTitle: brightDataJob.job_title,
    companyName: brightDataJob.company_name,
    companyLogo: brightDataJob.company_logo,
    jobLocation: brightDataJob.job_location,
    jobSummary: brightDataJob.job_summary,
    jobEmploymentType: brightDataJob.job_employment_type,
    sourceWebsiteCompanyUrl: brightDataJob.company_url
      ? removeQueryParams(brightDataJob.company_url)
      : (null as unknown as string),
    jobPostedDate: brightDataJob.job_posted_date || '',
    applyLink: brightDataJob.apply_link,
  };

  return transformedJob;
};

export const brightDataLinkedInCompanyTransformer = (company: TBrightDataLinkedInCompany) => {
  const transformedJob: TCompany = {
    createdAt: new Date(),
    companyWebsiteUrl: normalizeUrl(company.website),
    companyName: normalizeCompanyName(company.name),
    description: company.description,
    headquarters: normalizeLocation(company.headquarters),
    logo: company.logo,
    sourceWebsite: JobSourceWebsiteEnum.LinkedIn,
    sourceWebsiteUrl: normalizeUrl(company.url),
    countryCode: company.country_code,
    companySize: company.company_size,
    industry: company.industries,
    indeedId: null as unknown as string,
    linkedInId: company.company_id,
    lastSourceWebsiteUpdate: new Date(),
    lastGlassDoorUpdate: null as unknown as Date,
    reviews: [],
    benefitsUrl: null as unknown as string,
    overviewUrl: null as unknown as string,
    about: null as unknown as string,
    bannerImage: null as unknown as string,
    salariesCount: null as unknown as number,
    salariesUrl: null as unknown as string,
    reviewsCount: null as unknown as number,
    reviewsUrl: null as unknown as string,
    interviewsCount: null as unknown as number,
    interviewsUrl: null as unknown as string,
    photosCount: null as unknown as number,
    photosUrl: null as unknown as string,
    jobsCount: null as unknown as number,
    jobsUrl: null as unknown as string,
    revenue: null as unknown as string,
    locations: [],
    companyType: null as unknown as string,
    diversityScore: null as unknown as string,
    glassdoorUrl: null as unknown as string,
    interviewDifficulty: null as unknown as string,
    rating: null as unknown as number,
    careerOpportunitiesRating: null as unknown as number,
    ceoApprovalRating: null as unknown as number,
    compensationBenefitsRating: null as unknown as number,
    cultureValuesRating: null as unknown as number,
    seniorManagementRating: null as unknown as number,
    workLifeBalanceRating: null as unknown as number,
    businessOutlookRating: null as unknown as number,
    recommendToFriendRating: null as unknown as number,
  };

  return transformedJob;
};

export const indeedJobTransformer = (brightDataIndeedJob: TBrightDataIndeedJob): TJob => {
  const transformedJob: TJob = {
    expoPushToken: undefined,
    createdAt: new Date(),
    receivedLikes: [],
    matches: [],
    geoLocation: undefined,
    hasGottenToEditProfileScreen: false,
    hasReceivedLikeNotification: false,
    requiredYearsOfExperience: indeedRequiredYearsOfExperienceTransformer(brightDataIndeedJob.job_title),
    relevantSkills: brightDataRequiredSkillsTransformer(brightDataIndeedJob.description_text),
    compensation: linkedInSalaryTransformer(brightDataIndeedJob.salary_formatted) || null,
    sourceWebsite: JobSourceWebsiteEnum.Indeed,

    sourceWebsiteApplicationUrl: brightDataIndeedJob.url,
    jobTitle: brightDataIndeedJob.job_title,
    companyName: brightDataIndeedJob.company_name,
    companyLogo: null,
    jobLocation: brightDataIndeedJob.location,
    jobSummary: brightDataIndeedJob.description_text,
    jobEmploymentType: brightDataIndeedJob.job_type,
    sourceWebsiteCompanyUrl: brightDataIndeedJob.company_link
      ? removeQueryParams(brightDataIndeedJob.company_link)
      : (null as unknown as string),
    jobPostedDate: brightDataIndeedJob.date_posted || '',
    applyLink: brightDataIndeedJob.apply_link,
  };

  return transformedJob;
};

export const brightDataIndeedCompanyTransformer = (company: TBrightDataIndeedCompany) => {
  const transformedCompany: TCompany = {
    createdAt: new Date(),
    companyWebsiteUrl: normalizeUrl(company.website),
    companyName: normalizeCompanyName(company.name),
    description: company.description,
    headquarters: normalizeLocation(company.headquarters),
    logo: company.logo,
    sourceWebsite: JobSourceWebsiteEnum.Indeed,
    sourceWebsiteUrl: normalizeUrl(company.url),
    countryCode: company.country_code,
    companySize: company.company_size,
    industry: company.industry,
    indeedId: company.company_id,
    linkedInId: null as unknown as string,
    lastSourceWebsiteUpdate: new Date(),
    lastGlassDoorUpdate: null as unknown as Date,
    reviews: [],
    benefitsUrl: null as unknown as string,
    overviewUrl: null as unknown as string,
    about: null as unknown as string,
    bannerImage: null as unknown as string,
    salariesCount: company.salaries_count,
    salariesUrl: company.salaries_url,
    reviewsCount: company.reviews_count,
    reviewsUrl: company.reviews_url,
    interviewsCount: company.interviews_count,
    interviewsUrl: company.interviews_url,
    photosCount: company.photos_count,
    photosUrl: company.photos_url,
    jobsCount: company.jobs_count,
    jobsUrl: company.jobs_url,
    revenue: company.revenue,
    locations: [],
    companyType: null as unknown as string,
    diversityScore: null as unknown as string,
    glassdoorUrl: null as unknown as string,
    interviewDifficulty: null as unknown as string,
    rating: null as unknown as number,
    careerOpportunitiesRating: null as unknown as number,
    ceoApprovalRating: null as unknown as number,
    compensationBenefitsRating: null as unknown as number,
    cultureValuesRating: null as unknown as number,
    seniorManagementRating: null as unknown as number,
    workLifeBalanceRating: null as unknown as number,
    businessOutlookRating: null as unknown as number,
    recommendToFriendRating: null as unknown as number,
  };

  return transformedCompany;
};

export const brightDataGlassdoorCompanyTransformer = (company: TBrightDataGlassdoorCompany) => {
  const transformedCompany: Partial<TCompany> = {
    companyWebsiteUrl: normalizeUrl(company.details_website),
    headquarters: normalizeLocation(company.details_headquarters),
    sourceWebsiteUrl: normalizeUrl(company.url),
    countryCode: company.country_code,
    companySize: company.details_size,
    industry: company.details_industry,
    lastGlassDoorUpdate: new Date(),
    benefitsUrl: company.benefits_url,
    reviewsCount: company.reviews_count,
    reviewsUrl: company.url_reviews,
    interviewsCount: company.interviews_count,
    jobsUrl: company.url_jobs,
    revenue: company.details_revenue,
    companyType: company.company_type,
    diversityScore: company.diversity_inclusion_score,
    glassdoorUrl: company.url,
    interviewDifficulty: company.interview_difficulty,
    rating: company.ratings_overall,
    careerOpportunitiesRating: company.ratings_career_opportunities,
    ceoApprovalRating: company.ratings_ceo_approval,
    compensationBenefitsRating: company.ratings_compensation_benefits,
    cultureValuesRating: company.ratings_culture_values,
    seniorManagementRating: company.ratings_senior_management,
    workLifeBalanceRating: company.ratings_work_life_balance,
    businessOutlookRating: company.ratings_business_outlook,
    recommendToFriendRating: company.ratings_recommend_to_friend,
  };

  return transformedCompany;
};

export const checkSnapshotStatusById = async snapshotId => {
  try {
    const response = await axios.get(`https://api.brightdata.com/datasets/v3/progress/${snapshotId}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${brightDataApiKey}`,
      },
    });
    return response?.data?.status; // 'ready' 'running' or 'building' are the known possible statuses
  } catch (error) {
    console.error(`Error checking status for snapshotId ${snapshotId}:`, error);
    throw error; // Let the caller handle the error
  }
};

export const fetchSnapshotArrayDataById = async snapshotId => {
  try {
    const response = await axios.get(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${brightDataApiKey}`,
      },
    });
    return response.data; // The actual job data from BrightData
  } catch (error) {
    console.error(`Error fetching data for snapshotId ${snapshotId}:`, error);
    throw error; // Let the caller handle the error
  }
};

export const checkIfCompanyExistsInDatabase = async (sourceWebsiteUrl: string) => {
  try {
    const company = await Company.findOne({ sourceWebsiteUrl: sourceWebsiteUrl });
    return !!company; // Returns true if the company exists, false otherwise
  } catch (error) {
    console.error(`Error checking company ${sourceWebsiteUrl} in database:`, error);
    throw error; // Let the caller handle the error
  }
};

export const requestSnapshotByUrlAndFilters = async (url, filters) => {
  try {
    const response = await axios.post(url, filters, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${brightDataApiKey}`,
      },
    });
    return response?.data?.snapshot_id; // Returns the new snapshotId
  } catch (error) {
    console.error(
      `Error requesting snapshot for with this ${url} and these filters- ${JSON.stringify(filters)}`,
      error,
    );
    throw error; // Let the caller handle the error
  }
};

export const sendMessageToQueue = async (queueUrl, messageBody) => {
  try {
    await sqs
      .sendMessage({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(messageBody),
      })
      .promise();
    console.log(`Message sent to queue: ${queueUrl}`, messageBody);
  } catch (error) {
    console.error(`Error sending message to queue ${queueUrl}:`, error);
    throw error; // Let the caller handle the error
  }
};

export const requeueMessage = async (queueUrl, messageBody, delaySeconds) => {
  try {
    await sqs
      .sendMessage({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(messageBody),
        DelaySeconds: delaySeconds, // Delay before the message is visible in the queue
      })
      .promise();
    console.log(`Message requeued with delay of ${delaySeconds} seconds:`, messageBody);
  } catch (error) {
    console.error(`Error requeuing message to queue ${queueUrl}:`, error);
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
