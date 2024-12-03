import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';

export const handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const getEmployeeSchema = Joi.object({
    userId: Joi.string().required(),
  });

  const isError = ValidateBody(event, getEmployeeSchema, callback);

  if (isError) return;

  // Validate request body
  if (!event.body) {
    throw new Error('Missing request body.');
  }

  const { userId } = JSON.parse(event.body);

  connectToDatabase().then(() => {
    Employee.findById(userId)
      .exec()
      .then((res) => {
        if (res) {
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify(res),
          });
        } else {
          return callback(null, {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              error: 'Account deleted error',
            }),
          });
        }
      })
      .catch((err) => callback(new Error(err)));
  });
};
