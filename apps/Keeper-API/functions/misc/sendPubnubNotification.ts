import axios from 'axios';
import PubNub from 'pubnub';
import * as Joi from 'joi';
import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';

import { headers } from '../../constants';
import ValidateBody from '../validateBody';
import { PubnubNotificationMessageObjectSchema } from '../../schemas/globalSchemas';

const pubnubPublishKey = process.env.PUBNUB_PUBLISH_KEY;
const pubnubSubscribeKey = process.env.PUBNUB_SUBSCRIBE_KEY;

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!event.body) {
      throw new Error('Bad Request: Missing body in the event.');
    }

    const params = Joi.object({
      messageObject: PubnubNotificationMessageObjectSchema.required(),
    });

    const isError = ValidateBody(event, params);
    if (isError) {
      throw new Error('Validation failed for request body.');
    }

    const { messageObject } = JSON.parse(event.body);
    const { data } = messageObject;
    const { senderId, receiverId } = data;

    if (!pubnubPublishKey || !pubnubSubscribeKey) {
      throw new Error('Server Error: PubNub keys are not configured.');
    }

    const pubnub = new PubNub({
      publishKey: pubnubPublishKey,
      subscribeKey: pubnubSubscribeKey,
      userId: senderId,
    });

    // Check if the user is currently on the web app
    const isUserCurrentlyOnWebapp = await checkIfDesktopUserIsCurrentlyOnline(pubnub, receiverId);

    // Send mobile push notification if user is not currently on the web app
    if (!isUserCurrentlyOnWebapp && messageObject.to !== 'none' && messageObject.to !== 'empty') {
      await sendMobilePushNotification(messageObject);
    }

    // Send web push notification
    await sendWebPushNotification(pubnub, receiverId, data);

    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: 'Successfully sent push notification' }),
    });
  } catch (error) {
    console.error('Error in sendPubnubNotification:', error || error);

    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: error || 'An unexpected error occurred.',
      }),
    });
  }
};

// Helper function to check if the user is currently online
const checkIfDesktopUserIsCurrentlyOnline = async (pubnub: PubNub, receiverId: string) => {
  try {
    const response = await pubnub.hereNow({ channels: [receiverId] });
    return response.totalOccupancy > 0;
  } catch (error) {
    console.error('Error checking user online status:', error);
    return false;
  }
};

// Helper function to send mobile push notifications
const sendMobilePushNotification = async (messageObject: any) => {
  try {
    await axios.post('https://exp.host/--/api/v2/push/send', messageObject, {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending mobile push notification:', error);
  }
};

// Helper function to send web push notifications
const sendWebPushNotification = async (pubnub: PubNub, receiverId: string, data: any) => {
  try {
    await pubnub.publish({
      channel: receiverId,
      message: data,
    });
  } catch (error) {
    console.error('Error sending web push notification:', error);
  }
};
