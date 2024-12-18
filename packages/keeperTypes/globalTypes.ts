export type TGeoLocation = {
  type: string;
  coordinates: Array<number>;
};

export type TMatch =
  | {
      name: string;
      custom: {
        profileUrl: string;
        hasNotification: boolean;
        expoPushToken: string;
        isNew: boolean;
        jobId: string;
        jobOwnerId: string;
        jobOwnerEmail: string;
        jobColor: string;
        jobTitle: string;
        jobImg: string;
        companyName: string;
        employeeId: string;
        employeeColor: string;
        employeeEmail: string;
      };
      description: string;
      eTag: string;
      id: string;
      updated: string;
    }
  | EmptyObject;

export type TSwipe = {
  ownerId: string | undefined;
  isRightSwipe: boolean;
  receiverId: string | undefined;
  timeStamp: Date;
  createdOnWeb: boolean;
};

export type TGrowthEngineEntry = {
  email: string;
  firstName: string;
  accountType: string;
  yearsOfExperience: string;
  mainSkill: string;
};

export enum EmploymentTypeEnum {
  'Salary',
  'Contract',
}

export type TCompanySize = 'Startup' | 'Mid-Size' | 'Large';

export type TFrontendBackendOptions = 'Only Frontend' | 'Full Stack' | 'Only Backend';

export type TWorkAuthOptions = 'Authorized' | 'Not Authorized';

export type TOperatingSystem = 'Mac' | 'Windows' | 'Either';

export type EmploymentTypes = 'Salary' | 'Contract';

export type TAccountType = 'employee' | 'employer' | '';

export enum EducationEnum {
  'Bootcamp' = 0,
  "Bachelor's" = 1,
  "Master's" = 2,
  'Doctorate' = 3,
}

export type TImagePayload = {
  mime: string;
  image: string;
};

export type TPubnubNotificationMessageObject = {
  to: string;
  title: string;
  body: string;
  sound: string;
  data: {
    type: 'match' | 'message' | 'receivedLike';
    senderId: string;
    receiverId: string;
  };
};

export type EmptyObject = Record<any, never>;
