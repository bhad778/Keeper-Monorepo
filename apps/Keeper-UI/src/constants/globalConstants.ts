import {
  TOnsiteSchedule,
  TBenefitOptions,
  EmploymentTypes,
  TCompanySize,
  TFrontendBackendOptions,
  TOperatingSystem,
  TEmployerFilterListOptions,
} from 'keeperTypes';
import { TWorkAuthOptions } from 'types/globalTypes';

export const bottomTabNavigatorBaseHeight = 80;

export const employmentTypeOptions: EmploymentTypes[] = ['Salary', 'Contract'];

export const onSiteOptions: TOnsiteSchedule[] = ['Remote', 'Hybrid', 'Office'];

export const companySizeOptions: TCompanySize[] = ['Startup', 'Mid-Size', 'Large'];

export const frontendBackendOptions: TFrontendBackendOptions[] = ['Only Frontend', 'Full Stack', 'Only Backend'];

export const workAuthOptions: TWorkAuthOptions[] = ['Authorized', 'Not Authorized'];

export const operatingSystemOptions: TOperatingSystem[] = ['Mac', 'Windows', 'Either'];

export const benefitOptions: TBenefitOptions[] = ['None', 'Dental', 'Vision', 'Health Care', '401k'];

export const jobColors = ['#F4C0FF', '#DCEF70', '#97DAFF', '#A0E0BF', '#FF6A52', '#CEE1EE', '#FED978'];

export const filterList: TEmployerFilterListOptions[] = [
  'Experience',
  'Skills',
  'Work Auth',
  'Company Size',
  'Frontend/Backend',
  'Salary/Contract',
];

export const getItemsForSwipingLimit = 30;

export const genericErrorMessage = 'There was an error, please try again.';

export const backoutWithoutSavingTitle = 'You are backing out without saving.';
export const backoutWithoutSavingSubTitle = 'Are you sure you want to close and lose your progress?';

export const transFormFrontendOrBackendValue = (value: number) => {
  return `${value}% Frontend ${100 - value}% Backend`;
};

export const monthArray = [
  { label: 'January', value: 'January' },
  { label: 'February', value: 'February' },
  { label: 'March', value: 'March' },
  { label: 'April', value: 'April' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'June' },
  { label: 'July', value: 'July' },
  { label: 'August', value: 'August' },
  { label: 'September', value: 'September' },
  { label: 'October', value: 'October' },
  { label: 'November', value: 'November' },
  { label: 'December', value: 'December' },
];

export const yearArray = [
  { label: '2023', value: '2023' },
  { label: '2022', value: '2022' },
  { label: '2021', value: '2021' },
  { label: '2020', value: '2020' },
  { label: '2019', value: '2019' },
  { label: '2018', value: '2018' },
  { label: '2017', value: '2017' },
  { label: '2016', value: '2016' },
  { label: '2015', value: '2015' },
  { label: '2014', value: '2014' },
  { label: '2013', value: '2013' },
  { label: '2012', value: '2012' },
  { label: '2011', value: '2011' },
  { label: '2010', value: '2010' },
  { label: '2009', value: '2009' },
  { label: '2008', value: '2008' },
  { label: '2007', value: '2007' },
  { label: '2006', value: '2006' },
  { label: '2005', value: '2005' },
  { label: '2004', value: '2004' },
  { label: '2003', value: '2003' },
  { label: '2002', value: '2002' },
  { label: '2001', value: '2001' },
  { label: '2000', value: '2000' },
  { label: '1999', value: '1999' },
  { label: '1998', value: '1998' },
  { label: '1997', value: '1997' },
  { label: '1996', value: '1996' },
  { label: '1995', value: '1995' },
  { label: '1994', value: '1994' },
  { label: '1993', value: '1993' },
  { label: '1992', value: '1992' },
  { label: '1991', value: '1991' },
  { label: '1990', value: '1990' },
];
