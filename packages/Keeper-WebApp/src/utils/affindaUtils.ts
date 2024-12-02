import { ResumeData, Education, ResumeDataWorkExperienceItem, ResumeDataSkillsItem } from '@affinda/affinda';
import { TEmployeeEducation, TEmployeePastJob, TEmployeeSettings } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { TechnologiesList } from 'constants/TechnologiesList';

export const addAffindaSkillsToJobHistoryItem = (
  workItem: ResumeDataWorkExperienceItem,
  affindaSkills: ResumeDataSkillsItem[]
) => {
  const jobSkills: string[] = [];
  affindaSkills.map((skill: ResumeDataSkillsItem) => {
    skill?.sources?.map((sourceItem) => {
      let tempKeepSkill = '';
      if (
        // check if affinda got this skill from this workExperience
        sourceItem.workExperienceId == workItem.id &&
        // check if this skill affinda got from the
        // resume matches  a skill that keeper recognizes
        TechnologiesList.some((keeperSkill: string) =>
          // this regex removes all punctuation and spaces, so Node.JS
          // will match Nodejs and also will match node js
          {
            const noCaseSkillName = skill.name
              ?.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
              .replace(/\s/, '')
              .toLowerCase();

            const noCaseKeeperSkill = keeperSkill
              .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
              .replace(/\s/, '')
              .toLowerCase();

            if (noCaseSkillName && noCaseSkillName.includes(noCaseKeeperSkill)) {
              if (!jobSkills.includes(keeperSkill)) {
                tempKeepSkill = keeperSkill;
                return true;
              }
            } else {
              return false;
            }
          }
        )
      ) {
        if (tempKeepSkill !== 'C#') {
          jobSkills.push(tempKeepSkill);
        }
      }
    });
  });
  return jobSkills;
};

export const affindaSkillsTransformer = (affindaSkills: ResumeDataSkillsItem[]) => {
  const transformedSkills: string[] = [];
  affindaSkills.map((skill: ResumeDataSkillsItem) => {
    let tempKeepSkill = '';
    if (
      // check if this skill affinda got from the
      // resume matches  a skill that keeper recognizes
      TechnologiesList.some((keeperSkill: string) =>
        // this regex removes all punctuation and spaces, so Node.JS
        // will match Nodejs and also will match node js
        {
          const noCaseSkillName = skill.name
            ?.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
            .replace(/\s/, '')
            .toLowerCase();

          const noCaseKeeperSkill = keeperSkill
            .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
            .replace(/\s/, '')
            .toLowerCase();

          if (noCaseSkillName && noCaseSkillName.includes(noCaseKeeperSkill)) {
            if (noCaseSkillName?.includes('react')) {
              transformedSkills.push('React');
            }
            if (!transformedSkills.includes(keeperSkill)) {
              tempKeepSkill = keeperSkill;
              return true;
            }
          } else {
            return false;
          }
        }
      )
    ) {
      transformedSkills.push(tempKeepSkill);
    }
  });
  return transformedSkills;
};

const convertDateToMMYY = (date: string) => {
  if (date && typeof date === 'string') {
    const splitDate = date.split('-');
    const month = splitDate[1];
    const year = splitDate[0].slice(-2);
    return `${month}/${year}`;
  } else {
    return '00/00';
  }
};

const convertDatetoYYYY = (date: string) => {
  return date.split('-')[0];
};

export const affindaResumeTransformer = (jsonResume: ResumeData) => {
  // extra data that we can use thats not in resume- geolocation, phoneNumber
  const transformedJsonResume: TEmployeeSettings = {};
  // if (jsonResume?.location) {
  //   // TODO- make state GA from Georgia, which it naturally is from affinda
  //   transformedJsonResume.address = jsonResume.location.city + ', ' + jsonResume.location.state;
  // }
  // if (jsonResume?.name?.first) {
  //   transformedJsonResume.firstName = jsonResume.name.first;
  // }
  // if (jsonResume?.name?.last) {
  //   transformedJsonResume.lastName = jsonResume.name.last;
  // }
  // if (jsonResume?.totalYearsExperience) {
  //   transformedJsonResume.yearsOfExperience = jsonResume.totalYearsExperience;
  // }
  // if (jsonResume?.profession) {
  //   transformedJsonResume.jobTitle = jsonResume.profession;
  //   transformedJsonResume.jobTitle = '';
  // }
  if (jsonResume?.skills) {
    transformedJsonResume.relevantSkills = affindaSkillsTransformer(jsonResume?.skills);
  }
  if (jsonResume?.education?.length) {
    const transformedEducationHistory: TEmployeeEducation[] = [];
    jsonResume?.education.map((educationItem: Education) => {
      transformedEducationHistory.push({
        uuid: educationItem.id || uuidv4(),
        school: educationItem.organization || '',
        major: educationItem.accreditation?.education || '',
        startDate: convertDatetoYYYY(educationItem?.dates?.startDate || ''),
        endDate: convertDatetoYYYY(educationItem?.dates?.completionDate || ''),
        degree: `Bachelor's`,
      });
    });
    transformedJsonResume.educationHistory = transformedEducationHistory;
  }
  if (jsonResume?.workExperience?.length) {
    const transformedWorkHistory: TEmployeePastJob[] = [];
    jsonResume?.workExperience.map((workItem: ResumeDataWorkExperienceItem) => {
      transformedWorkHistory.push({
        uuid: workItem.id || uuidv4(),
        jobTitle: workItem.jobTitle || '',
        company: workItem.organization || '',
        jobDescription: workItem.jobDescription || '',
        startDate: convertDateToMMYY(workItem?.dates?.startDate),
        endDate: convertDateToMMYY(workItem?.dates?.endDate),
        // do we need location?
      });
    });
    transformedJsonResume.jobHistory = transformedWorkHistory;
  }
  return transformedJsonResume;
};
