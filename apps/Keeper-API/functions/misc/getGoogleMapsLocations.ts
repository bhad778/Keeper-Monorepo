import * as Joi from 'joi';
import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import axios from 'axios';
import { extractErrorMessage } from 'keeperUtils';
import { googleMapsApiKey } from 'keeperEnvironment';

import { headers } from '../../constants';
import ValidateBody from '../validateBody';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate the request body
    if (!event.body) {
      throw new Error('Bad Request: Missing body in the event.');
    }

    const paramsSchema = Joi.object({
      locationText: Joi.string().required(),
      isPing: Joi.boolean(),
    });

    const isError = ValidateBody(event, paramsSchema);
    if (isError) {
      throw new Error('Validation failed for request body.');
    }

    const { locationText, isPing } = JSON.parse(event.body);

    // Handle ping requests
    if (isPing) {
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify('Ping Successful'),
      });
    }

    // Handle Google Maps API request
    if (!googleMapsApiKey) {
      throw new Error('Server Error: Google Maps API key is not configured.');
    }

    const locationRes = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
      params: {
        input: locationText,
        types: 'geocode',
        key: googleMapsApiKey,
      },
    });

    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(locationRes.data.predictions),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in getGoogleMapsLocations:', errorMessage || error);

    return callback(null, {
      statusCode: errorMessage.includes('Validation') || errorMessage.includes('Bad Request') ? 400 : 500,
      headers,
      body: JSON.stringify({
        error: errorMessage || 'An unexpected error occurred.',
      }),
    });
  }
};
