import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import axios from 'axios';
import { extractErrorMessage } from 'keeperUtils';
import AWS from 'aws-sdk';

import { headers, SENDER_EMAIL } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import Job from '../../models/Job';
import Employer from '../../models/Employer';
import Swipe from '../../models/Swipe';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const recordSwipeSchema = Joi.object({
      ownerId: Joi.string().required(),
      isRightSwipe: Joi.boolean().required(),
      receiverId: Joi.string().required(),
      timeStamp: Joi.string().required(),
      createdOnWeb: Joi.boolean().required(),
      isMatch: Joi.boolean().required(),
      accountType: Joi.string().required(),
      likeNotificationObject: Joi.any(),
      jobOwnerId: Joi.string().allow(''),
    });

    const isError = ValidateBody(event, recordSwipeSchema, callback);
    if (isError) return;

    const newSwipe = JSON.parse(event.body);

    await connectToDatabase();

    const isEmployee = newSwipe.accountType === 'employee';
    let receivingUser, receivingEmployer;

    // Fetch receiver data
    if (isEmployee) {
      receivingUser = await Job.findById(newSwipe.receiverId).exec();
      if (newSwipe.jobOwnerId) {
        receivingEmployer = await Employer.findById(newSwipe.jobOwnerId).exec();
      }
    } else {
      receivingUser = await Employee.findById(newSwipe.receiverId).exec();
    }

    if (!receivingUser) {
      throw new Error('Receiving user not found.');
    }

    // Helper function: Send email notification
    const sendEmailNotification = async () => {
      const discoverLink = isEmployee
        ? 'https://keepertechjobs.io/employerHome/jobBoard'
        : 'https://keepertechjobs.io/employeeHome/discover';

      const email = isEmployee ? receivingUser.ownerEmail : receivingUser.email;
      const template = isEmployee ? 'YouReceivedALikeJobTemplate' : 'YouReceivedALikeEmployeeTemplate';

      if (email) {
        const params = {
          Source: SENDER_EMAIL,
          Template: template,
          Destination: {
            ToAddresses: [email],
          },
          TemplateData: JSON.stringify({ discoverlink: discoverLink }),
        };

        const ses = new AWS.SES({ apiVersion: '2010-12-01' }) as any;

        return ses.sendTemplatedEmail(params).promise();
      }
    };

    // Helper function: Send push notification
    const sendPushNotification = async () => {
      if (newSwipe.likeNotificationObject) {
        try {
          await axios.post(`${process.env.ROOT_URL}/sendPubnubNotification`, {
            messageObject: newSwipe.likeNotificationObject,
          });
        } catch (error) {
          console.error('Error with sendPubnubNotification call inside recordSwipe:', error);
        }
      }
    };

    // Handle right swipe notifications and updates
    if (newSwipe.isRightSwipe && !newSwipe.isMatch) {
      await sendPushNotification();
      const emailPromise = sendEmailNotification();

      if (isEmployee && receivingEmployer) {
        receivingEmployer.hasReceivedLikeNotification = true;
        receivingEmployer.markModified('hasReceivedLikeNotification');
        await receivingEmployer.save();
      } else {
        receivingUser.hasReceivedLikeNotification = true;
        receivingUser.markModified('hasReceivedLikeNotification');
      }

      receivingUser.receivedLikes.push(newSwipe.ownerId);
      receivingUser.markModified('receivedLikes');

      if (emailPromise) {
        await emailPromise;
      }
    }

    // Save swipe and receiving user
    await Promise.all([Swipe.create(newSwipe), receivingUser.save()]);

    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Successfully recorded swipe' }),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in recordSwipe:', errorMessage || error);

    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: errorMessage || 'An unexpected error occurred.',
      }),
    });
  }
};
