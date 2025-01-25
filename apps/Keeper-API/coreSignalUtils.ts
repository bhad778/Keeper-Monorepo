import {
  TCoreSignalEducation,
  TCoreSignalExperience,
  TCoreSignalSkill,
  TCoreSignalUserData,
  TEmployeeEducation,
  TEmployeePastJob,
  TEmployeeSettings,
} from 'keeperTypes';
import { v4 as uuidv4 } from 'uuid';
import { TechnologiesList } from 'keeperConstants';

import { transformMonthToString } from './keeperApiUtils';

// we check if the companyName has already been added
// because coreSignal has lots of duplicate data with job history
// returns true if it has already been added
const hasPastExperienceAlreadyBeenAdded = (jobHistory: TEmployeePastJob[], newCompanyName: string) => {
  const companyNamesArray: string[] = [];
  jobHistory.forEach((employeePastJob: TEmployeePastJob) => {
    if (!companyNamesArray.includes(employeePastJob.company)) {
      companyNamesArray.push(employeePastJob.company);
    }
  });
  return companyNamesArray.includes(newCompanyName);
};

const hasPastEducationAlreadyBeenAdded = (educationHistory: TEmployeeEducation[], newSchoolName: string) => {
  const schoolNamesArray: string[] = [];
  educationHistory.forEach((educationItem: TEmployeeEducation) => {
    if (!schoolNamesArray.includes(educationItem.school)) {
      schoolNamesArray.push(educationItem.school);
    }
  });
  return schoolNamesArray.includes(newSchoolName);
};

// converts January 2024 to 01/24
const convertCoreSignalDateToMMYY = (coreSignalDate: string | null) => {
  if (coreSignalDate) {
    const monthString = coreSignalDate.split(' ')[0];
    const yearString = coreSignalDate.split(' ')[1];

    return `${transformMonthToString(monthString)}/${yearString.slice(-2)}`;
  } else {
    return '';
  }
};

const isDateInEnglish = (coreSignalDate: string) => {
  const monthString = coreSignalDate.split(' ')[0];

  switch (monthString) {
    case 'January':
      return true;
    case 'February':
      return true;
    case 'March':
      return true;
    case 'April':
      return true;
    case 'May':
      return true;
    case 'June':
      return true;
    case 'July':
      return true;
    case 'August':
      return true;
    case 'September':
      return true;
    case 'October':
      return true;
    case 'November':
      return true;
    case 'December':
      return true;

    default:
      return false;
  }
};

export const coreSignalJobHistoryTransformer = (coreSignalJobHistory: TCoreSignalExperience[]) => {
  const updatedJobHistory: TEmployeePastJob[] = [];

  coreSignalJobHistory.forEach((coreSignalExperience: TCoreSignalExperience) => {
    if (
      coreSignalExperience.company_name &&
      !hasPastExperienceAlreadyBeenAdded(updatedJobHistory, coreSignalExperience.company_name) &&
      coreSignalExperience.date_from &&
      isDateInEnglish(coreSignalExperience.date_from)
    ) {
      const employeePastJob: TEmployeePastJob = {
        uuid: uuidv4(),
        jobTitle: coreSignalExperience.title || '',
        company: coreSignalExperience.company_name || '',
        startDate: convertCoreSignalDateToMMYY(coreSignalExperience.date_from),
        endDate: convertCoreSignalDateToMMYY(coreSignalExperience.date_to),
        jobDescription: coreSignalExperience?.description?.replace(/<\/[^>]+(>|$)/g, '') || '',
      };

      updatedJobHistory.push(employeePastJob);
    }
  });

  return updatedJobHistory;
};

const coreSignalEducationTransformer = (coreSignalEducationHistory: TCoreSignalEducation[]) => {
  const updatedEducationHistory: TEmployeeEducation[] = [];
  coreSignalEducationHistory.forEach((coreSignalEducationItem: TCoreSignalEducation) => {
    if (
      coreSignalEducationItem.title &&
      !hasPastEducationAlreadyBeenAdded(updatedEducationHistory, coreSignalEducationItem.title) &&
      coreSignalEducationItem.date_from &&
      // theres no real way to filter out bad education data, so were just gonna add
      // the first one that is good and no more
      updatedEducationHistory.length === 0
    ) {
      // only add if its good data
      const employeeEducationItem: TEmployeeEducation = {
        uuid: uuidv4(),
        school: coreSignalEducationItem.title,
        major: coreSignalEducationItem.subtitle,
        endDate: coreSignalEducationItem.date_from,
        degree: `Bachelor's`,
      };
      updatedEducationHistory.push(employeeEducationItem);
    }
  });
  return updatedEducationHistory;
};

const coreSignalSkillsTransformer = (coreSignalSkills: TCoreSignalSkill[]) => {
  const updatedSkills: string[] = [];

  coreSignalSkills.forEach((coreSignalSkillObject: TCoreSignalSkill) => {
    const coreSignalSkill = coreSignalSkillObject.member_skill_list.skill;

    // check if this skill affinda got from the
    // resume matches a skill that keeper recognizes
    TechnologiesList.forEach((keeperSkill: string) => {
      // this regex removes all punctuation and spaces, so Node.JS
      // will match Nodejs and also will match node js
      const noCaseSkillName = coreSignalSkill
        ?.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
        .replace(/\s/, '')
        .toLowerCase();

      const noCaseKeeperSkill = keeperSkill
        ?.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
        .replace(/\s/, '')
        .toLowerCase();

      if (noCaseSkillName.includes(noCaseKeeperSkill)) {
        if (!updatedSkills.includes(keeperSkill)) {
          updatedSkills.push(keeperSkill);
        }
      }
    });
  });
  return updatedSkills;
};

const countCommas = (str: string) => {
  // Split the string by commas
  // The length of the resulting array minus one gives the count of commas
  return str.split(',').length - 1;
};

function removeAfterLastComma(str: string) {
  const lastCommaIndex = str.lastIndexOf(',');
  if (lastCommaIndex !== -1) {
    return str.substring(0, lastCommaIndex); // Exclude the comma itself
  }
  return str; // Return original string if no comma found
}

const removeCountryFromString = (str: string) => {
  if (countCommas(str) >= 3) {
    return removeAfterLastComma(str);
  } else {
    return str;
  }
};

export const coreSignalResumeTransformer = (coreSignalUserData: TCoreSignalUserData) => {
  const updatedResume: TEmployeeSettings = {
    firstName: coreSignalUserData.first_name || undefined,
    lastName: coreSignalUserData.last_name || undefined,
    img: coreSignalUserData.logo_url || undefined,
    // address: coreSignalUserData?.location?.replace(', United States', '') || undefined,
    address: removeCountryFromString(coreSignalUserData?.location) || undefined,
    aboutMeText: coreSignalUserData?.summary?.replace(/<\/[^>]+(>|$)/g, '') || undefined,
    jobTitle: coreSignalUserData.title || undefined,
    searchRadius: 50,
    employmentTypesOpenTo: undefined,
    isUsCitizen: true,
    onSiteOptionsOpenTo: undefined,
    isSeekingFirstJob: undefined,
    yearsOfExperience: undefined,
    relevantSkills: coreSignalSkillsTransformer(coreSignalUserData.member_skills_collection),
    jobHistory: coreSignalJobHistoryTransformer(coreSignalUserData.member_experience_collection),
    educationHistory: coreSignalEducationTransformer(coreSignalUserData.member_education_collection),
    frontendBackendOptionsOpenTo: [],
    companySizeOptionsOpenTo: [],
    linkedInUrl: coreSignalUserData.url,
  };

  return updatedResume;
};
