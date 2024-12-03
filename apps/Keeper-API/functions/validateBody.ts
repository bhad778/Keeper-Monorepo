import { APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';

const ValidateBody = (event: APIGatewayEvent, joiSchema, callback?: APIGatewayProxyCallback): Boolean => {
  if (event.body == null) {
    if (callback) {
      callback(null, {
        statusCode: 422,
        body: JSON.stringify({
          message: 'You have sent a null request body',
          input: event,
        }),
      });
    }

    return true;
  }
  const requestBody = JSON.parse(event.body);

  const result = joiSchema.validate(requestBody);

  if (result.error) {
    console.error('Error:', result.error);
    if (callback) {
      callback(null, {
        statusCode: 422,
        body: JSON.stringify({
          message: result?.error?.message,
          input: event,
        }),
      });
    }
    return true;
  }
  return false;
};

export default ValidateBody;
