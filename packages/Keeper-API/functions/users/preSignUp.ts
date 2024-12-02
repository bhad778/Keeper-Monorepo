import { CognitoUserPoolEvent, Context, Callback } from 'aws-lambda';

export const handler = (event: CognitoUserPoolEvent, context: Context, callback: Callback) => {
  event.response.autoConfirmUser = true;
  event.response.autoVerifyPhone = true;
  callback(null, event);
};
