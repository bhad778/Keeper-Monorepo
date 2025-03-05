import { Callback, CognitoUserPoolTriggerEvent, Context } from 'aws-lambda';
import { TEmployer, TEmployee } from 'keeperTypes';

import connectToDatabase from '../../db';
import Employee from '../../models/Employee';
import { headers } from '../../constants';
import Employer from '../../models/Employer';
import { extractErrorMessage } from '../../keeperApiUtils';

export const handler = async (
  event: CognitoUserPoolTriggerEvent, // Adjust the type if you have a specific schema for Cognito triggers
  context: Context,
  callback: Callback,
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate required attributes
    const userAttributes = event?.request?.userAttributes;
    if (!userAttributes) {
      throw new Error('Missing userAttributes in the event request.');
    }

    const accountType = userAttributes['custom:accountType'];
    if (!accountType) {
      throw new Error('Missing custom:accountType in userAttributes.');
    }

    await connectToDatabase();

    if (accountType === 'employer') {
      const newEmployer: TEmployer = {
        phoneNumber: userAttributes.phone_number,
        accountType: 'employer',
        createdAt: new Date(),
        isNew: true,
        hasSeenFirstLikeAlert: false,
        expoPushToken: null,
        email: userAttributes['custom:email'],
        hasReceivedLikeNotification: false,
      };

      await Employer.create(newEmployer);
    } else if (accountType === 'employee') {
      const newEmployee: TEmployee = {
        phoneNumber: userAttributes.phone_number,
        accountType: 'employee',
        createdAt: new Date(),
        lastUpdatedOnWeb: null,
        email: userAttributes['custom:email'],
        expoPushToken: null,
        geoLocation: null,
        receivedLikes: [],
        hasSeenFirstLikeAlert: false,
        hasGottenToEditProfileScreen: false,
        hasReceivedLikeNotification: false,
        matches: [],
        settings: {
          firstName: null,
          lastName: null,
          img: null,
          address: null,
          aboutMeText: null,
          relevantSkills: [],
          jobTitle: null,
          searchRadius: null,
          isUsCitizen: null,
          onSiteOptionsOpenTo: null,
          isSeekingFirstJob: null,
          jobHistory: null,
          educationHistory: null,
          employmentTypesOpenTo: null,
          companySizeOptionsOpenTo: [],
          frontendBackendOptionsOpenTo: [],
          yearsOfExperience: null,
        },
        preferences: {
          textSearch: '',
          seniorityLevel: [],
          locationFlexibility: [],
          minimumSalary: null,
          city: '',
          relevantSkills: [],
        },
      };

      await Employee.create(newEmployee);
    } else {
      throw new Error(`Unsupported accountType: ${accountType}`);
    }

    // Return success response
    callback(null, event);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in addCognitoUserToMongoDb:', errorMessage || error);

    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: errorMessage || 'An unexpected error occurred.',
      }),
    });
  }
};
