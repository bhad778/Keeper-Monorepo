import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import { extractErrorMessage } from 'keeperUtils';
import { AccountTypeEnum } from 'keeperTypes';
import { AWS } from 'keeperEnvironment';

import { colors, headers, SENDER_EMAIL } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import Job from '../../models/Job';
import { AccountTypeSchema, TMatchSchema } from '../../schemas/globalSchemas';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const addUserMatchSchema = Joi.object({
      accountType: AccountTypeSchema,
      loggedInUserMatch: TMatchSchema.required(),
      otherUserMatch: TMatchSchema.required(),
    });

    const isError = ValidateBody(event, addUserMatchSchema, callback);
    if (isError) return;

    const { accountType, loggedInUserMatch, otherUserMatch } = JSON.parse(event.body);

    // Extract user IDs from match ID
    const [loggedInUserId, otherUserId] = loggedInUserMatch.id.split('-');
    const isEmployee = accountType === AccountTypeEnum.employee;

    await connectToDatabase();

    // Fetch the logged-in user and other user objects
    const [loggedInUserObject, otherUserObject] = isEmployee
      ? await Promise.all([Employee.findById(loggedInUserId).exec(), Job.findById(otherUserId).exec()])
      : await Promise.all([Job.findById(loggedInUserId).exec(), Employee.findById(otherUserId).exec()]);

    if (!loggedInUserObject || !otherUserObject) {
      throw new Error('User not found.');
    }

    // Assign a color for the match
    const assignColor = matches => {
      const colorsArray = colors;
      const latestFiveColors = matches?.slice(-5).map(match => match.custom.employeeColor) || [];
      return colorsArray.find(color => !latestFiveColors.includes(color)) || '#acfcf2';
    };

    // Update matches for both users
    const tempLoggedInUserMatch = {
      ...loggedInUserMatch,
      custom: {
        ...loggedInUserMatch.custom,
        employeeColor: assignColor(loggedInUserObject.matches),
      },
    };

    const tempOtherUserMatch = {
      ...otherUserMatch,
      custom: {
        ...otherUserMatch.custom,
        employeeColor: assignColor(otherUserObject.matches),
      },
    };

    (loggedInUserObject.matches ??= []).push(tempLoggedInUserMatch);
    loggedInUserObject.receivedLikes = (loggedInUserObject.receivedLikes ?? []).filter(id => id !== otherUserId);
    loggedInUserObject.markModified('matches');
    loggedInUserObject.markModified('receivedLikes');

    (otherUserObject.matches ??= []).push(tempOtherUserMatch);
    otherUserObject.receivedLikes = (otherUserObject.receivedLikes ?? []).filter(id => id !== loggedInUserId);
    otherUserObject.markModified('matches');
    otherUserObject.markModified('receivedLikes');

    // Save both user objects
    await Promise.all([loggedInUserObject.save(), otherUserObject.save()]);

    // Send email notification
    const receiverEmail = isEmployee ? (otherUserObject as any).ownerEmail : (otherUserObject as any).email;
    if (receiverEmail) {
      const matchesPageLink = isEmployee
        ? 'https://keepertechjobs.io/employerHome/matches'
        : 'https://keepertechjobs.io/employeeHome/matches';

      const emailTemplate = isEmployee ? 'YouReceivedAMatchJobTemplate' : 'YouReceivedAMatchEmployeeTemplate';

      const emailParams = {
        Source: SENDER_EMAIL,
        Template: emailTemplate,
        Destination: { ToAddresses: [receiverEmail] },
        TemplateData: JSON.stringify({ matchespagelink: matchesPageLink }),
      };

      const ses = new AWS.SES({ apiVersion: '2010-12-01' }) as any;

      return ses.sendTemplatedEmail(emailParams).promise();
    }

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Success',
        loggedInUserMatch: tempLoggedInUserMatch,
        otherUserMatch: tempOtherUserMatch,
      }),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in addMatch:', errorMessage || error);

    // Return error response
    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: errorMessage || 'An unexpected error occurred.',
      }),
    });
  }
};
