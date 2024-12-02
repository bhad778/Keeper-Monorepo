import { InferSchemaType } from 'mongoose';

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
  yearsOfExperience: number;
  mainSkill: string;
  accountType: string;
  hasReceivedEmail: boolean;
};

export enum AccountTypeEnum {
  employee = 'employee',
  employer = 'employer',
}

export enum EmploymentTypeEnum {
  'Salary',
  'Contract',
}

export type TOnsiteSchedule = 'Remote' | 'Hybrid' | 'Office';

export type TCompanySize = 'Startup' | 'Mid-Size' | 'Large';

export type TWorkAuthOptions = 'Authorized' | 'Not Authorized';

export type TFrontendBackendOptions = 'Only Frontend' | 'Full Stack' | 'Only Backend';

export type TAccountType = 'employee' | 'employer';

export enum EducationEnum {
  'None' = 0,
  "Bachelor's" = 1,
  "Master's" = 2,
  'Doctorate' = 3,
}

export type TPubnubNotificationMessageObject = {
  to: string;
  title: string;
  body: string;
  sound: string;
  data: {
    type: 'match' | 'message' | 'like';
    senderId: string;
    receiverId: string;
  };
};

export type TImagePayload = {
  mime: string;
  image: string;
};

export type EmptyObject = Record<any, never>;
