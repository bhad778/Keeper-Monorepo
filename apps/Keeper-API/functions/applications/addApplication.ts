import { APIGatewayEvent, Context } from 'aws-lambda';

import Application from '../../models/Application';
import { headers } from '../../constants';
import connectToDatabase from '../../db';
import { extractErrorMessage } from '../../keeperApiUtils';

// ex payload
// {
//   "employeeId": "64a58544b219fe17f06f38d8",
//   "jobId": "6785d6241bda7a0519f060a8"
// }
export const handler = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { employeeId, jobId }: { employeeId: string; jobId: string } = JSON.parse(event.body);

    // Validate that employeeId and jobId are provided
    if (!employeeId || !jobId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'employeeId and jobId are required' }),
      };
    }

    // Connect to the database
    await connectToDatabase();

    // Create a new job application document
    const newApplication = new Application({
      employeeId,
      jobId,
    });

    // Save the job application
    await newApplication.save();

    console.info('Job application created successfully.');

    return {
      statusCode: 201,
      // headers,
      body: JSON.stringify({
        success: true,
        message: 'Job application created successfully',
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Error creating job application: ${errorMessage}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        errorMessage: errorMessage,
      }),
    };
  }
};
